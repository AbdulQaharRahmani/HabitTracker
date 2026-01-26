import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;

import '../../utils/taskpage_components/tasks_model.dart';
import '../../utils/taskpage_components/token_storage.dart';

class TaskApiService {
  static const String baseUrl =
      'https://habit-tracker-17sr.onrender.com/api';

  /// ===============================
  /// Fetch all tasks
  /// ===============================
  Future<List<Task>> fetchTasks({
    required int page,
    int limit = 20,
    String? token,
  }) async {
    final authToken = token ?? await TokenStorage.getToken();
    if (authToken == null) throw Exception('Token not found');

    final response = await http.get(
      Uri.parse('$baseUrl/tasks?limit=$limit&page=$page'),
      headers: {
        'Authorization': 'Bearer $authToken',
      },
    );

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      final List list = body['data'] ?? [];
      return list.map((e) => Task.fromJson(e)).toList();
    } else {
      throw Exception('Failed to fetch tasks');
    }
  }


  /// ===============================
  /// Add new task
  /// ===============================
  Future<Map<String, dynamic>> addTask({
    required String title,
    required String description,
    required String status,
    required String priority,
    required String categoryId,
    String? token,
  }) async {
    final authToken = token ?? await TokenStorage.getToken();
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

    final response = await http.post(
      Uri.parse('$baseUrl/tasks'),
      headers: {
        'Authorization': 'Bearer $authToken',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(payload),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      final body = jsonDecode(response.body);
      return {
        'success': true,
        'data': body['data'],
      };
    } else {
      final body = jsonDecode(response.body);
      return {
        'success': false,
        'error': body['message'] ?? 'Failed to create task',
      };
    }
  }



  /// ===============================
  /// Update existing task
  /// ===============================
  Future<Task> updateTask(String taskId, Map<String, dynamic> updatedFields, String token) async {
    final response = await http.put(
      Uri.parse('$baseUrl/tasks/$taskId'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(updatedFields),
    );

    debugPrint('Raw server response: ${response.body}');

    // decode once
    final Map<String, dynamic> body = jsonDecode(response.body);

    if (response.statusCode == 200 && body['success'] == true) {
      // decode the data field if needed
      final data = body['data'];
      if (data is Map<String, dynamic>) {
        return Task.fromJson(data);
      } else if (data is String) {
              return Task.fromJson(jsonDecode(data));
      } else {
        throw Exception('Unexpected format for data: $data');
      }
    } else {
      throw Exception(body['message'] ?? 'Failed to update task');
    }
  }




  /// ===============================
  /// Toggle task status (todo <-> done)
  /// ===============================
  Future<void> toggleTaskStatus({
    required String taskId,
    required String currentStatus,
    String? token,
  }) async {
    final authToken = token ?? await TokenStorage.getToken();
    if (authToken == null) {
      throw Exception('Token not found');
    }

    final newStatus = currentStatus == 'done' ? 'todo' : 'done';

    final response = await http.patch(
      Uri.parse('$baseUrl/tasks/$taskId/status'),
      headers: {
        'Authorization': 'Bearer $authToken',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({'status': newStatus}),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to update task status');
    }
  }


  /// ===============================
  /// delete Tasks
  /// ===============================

  Future<void> deleteTask(String taskId, String token) async {
    final url = Uri.parse('$baseUrl/tasks/$taskId');

    final response = await http.delete(
      url,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode != 200 && response.statusCode != 204) {
      throw Exception('Failed to delete task');
    }
  }


}
