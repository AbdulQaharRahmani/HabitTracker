import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../utils/tasks_page_component/task.dart';
import '../../utils/tasks_page_component/token_storage.dart';

class TaskApiService {
  static const String baseUrl = 'https://habit-tracker-17sr.onrender.com/api';

  /// ================= Fetch all tasks =================
  Future<List<Task>> fetchTasks() async {
    final token = await TokenStorage.getToken();
    if (token == null) {
      throw Exception('Authentication token not found. Please login again.');
    }

    final response = await http.get(
      Uri.parse('$baseUrl/tasks'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> body = jsonDecode(response.body);
      final List tasks = body['data'] ?? [];
      return tasks.map((e) => Task.fromJson(e)).toList();
    } else if (response.statusCode == 401) {
      throw Exception('Unauthorized request. Token may be expired.');
    } else {
      throw Exception(
        'Failed to fetch tasks. StatusCode: ${response.statusCode}, Response: ${response.body}',
      );
    }
  }

  /// ================= Create new task =================
  Future<Map<String, dynamic>> addTask({
    required String title,
    required String description,
    required String status,
    required String priority,
    required String categoryId,
    DateTime? dueDate,
  }) async {
    final token = await TokenStorage.getToken();
    if (token == null) {
      throw Exception('Authentication token not found. Please login again.');
    }

    final payload = {
      'title': title,
      'description': description,
      'status': status,
      'priority': priority,
      'categoryId': categoryId,
      if (dueDate != null) 'dueDate': dueDate.toIso8601String(),
    };

    final response = await http.post(
      Uri.parse('$baseUrl/tasks'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(payload),
    );

    final Map<String, dynamic> body =
    response.body.isNotEmpty ? jsonDecode(response.body) : {};

    if (response.statusCode == 201) {
      return {'success': true, 'data': body};
    } else {
      return {
        'success': false,
        'error': body['message'] ?? 'Unknown server error',
        'statusCode': response.statusCode,
      };
    }
  }
}
