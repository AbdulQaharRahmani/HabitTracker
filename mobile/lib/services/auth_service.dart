import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:habit_tracker/services/token_storage.dart';
import 'package:http/http.dart' as http;

import 'http_client.dart';
import '../utils/category/category_model.dart';

import '../screens/statisticScreen/data/models/daily_consistency.dart';
import '../utils/profile/profile_model.dart';
import '../utils/today_progressBar/task_item.dart';


// ============================================================================
// API SERVICE
// ============================================================================

class AuthService {
  // ---------------------------------------------------------------------------
  // BASE
  // ---------------------------------------------------------------------------

  static const String _base = "https://habit-tracker-17sr.onrender.com";
  static const String _api = "$_base/api";

  // ---------------------------------------------------------------------------
  // TOKEN & HEADERS (Single Source of Truth)
  // ---------------------------------------------------------------------------

  Future<Map<String, String>> _headers({bool auth = true}) async {
    final headers = {"Content-Type": "application/json"};
    if (auth) {
      final token = await AuthManager.getToken();
      if (token != null && token.isNotEmpty) {
        headers["Authorization"] = "Bearer $token";
      }
    }
    return headers;
  }

  String _formatDate(DateTime date) {
    return "${date.year.toString().padLeft(4, '0')}-"
        "${date.month.toString().padLeft(2, '0')}-"
        "${date.day.toString().padLeft(2, '0')}";
  }

  // ===========================================================================
  // AUTH
  // ===========================================================================

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    try {
      final res = await http.post(
        Uri.parse("$_api/auth/login"),
        headers: await _headers(auth: false),
        body: jsonEncode({
          "email": email,
          "password": password,
        }),
      );

      final data = jsonDecode(res.body);

      if (res.statusCode == 200 && data['success'] == true) {
        final userData = data['data'];

        // 🔑 Access Token
        final token = userData['token'] ?? userData['accessToken'];
        if (token != null && token.toString().isNotEmpty) {
          await AuthManager.saveToken(token);
        }

        // 🔑 Refresh Token
        final refreshToken =
            userData['refreshToken'] ??
            data['refreshToken'] ??
            _extractRefreshTokenFromSetCookie(res.headers['set-cookie']);
        if (refreshToken != null && refreshToken.toString().isNotEmpty) {
          await AuthManager.saveRefreshToken(refreshToken);
        }

        final name = userData['username'];
        final userEmail = userData['email'];

        if (name != null && name.toString().isNotEmpty && userEmail != null && userEmail.toString().isNotEmpty) {
          await AuthManager.saveUserData(name, userEmail);
        }
      }

      return data;
    } catch (e) {
      return {'success': false, 'message': 'Login failed: $e'};
    }
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final res = await http.post(
        Uri.parse("$_api/auth/register"),
        headers: await _headers(auth: false),
        body: jsonEncode({
          "username": name,
          "email": email,
          "password": password,
        }),
      );

      final data = jsonDecode(res.body);

      if (data['success'] == true) {
        await login(email: email, password: password);
      }

