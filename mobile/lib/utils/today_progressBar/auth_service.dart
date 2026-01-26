import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart'; // For DateUtils if not already imported elsewhere

import 'task_item.dart';

class ApiService {
  final String baseUrl = "https://habit-tracker-17sr.onrender.com";

  // ---------------------------------------------------------------------------
  // AUTH & HEADERS
  // ---------------------------------------------------------------------------

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<Map<String, String>> _defaultHeaders() async {
    final token = await _getToken();
    final headers = {"Content-Type": "application/json"};
    if (token != null && token.isNotEmpty) {
      headers["Authorization"] = "Bearer $token";
    }
    return headers;
  }

  String _formatDate(DateTime date) {
    final y = date.year.toString().padLeft(4, '0');
    final m = date.month.toString().padLeft(2, '0');
    final d = date.day.toString().padLeft(2, '0');
    return '$y-$m-$d';
  }

  // ---------------------------------------------------------------------------
  // TASKS
  // ---------------------------------------------------------------------------

  Future<List<TaskItem>> fetchTasks({required DateTime forDate}) async {
    final url = Uri.parse("$baseUrl/api/tasks");

    try {
      final res = await http.get(url, headers: await _defaultHeaders());
      final body = jsonDecode(res.body);

      if (res.statusCode == 200 && body['data'] is List) {
        return (body['data'] as List)
            .map((e) => TaskItem.fromApiJson(e, forDate))
            .toList();
      }

      return [];
    } catch (_) {
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // HABITS
  // ---------------------------------------------------------------------------

  Future<List<TaskItem>> fetchHabits({
    required DateTime forDate,
  }) async {
    final date = _formatDate(forDate);
    final url =
    Uri.parse("$baseUrl/api/habits/date?date=$date");

    try {
      final res = await http.get(url, headers: await _defaultHeaders());
      final body = jsonDecode(res.body);

      if (res.statusCode == 200 && body['data'] is List) {
        return (body['data'] as List)
            .map((e) => _mapHabitToTaskItem(e, forDate))
            .toList();
      }

      return [];
    } catch (_) {
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // TOGGLE (SINGLE SOURCE OF TRUTH)
  // ---------------------------------------------------------------------------

  Future<bool> setItemCompletion({
    required TaskItem item,
    required DateTime forDate,
  }) async {
    final headers = await _defaultHeaders();
    final date = _formatDate(forDate);

    try {
      if (item.sourceType == 'habit') {
        final url = Uri.parse("$baseUrl/api/habits/${item.id}/complete");

        print("📤 Habit toggle request: id=${item.id}, done=${item.done}, date=$date, url=$url");

        late http.Response res;

        // ارسال بر اساس مقدار واقعی toggle
        if (!item.done) {
          // COMPLETE → POST
          res = await http.post(url, headers: headers, body: jsonEncode({"date": date}));
        } else {
          // UNDO → DELETE
          res = await http.delete(url, headers: headers, body: jsonEncode({"date": date}));
        }

        print("📥 Response: ${res.statusCode} ${res.body}");

        if (res.statusCode == 200 || res.statusCode == 201) {
          item.done = !item.done; // فقط بعد از موفقیت
          return true;
        } else if (!item.done && res.statusCode == 400 && (jsonDecode(res.body)['code'] ?? '') == 'ALREADY_COMPLETED') {
          item.done = true; // Sync state if already completed
          return true;
        }

        return false;
      }

      // TASK
      final url = Uri.parse("$baseUrl/api/tasks/${item.id}/status");
      final newDone = !item.done;
      final res = await http.patch(url, headers: headers, body: jsonEncode({"done": newDone, "date": date}));

      if (res.statusCode == 200) {
        item.done = newDone;
        return true;
      }

      return false;

    } catch (e) {
      print("setItemCompletion exception: $e");
      return false;
    }
  }
  // ---------------------------------------------------------------------------
  // HABIT → TaskItem MAPPER
  // ---------------------------------------------------------------------------

  TaskItem _mapHabitToTaskItem(
      Map<String, dynamic> json,
      DateTime forDate,
      ) {
    final category = json['category'] ?? {};
    final categoryName =
    (category['name'] ?? 'other').toString();

    return TaskItem(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      frequency: json['frequency'] ?? 'daily',
      category: categoryName,
      icon: TaskItem.resolveIcon(
        apiIconName: category['icon']?.toString(),
        categoryName: categoryName,
      ),
      color: TaskItem.resolveColor(
        apiHexColor: category['backgroundColor']?.toString(),
        categoryName: categoryName,
      ),
      sourceType: 'habit',
      createdAt:
      DateTime.tryParse(json['createdAt'] ?? '') ??
          DateTime.now(),
      done: _isDoneForDate(json, forDate),
    );
  }

  // ---------------------------------------------------------------------------
  // SHARED DONE CHECKER (FOR BOTH TASKS AND HABITS)
  // ---------------------------------------------------------------------------

  bool _isDoneForDate(
      Map<String, dynamic> json,
      DateTime date,
      ) {
    final target = DateTime(date.year, date.month, date.day);

    // Common boolean fields for date-specific completion
    if (json['completed'] == true) return true;
    if (json['isCompleted'] == true) return true;
    if (json['done'] == true) return true;
    if (json['completedToday'] == true) return true; // Kept for backward compatibility

    // Status strings
    if (json['status'] == 'completed' || json['status'] == 'done') return true;

    // Array of completed dates
    if (json['completedDates'] is List) {
      return (json['completedDates'] as List).any((d) {
        final parsed = DateTime.tryParse(d.toString());
        return parsed != null && DateUtils.isSameDay(parsed, target);
      });
    }

    // Array of completion objects
    if (json['completion'] is List) {
      return (json['completion'] as List).any((c) {
        final parsed = DateTime.tryParse(c['date']?.toString() ?? '');
        if (parsed == null) return false;
        if (!DateUtils.isSameDay(parsed, target)) return false;
        return c['done'] == true ||
            c['completed'] == true ||
            c['isCompleted'] == true ||
            c['status'] == 'completed' ||
            c['status'] == 'done';
      });
    }

    // If no specific per-date info, fallback to general status (for non-recurring items)
    if (json['status'] == 'done') return true;

    return false;
  }
}