import 'dart:convert';
import 'dart:async';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;

import '../../utils/taskpage_components/tasks_model.dart';
import '../token_storage.dart';
import '../http_client.dart';

class TaskApiService {
  static const String baseUrl =
      'https://habit-tracker-17sr.onrender.com/api';

  static const Duration _timeoutDuration = Duration(seconds: 10);

  /// ===============================
  /// Fetch tasks with pagination (UX optimized) - with auto-refresh
  /// ===============================
  Future<List<Task>> fetchTasks({
    required String token,
    int page = 1,
    int limit = 20,
    String? searchTerm,
     String? status,
    String? categoryId,
  }) async {
    try {
      final queryParams = <String, String>{
        'limit': limit.toString(),
        'page': page.toString(),
        if (searchTerm != null && searchTerm.isNotEmpty) 'search': searchTerm,
        if (categoryId != null) 'categoryId': categoryId,
      };

      final queryString = queryParams.entries
          .map((e) => '${e.key}=${Uri.encodeComponent(e.value)}')
          .join('&');

      final response = await AuthenticatedHttpClient.get('/tasks?$queryString')
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
  /// Add new task - with auto-refresh
  /// ===============================
  Future<Map<String, dynamic>> addTask({
    required String title,
    required String description,
    required String status,
    required String priority,
    required String categoryId,
    String? token,
    DateTime? dueDate,
  }) async {
    final payload = {
      'title': title,
      'description': description,
      'status': status,
      'priority': priority,
      'categoryId': categoryId,
      if (dueDate != null) 'dueDate': formatDueDate(dueDate),

    };

    debugPrint('📤 Create Task Payload: ${jsonEncode(payload)}');

    final response = await AuthenticatedHttpClient.post(
      '/tasks',
      body: jsonEncode(payload),
    ).timeout(_timeoutDuration);

    final body = jsonDecode(response.body);
    debugPrint('📤 body of response from backend : ${body}');
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
  /// Update task (robust parsing) - with auto-refresh
  /// ===============================
  Future<Task> updateTask(
      String taskId,
      Map<String, dynamic> updatedFields,
      String token,
      ) async {
    final response = await AuthenticatedHttpClient.put(
      '/tasks/$taskId',
      body: jsonEncode(updatedFields),
    ).timeout(_timeoutDuration);

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
  /// Toggle task status (optimistic friendly) - with auto-refresh
  /// ===============================
  Future<void> toggleTaskStatus({
    required String taskId,
    required String currentStatus,
    required String token,
  }) async {
    final newStatus = currentStatus == 'done' ? 'todo' : 'done';
    final body = jsonEncode({'status': newStatus});

    debugPrint('🔹 Toggle Task Status Request');
    debugPrint('Body: $body');

    final response = await AuthenticatedHttpClient.patch(
      '/tasks/$taskId/status',
      body: body,
    );

    debugPrint('🔹 Response Status: ${response.statusCode}');
    debugPrint('🔹 Response Body: ${response.body}');

    if (response.statusCode != 200) {
      throw Exception('Failed to update task status');
    }
  }


  /// ===============================
  /// Delete task - with auto-refresh
  /// ===============================
  Future<void> deleteTask(String taskId, String token) async {
    final response = await AuthenticatedHttpClient.delete('/tasks/$taskId')
        .timeout(_timeoutDuration);

    if (response.statusCode != 200 &&
        response.statusCode != 204) {
      throw Exception('Failed to delete task');
    }
  }
  // filter tasks and fetch filter tasks - with auto-refresh
  Future<List<Task>> fetchFilteredTasks({
    required String token,
    String? searchTerm,
    String? status,
    String? categoryId,
    String? dueDate,
  }) async {
    final query = <String, String>{};

    if (searchTerm != null && searchTerm.isNotEmpty) {
      query['searchTerm'] = searchTerm;
    }
    if (status != null) query['status'] = status;
    if (categoryId != null) query['categoryId'] = categoryId;
    if (dueDate != null) query['dueDate'] = dueDate;

    final queryString = query.entries
        .map((e) => '${e.key}=${Uri.encodeComponent(e.value)}')
        .join('&');

    final response = await AuthenticatedHttpClient.get(
      '/tasks/filter${queryString.isNotEmpty ? '?$queryString' : ''}',
    );

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      final List list = body['data'] ?? [];
      return list.map((e) => Task.fromJson(e)).toList();
    }

    throw Exception('Failed to filter tasks');
  }
  String formatDueDate(DateTime date) {
    final utc = date.toUtc();

    return
      '${utc.year.toString().padLeft(4, '0')}-'
          '${utc.month.toString().padLeft(2, '0')}-'
          '${utc.day.toString().padLeft(2, '0')}T'
          '${utc.hour.toString().padLeft(2, '0')}:'
          '${utc.minute.toString().padLeft(2, '0')}:'
          '${utc.second.toString().padLeft(2, '0')}.'
          '${utc.millisecond.toString().padLeft(3, '0')}Z';
  }

}
