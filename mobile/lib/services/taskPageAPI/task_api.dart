import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:icons_plus/icons_plus.dart';
import '../../utils/tasks_page_component/habit.dart';

class TaskApiService {
  // Base URL of the online backend (Render)
  static const String baseUrl =
      'https://habit-tracker-17sr.onrender.com/api';

  // ====================================
  // Fetch habits (tasks) from backend
  // ====================================
  Future<List<Habit>> fetchTasks(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/habits'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> json = jsonDecode(response.body);

      // ✅ SAFE: if habits is null → return empty list
      final List habits = json['habits'] ?? [];

      return habits.map((e) => Habit.fromJson(e)).toList();
    } else {
      throw Exception(
        'Status: ${response.statusCode}\nBody: ${response.body}',
      );
    }
  }


  // ====================================
  // Create a new habit (task)
  // ====================================
  Future<void> addTask({
    required String token,
    required String title,
    required String description,
    required String status,
    required String priority,
    DateTime? dueDate,
    required String frequency,
    required String category,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/habits'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'title': title,
        'description': description,
        'status': status,
        'priority': priority,
        'frequency':frequency,
        'category':category,
        if (dueDate != null) 'dueDate': dueDate.toIso8601String(),
      }),
    );

    if (response.statusCode != 201) {
      throw Exception(
        'Status: ${response.statusCode}\nBody: ${response.body}',
      );
    }
  }
}