      return data;
    } catch (e) {
      return {'success': false, 'message': 'Registration failed: $e'};
    }
  }

  // ===========================================================================
  // PROFILE
  // ===========================================================================

  Future<Map<String, dynamic>> getUserProfile() async {
    try {
      final res = await AuthenticatedHttpClient.get('/users/preference');
      return jsonDecode(res.body);
    } catch (e) {
      return {'success': false, 'message': 'Failed to fetch user profile: $e'};
    }
  }

  Future<Map<String, dynamic>> getHabitsDashboard() async {
    try {
      final res = await http.get(
        Uri.parse("$_api/habits/dashboard"),
        headers: await _headers(),
      );

      return jsonDecode(res.body);
    } catch (e) {
      return {'success': false, 'message': 'Failed to fetch habits dashboard: $e'};
    }
  }

  Future<Welcome> fetchHabitsDashboard() async {
    try {
      final res = await AuthenticatedHttpClient.get('/habits/dashboard');

      if (res.statusCode == 200) {
        final welcome = welcomeFromJson(res.body);
        return welcome;
      } else {
        throw Exception('Failed to load dashboard: ${res.statusCode}');
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<Map<String, dynamic>> uploadProfileImage(File image) async {
    try {
      final token = await AuthManager.getToken();
      if (token == null || token.isEmpty) {
        return {'success': false, 'message': 'Session expired, please login again'};
      }

      // Keep compatibility with older backend variants that may still expect "image".
      final byProfilePicture = await _uploadProfileImageWithField(
        image: image,
        token: token,
        fieldName: 'profilePicture',
      );
      if (byProfilePicture['success'] == true) return byProfilePicture;
      final status = byProfilePicture['statusCode'] as int? ?? 0;
      if (status != 400 && status != 500) return byProfilePicture;

      final byImage = await _uploadProfileImageWithField(
        image: image,
        token: token,
        fieldName: 'image',
      );
      return byImage;
    } catch (e) {
      return {'success': false, 'message': 'Failed to upload profile image: $e'};
    }
  }

  Future<Map<String, dynamic>> _uploadProfileImageWithField({
    required File image,
    required String token,
    required String fieldName,
  }) async {
    final request = http.MultipartRequest(
      "POST",
      Uri.parse("$_api/users/profile-picture"),
    );
    request.headers["Authorization"] = "Bearer $token";
    request.files.add(await http.MultipartFile.fromPath(fieldName, image.path));

    final response = await http.Response.fromStream(await request.send());
    Map<String, dynamic> body;
    try {
      body = jsonDecode(response.body) as Map<String, dynamic>;
    } catch (_) {
      body = {
        'success': response.statusCode >= 200 && response.statusCode < 300,
        'message': response.body,
      };
    }
    body['success'] = body['success'] == true;
    body['message'] = body['message']?.toString() ??
        body['error']?.toString() ??
        body['code']?.toString() ??
        'Request failed (${response.statusCode})';
    body['statusCode'] = response.statusCode;
    return body;
  }

  Future<Map<String, dynamic>> getProfileImage({String? userId}) async {
    try {
      // New backend variant
      final res = await AuthenticatedHttpClient.get('/users/profile-picture');
      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      // Old backend variant
      if (userId != null && userId.isNotEmpty) {
        final legacy = await AuthenticatedHttpClient.get('/users/$userId/profile-picture');
        return jsonDecode(legacy.body);
      }
      return {'success': false, 'message': 'Profile image endpoint unavailable'};
    } catch (e) {
      // Old backend variant fallback
      if (userId != null && userId.isNotEmpty) {
        try {
          final legacy = await AuthenticatedHttpClient.get('/users/$userId/profile-picture');
          return jsonDecode(legacy.body);
        } catch (_) {}
      }
      return {'success': false, 'message': 'Failed to fetch profile image: $e'};
    }
  }

  Future<Map<String, dynamic>> removeProfileImage() async {
    try {
      final res = await AuthenticatedHttpClient.delete('/users/profile-picture');
      Map<String, dynamic> body;
      try {
        body = jsonDecode(res.body) as Map<String, dynamic>;
      } catch (_) {
        body = {
          'success': res.statusCode >= 200 && res.statusCode < 300,
          'message': res.body,
        };
      }
      body['success'] = body['success'] == true;
      body['message'] = body['message']?.toString() ??
          body['error']?.toString() ??
          body['code']?.toString() ??
          'Request failed (${res.statusCode})';
      body['statusCode'] = res.statusCode;
      return body;
    } catch (e) {
      return {'success': false, 'message': 'Failed to remove profile image: $e'};
    }
  }

  // ===========================================================================
  // TASKS
  // ===========================================================================

  Future<List<TaskItem>> fetchTasks({
    required DateTime forDate,
    int page = 1,
    int limit = 50,
  }) async {
    try {
      final res = await AuthenticatedHttpClient.get('/tasks?page=$page&limit=$limit');

      final body = jsonDecode(res.body);

      if (res.statusCode == 200 && body['data'] is List) {
        return (body['data'] as List)
            .map((e) => TaskItem.fromApiJson(e, forDate))
            .toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  /// Fetch ALL tasks with automatic pagination
  Future<List<TaskItem>> fetchAllTasks({required DateTime forDate}) async {
    final List<TaskItem> allTasks = [];
    int page = 1;
    const int limit = 50;
    bool hasMore = true;

    try {
      while (hasMore) {
        final tasks = await fetchTasks(forDate: forDate, page: page, limit: limit);

        if (tasks.isEmpty) {
          hasMore = false;
        } else {
          allTasks.addAll(tasks);
          if (tasks.length < limit) {
            hasMore = false;
          } else {
            page++;
          }
        }
      }
      return allTasks;
    } catch (e) {
      debugPrint('Error fetching all tasks: $e');
      return allTasks;
    }
  }

  // ===========================================================================
  // HABITS (with pagination support)
  // ===========================================================================

  Future<List<TaskItem>> fetchHabits({
    required DateTime forDate,
    int page = 1,
    int limit = 50,
  }) async {
    try {
      final date = _formatDate(forDate);

      final res = await AuthenticatedHttpClient.get('/habits/date?date=$date&page=$page&limit=$limit');

      final body = jsonDecode(res.body);

      if (res.statusCode == 200 && body['data'] is List) {
        return (body['data'] as List)
            .map((e) => _mapHabitToTaskItem(e, forDate))
            .toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  /// Fetch ALL habits with automatic pagination
  Future<List<TaskItem>> fetchAllHabits({required DateTime forDate}) async {
    final List<TaskItem> allHabits = [];
    int page = 1;
    const int limit = 50;
    bool hasMore = true;

    try {
      while (hasMore) {
        final habits = await fetchHabits(forDate: forDate, page: page, limit: limit);

        if (habits.isEmpty) {
          hasMore = false;
        } else {
          allHabits.addAll(habits);
          if (habits.length < limit) {
            hasMore = false;
          } else {
            page++;
          }
        }
      }
      return allHabits;
    } catch (e) {
      debugPrint('Error fetching all habits: $e');
      return allHabits;
    }
  }

  Future<List<CategoryModel>> fetchCategories() async {
    try {
      final res = await AuthenticatedHttpClient.get('/categories');

      final data = jsonDecode(res.body);
      return (data['data'] as List)
          .map((e) => CategoryModel.fromJson(e))
          .toList();
    } catch (e) {
      return [];
    }
  }

  Future<bool> createHabit({
    required String title,
    required String description,
    required String frequency,
    required String categoryId,
  }) async {
    try {
      final res = await AuthenticatedHttpClient.post(
        '/habits',
        body: jsonEncode({
          "title": title,
          "description": description,
          "frequency": frequency.toLowerCase(),
          "categoryId": categoryId,
        }),
      );

      return res.statusCode == 200 || res.statusCode == 201;
    } catch (e) {
      return false;
    }
  }

  // ===========================================================================
  // TOGGLE TASK / HABIT
  // ===========================================================================

  Future<bool> setItemCompletion({
    required TaskItem item,
    required DateTime forDate,
  }) async {
    if (item.sourceType == 'habit') {
      return _setHabitCompletion(item: item, forDate: forDate);
    }

    try {
      final res = await AuthenticatedHttpClient.patch(
        '/tasks/${item.id}/status',
        body: jsonEncode({"done": item.done}),
      );

      if (res.statusCode == 200) {
        return _responseIndicatesSuccess(res.body, expectedDone: item.done);
      }
      return false;
    } catch (e) {
      debugPrint("Error toggling task: $e");
      return false;
    }
  }

  Future<bool> _setHabitCompletion({
    required TaskItem item,
    required DateTime forDate,
  }) async {
    final date = _formatDate(forDate);

    try {
      final List<Future<http.Response> Function()> requests = item.done
          ? [
              () => AuthenticatedHttpClient.post(
                    '/habits/${item.id}/complete',
                    body: jsonEncode({"date": date}),
                  ),
              () => AuthenticatedHttpClient.post(
                    '/habits/${item.id}/complete?date=$date',
                  ),
              () => AuthenticatedHttpClient.patch(
                    '/habits/${item.id}/status',
                    body: jsonEncode({"done": true, "date": date}),
                  ),
            ]
          : [
              () => AuthenticatedHttpClient.delete(
                    '/habits/${item.id}/complete',
                    body: jsonEncode({"date": date}),
                  ),
              () => AuthenticatedHttpClient.delete(
                    '/habits/${item.id}/complete?date=$date',
                  ),
              () => AuthenticatedHttpClient.post(
                    '/habits/${item.id}/uncomplete',
                    body: jsonEncode({"date": date}),
                  ),
              () => AuthenticatedHttpClient.patch(
                    '/habits/${item.id}/status',
                    body: jsonEncode({"done": false, "date": date}),
                  ),
            ];

      for (final send in requests) {
        final res = await send();
        if (res.statusCode == 200 || res.statusCode == 201 || res.statusCode == 204) {
          return _responseIndicatesSuccess(res.body, expectedDone: item.done);
        }
      }

      return false;
    } catch (e) {
      debugPrint("Error toggling habit: $e");
      return false;
    }
  }

  // ===========================================================================
  // HABIT → TASK MAPPER
  // ===========================================================================

  TaskItem _mapHabitToTaskItem(
      Map<String, dynamic> json, DateTime forDate) {
    final rawHabit = json['habit'];
    final Map<String, dynamic> habit =
        rawHabit is Map<String, dynamic> ? rawHabit : json;
    final category =
        habit['category'] ?? habit['categoryId'] ?? json['category'] ?? json['categoryId'] ?? {};
    final name = (category['name'] ?? 'other').toString();
    final id =
        json['habitId']?.toString() ??
        habit['_id']?.toString() ??
        json['_id']?.toString() ??
        '';

    return TaskItem(
      id: id,
      title: habit['title'] ?? json['title'] ?? '',
      description: habit['description'] ?? json['description'] ?? '',
      frequency: habit['frequency'] ?? json['frequency'] ?? 'daily',
      category: name,
      icon: TaskItem.resolveIcon(
        apiIconName: category['icon']?.toString(),
        categoryName: name,
      ),
      color: TaskItem.resolveColor(
        apiHexColor: category['backgroundColor']?.toString(),
        categoryName: name,
      ),
      sourceType: 'habit',
      createdAt:
      DateTime.tryParse(habit['createdAt'] ?? json['createdAt'] ?? '') ?? DateTime.now(),
      done: _isDoneForDate(json, forDate),
    );
  }

  bool _responseIndicatesSuccess(String bodyRaw, {required bool expectedDone}) {
    if (bodyRaw.trim().isEmpty) return true;
    try {
      final dynamic decoded = jsonDecode(bodyRaw);
      if (decoded is Map<String, dynamic>) {
        if (decoded['success'] != null) return decoded['success'] == true;
        final dynamic data = decoded['data'];
        if (data is Map<String, dynamic>) {
          if (data['done'] != null) return data['done'] == expectedDone;
          if (data['isCompleted'] != null) return data['isCompleted'] == expectedDone;
          if (data['completed'] != null) return data['completed'] == expectedDone;
        }
      }
    } catch (_) {
      // Treat non-JSON success responses as success when status code is successful.
    }
    return true;
  }

  String? _extractRefreshTokenFromSetCookie(String? setCookieHeader) {
    if (setCookieHeader == null || setCookieHeader.isEmpty) {
      return null;
    }

    final parts = setCookieHeader.split(';');
    for (final part in parts) {
      final trimmed = part.trim();
      if (trimmed.startsWith('refreshToken=')) {
        final value = trimmed.substring('refreshToken='.length);
        return value.isEmpty ? null : value;
      }
    }

    return null;
  }

  bool _isDoneForDate(Map<String, dynamic> json, DateTime date) {
    if (!json.containsKey('frequency')) {
      return json['status'] == 'done';
    }

    final target = DateTime(date.year, date.month, date.day);

    if (json['completed'] == true ||
        json['isCompleted'] == true ||
        json['done'] == true ||
        json['completedToday'] == true) {
      return true;
    }

    if (json['completedDates'] is List) {
      return (json['completedDates'] as List).any((d) {
        final parsed = DateTime.tryParse(d.toString());
        return parsed != null && DateUtils.isSameDay(parsed, target);
      });
    }

    if (json['completion'] is List) {
      return (json['completion'] as List).any((c) {
        final parsed = DateTime.tryParse(c['date'] ?? '');
        return parsed != null &&
            DateUtils.isSameDay(parsed, target) &&
            (c['done'] == true || c['completed'] == true);
      });
    }

    return json['status'] == 'done' || json['status'] == 'completed';
  }


  // ===========================================================================
// CONSISTENCY (FULL YEAR)
// ===========================================================================

  Future<List<HabitDay>> fetchConsistencyYear({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    try {
      final res = await http.get(
        Uri.parse(
          "$_api/habits/dashboard/chart-data"
              "?startDate=${startDate.toIso8601String()}"
              "&endDate=${endDate.toIso8601String()}",
        ),
        headers: await _headers(),
      );

      final body = jsonDecode(res.body);

      if (res.statusCode == 200 && body['success'] == true) {
        final daily = body['data']['daily'] as List<dynamic>;

        return daily.map((d) {
          return HabitDay(
            date: DateTime.parse(d['date']),
            completed: d['completed'] ?? 0,
          );
        }).toList();
      }

      return [];
    } catch (e) {
      debugPrint("Error fetching consistency: $e");
      return [];
    }
  }

}
