import 'dart:convert';
import 'dart:async';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;

import '../../utils/taskpage_components/tasks_model.dart';
import '../token_storage.dart';

class TaskApiService {
  static const String baseUrl =
      'https://habit-tracker-17sr.onrender.com/api';

  static const Duration _timeoutDuration = Duration(seconds: 10);

  /// ===============================
  /// Fetch tasks with pagination (UX optimized)
  /// ===============================
  Future<List<Task>> fetchTasks({
    required String token,
    int page = 1,
    int limit = 8,
    String? search,
  }) async {
    try {
      final uri = Uri.parse(
        '$baseUrl/tasks?limit=$limit&page=$page${search != null ? '&search=$search' : ''}',
      );

      final response = await http
          .get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      )
          .timeout(_timeoutDuration);

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);

        final List<dynamic> tasksJson =
        (decoded is Map && decoded['data'] is List)
            ? decoded['data']
            : [];

        return tasksJson
            .map((json) => Task.fromJson(json))
            .toList();
      }

      throw Exception('Failed to load tasks');
    } on TimeoutException {
      debugPrint('⏳ Fetch tasks timeout');
      rethrow;
    } catch (e) {
      debugPrint('❌ Fetch tasks error: $e');
      rethrow;
    }
  }

  /// ===============================
  /// Add new task (safe & fast)
  /// ===============================
  Future<Map<String, dynamic>> addTask({
    required String title,
    required String description,
    required String status,
    required String priority,
    required String categoryId,
    String? token,
    String? dueDate,
  }) async {
    final authToken = token ?? await AuthManager.getToken();
    if (authToken == null) {
      throw Exception('Token not found');
    }

    final payload = {
      'title': title,
      'description': description,
      'status': status,
      'priority': priority,
      'categoryId': categoryId,
    };

    final response = await http
        .post(
      Uri.parse('$baseUrl/tasks'),
      headers: {
        'Authorization': 'Bearer $authToken',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(payload),
    )
        .timeout(_timeoutDuration);

    final body = jsonDecode(response.body);

    if (response.statusCode == 200 || response.statusCode == 201) {
      return {
        'success': true,
        'data': body['data'],
      };
    }

    return {
      'success': false,
      'error': body['message'] ?? 'Failed to create task',
    };
  }

  /// ===============================
  /// Update task (robust parsing)
  /// ===============================
  Future<Task> updateTask(
      String taskId,
      Map<String, dynamic> updatedFields,
      String token,
      ) async {
    final response = await http
        .put(
      Uri.parse('$baseUrl/tasks/$taskId'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(updatedFields),
    )
        .timeout(_timeoutDuration);

    final Map<String, dynamic> body = jsonDecode(response.body);

    if (response.statusCode == 200 && body['success'] == true) {
      final data = body['data'];

      if (data is Map<String, dynamic>) {
        return Task.fromJson(data);
      }

      if (data is String) {
        return Task.fromJson(jsonDecode(data));
      }
    }

    throw Exception(body['message'] ?? 'Failed to update task');
  }

  /// ===============================
  /// Toggle task status (optimistic friendly)

  Future<void> toggleTaskStatus({
    required String taskId,
    required String currentStatus,
    required String token,
  }) async {
    final newStatus = currentStatus == 'done' ? 'todo' : 'done';

    final url = Uri.parse('$baseUrl/tasks/$taskId/status');
    final body = jsonEncode({'status': newStatus});

    // ===== DEBUG: Show exactly what we are sending to backend =====
    debugPrint('🔹 Toggle Task Status Request');
    debugPrint('URL: $url');
    debugPrint('Headers: {Authorization: Bearer $token, Content-Type: application/json}');
    debugPrint('Body: $body');

    final response = await http.patch(
      url,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: body,
    );

    // ===== DEBUG: Show response from backend =====
    debugPrint('🔹 Response Status: ${response.statusCode}');
    debugPrint('🔹 Response Body: ${response.body}');

    if (response.statusCode != 200) {
      throw Exception('Failed to update task status');
    }
  }


  /// ===============================
  /// Delete task (safe)
  /// ===============================
  Future<void> deleteTask(String taskId, String token) async {
    final response = await http
        .delete(
      Uri.parse('$baseUrl/tasks/$taskId'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    )
        .timeout(_timeoutDuration);

    if (response.statusCode != 200 &&
        response.statusCode != 204) {
      throw Exception('Failed to delete task');
    }
  }
}
