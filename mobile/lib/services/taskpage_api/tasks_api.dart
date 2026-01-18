import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../utils/taskpage_components/tasks_model.dart';
import '../../utils/taskpage_components/token_storage.dart';

class TaskApiService {
  static const String baseUrl = 'https://habit-tracker-17sr.onrender.com/api';

  Future<List<Task>> fetchTasks({String? token}) async {
    final authToken = token ?? await TokenStorage.getToken();
    if (authToken == null) throw Exception('Token not found');

    final response = await http.get(
      Uri.parse('$baseUrl/tasks'),
      headers: {'Authorization': 'Bearer $authToken'},
    );

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      final List tasks = body['data'] ?? [];
      return tasks.map((e) => Task.fromJson(e)).toList();
    } else {
      throw Exception('Failed to fetch tasks');
    }
  }

  Future<Map<String, dynamic>> addTask({
    required String title,
    required String description,
    required String status,
    required String priority,
    required String categoryId,
    String? token,
  }) async {
    final authToken = token ?? await TokenStorage.getToken();
    if (authToken == null) throw Exception('Token not found');

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

    if (response.statusCode == 201) {
      return {'success': true, 'data': jsonDecode(response.body)};
    } else {
      return {
        'success': false,
        'error': jsonDecode(response.body)['message'] ?? 'Server error',
      };
    }
  }
}