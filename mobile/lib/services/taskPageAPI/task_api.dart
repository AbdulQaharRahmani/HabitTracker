import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../utils/tasks_page_component/habit.dart';

class TaskApiService {
  static const String baseUrl = 'https://habit-tracker-17sr.onrender.com/api';

  Future<List<Habit>> fetchTasks() async {
    final response = await http.get(Uri.parse('$baseUrl/tasks'));

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((e) => Habit.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load tasks: ${response.statusCode}');
    }
  }

  Future<void> addTask({
    required String title,
    required String description,
    required String status,
    required String priority,
    String? userId,
    DateTime? dueDate,
  }) async {
    final body = {
      'title': title,
      'description': description,
      'status': status,
      'priority': priority,
      if (userId != null) 'userId': userId,
      if (dueDate != null) 'dueDate': dueDate.toIso8601String(),
    };

    final response = await http.post(
      Uri.parse('$baseUrl/tasks'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );

    if (response.statusCode != 201) {
      throw Exception('Failed to add task: ${response.statusCode}');
    }
  }
}
