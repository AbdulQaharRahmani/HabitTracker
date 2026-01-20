import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import 'task_item.dart';

class ApiService {
  final String baseUrl = "https://habit-tracker-17sr.onrender.com";

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }
  Future<bool> toggleHabit(TaskItem habit) async {
    if (habit.sourceType != 'habit') return false;

    final url = Uri.parse('$baseUrl/api/habits/${habit.id}/complete');
    try {
      final headers = await _defaultHeaders();

      http.Response res;
      if (!habit.done) {
        res = await http.post(url, headers: headers);
      } else {
        res = await http.delete(url, headers: headers);
      }

      if (res.statusCode == 200) {
        habit.done = !habit.done;
        return true;
      } else {
        print(
            'toggleHabit: unexpected status ${res.statusCode} ${res.body}');
        return false;
      }
    } catch (e) {
      print('toggleHabit error: $e');
      return false;
    }
  }
  Future<Map<String, String>> _defaultHeaders() async {
    final token = await _getToken();
    final headers = {"Content-Type": "application/json"};
    if (token != null && token.isNotEmpty) {
      headers["Authorization"] = "Bearer $token";
    }
    return headers;
  }

  /// GET /api/tasks
  Future<List<TaskItem>> fetchTasks() async {
    final url = Uri.parse("$baseUrl/api/tasks");
    try {
      final headers = await _defaultHeaders();
      final res = await http.get(url, headers: headers);
      final body = jsonDecode(res.body);
      if (res.statusCode == 200 && body != null && body['data'] != null) {
        final List data = body['data'] as List;
        return data
            .map((e) => TaskItem.fromApiJson(e as Map<String, dynamic>))
            .toList();
      } else {
        print("fetchTasks: unexpected response ${res.statusCode} ${res.body}");
        return [];
      }
    } catch (e) {
      print("ApiService.fetchTasks error: $e");
      return [];
    }
  }

  /// GET /api/habits
  Future<List<TaskItem>> fetchHabits() async {
    final url = Uri.parse("$baseUrl/api/habits");
    try {
      final headers = await _defaultHeaders();
      final res = await http.get(url, headers: headers);
      final body = jsonDecode(res.body);
      if (res.statusCode == 200 && body != null && body['data'] != null) {
        final List data = body['data'] as List;
        return data
            .map((e) => TaskItem.fromHabitApiJson(e as Map<String, dynamic>))
            .toList();
      } else {
        print("fetchHabits: unexpected response ${res.statusCode} ${res.body}");
        return [];
      }
    } catch (e) {
      print("ApiService.fetchHabits error: $e");
      return [];
    }
  }

  Future<bool> setItemCompletion({
    required String id,
    required bool done,
    required DateTime forDate,
    required String type,
  }) async {
    try {
      final headers = await _defaultHeaders();

      if (type == 'habit') {
        final url = Uri.parse("$baseUrl/api/habits/$id/complete");
        final body = jsonEncode({
          "date": forDate.toIso8601String(),
          "done": done,
        });
        final res = await http.post(url, headers: headers, body: body);
        if (res.statusCode == 200 || res.statusCode == 201) {
          return true;
        } else {
          print("habit complete failed: ${res.statusCode} ${res.body}");
          return false;
        }
      } else {
        final url = Uri.parse("$baseUrl/api/tasks/$id/status");
        final body = jsonEncode({
          "done": done,
          "date": forDate.toIso8601String(),
        });
        final res = await http.patch(url, headers: headers, body: body);
        if (res.statusCode == 200) {
          return true;
        } else {
          print("task status failed: ${res.statusCode} ${res.body}");
          return false;
        }
      }
    } catch (e) {
      print("setItemCompletion exception: $e");
      return false;
    }
  }
}