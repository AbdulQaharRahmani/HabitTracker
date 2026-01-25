import 'dart:convert';
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
  Future<Task> updateTask(
      String taskId, Map<String, dynamic> updatedFields, String token) async {
    final response = await http.patch(
      Uri.parse('$baseUrl/tasks/$taskId'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(updatedFields),
    );

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      return Task.fromJson(body['data']);
    } else {
      final body = jsonDecode(response.body);
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
}
