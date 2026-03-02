import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:habit_tracker/services/token_storage.dart';
import 'package:http/http.dart' as http;

import 'http_client.dart';
import '../utils/category/category_model.dart';

import '../screens/habitScreen/add_habit.dart';
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

      final request =
      http.MultipartRequest("POST", Uri.parse("$_api/users/profile-picture"));
      request.headers["Authorization"] = "Bearer $token";
      request.files.add(await http.MultipartFile.fromPath("image", image.path));

      final response = await http.Response.fromStream(await request.send());
      return jsonDecode(response.body);
    } catch (e) {
      return {'success': false, 'message': 'Failed to upload profile image: $e'};
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
    final headers = await _headers();

    if (item.sourceType == 'habit') {
      final date = _formatDate(forDate);
      final url = Uri.parse("$_api/habits/${item.id}/complete");

      try {
        final res = item.done
            ? await AuthenticatedHttpClient.post(
                '/habits/${item.id}/complete',
                body: jsonEncode({"date": date}),
              )
            : await AuthenticatedHttpClient.delete(
                '/habits/${item.id}/complete',
                body: jsonEncode({"date": date}),
              );

        if (res.statusCode == 200 || res.statusCode == 201) {
          final body = jsonDecode(res.body);
          return body['success'] == true;
        }
        return false;
      } catch (e) {
        debugPrint("Error toggling habit: $e");
        return false;
      }
    }

    try {
      final res = await AuthenticatedHttpClient.patch(
        '/tasks/${item.id}/status',
        body: jsonEncode({"done": item.done}),
      );

      if (res.statusCode == 200) {
        final body = jsonDecode(res.body);
        if (body.containsKey('success')) {
          return body['success'] == true;
        } else if (body.containsKey('data')) {
          return body['data']?['done'] == item.done;
        }
        return true;
      }
      return false;
    } catch (e) {
      debugPrint("Error toggling task: $e");
      return false;
    }
  }

  // ===========================================================================
  // HABIT → TASK MAPPER
  // ===========================================================================

  TaskItem _mapHabitToTaskItem(
      Map<String, dynamic> json, DateTime forDate) {
    final category = json['category'] ?? json['categoryId'] ?? {};
    final name = (category['name'] ?? 'other').toString();

    return TaskItem(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: name,
      icon: TaskItem.resolveIcon(
        apiIconName: category['icon']?.toString(),
        categoryName: name,
      ),
      color: TaskItem.resolveColor(
        apiHexColor: category['backgroundColor']?.toString(),
        categoryName: name,
      ),
      sourceType: json.containsKey('frequency') ? 'habit' : 'task',
      createdAt:
      DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      done: _isDoneForDate(json, forDate),
    );
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
        json['completedToday'] == true) return true;

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
