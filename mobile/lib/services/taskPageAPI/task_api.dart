import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../utils/tasks_page_component/token_storage.dart';
import '../../utils/tasks_page_component/habit.dart';

class TaskApiService {
  static const String baseUrl = 'https://habit-tracker-17sr.onrender.com/api';

  /// ===== Fetch list of habits =====
  Future<List<Habit>> fetchTasks() async {
    // Get token from local storage
    final token = await TokenStorage.getToken();

    if (token == null) {
      throw Exception('No token found. Please login.');
    }

    final response = await http.get(
      Uri.parse('$baseUrl/habits'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> json = jsonDecode(response.body);
      final List habits = json['habits'] ?? [];
      return habits.map((e) => Habit.fromJson(e)).toList();
    } else if (response.statusCode == 401) {
      // Token expired or invalid
      throw Exception('Unauthorized. Token may be expired.');
    } else {
      throw Exception('Status: ${response.statusCode}\nBody: ${response.body}');
    }
  }

  /// ===== Create new task =====
  Future<void> addTask({
    required String title,
    required String description,
    required String status,
    required String priority,
    DateTime? dueDate,
    required String frequency,
    required String category,
  }) async {
    // Get token from local storage
    final token = await TokenStorage.getToken();

    if (token == null) {
      throw Exception('No token found. Please login.');
    }

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
        'frequency': frequency,
        'category': category,
        if (dueDate != null) 'dueDate': dueDate.toIso8601String(),
      }),
    );

    if (response.statusCode != 201) {
      if (response.statusCode == 401) {
        throw Exception('Unauthorized. Token may be expired.');
      }
      throw Exception('Status: ${response.statusCode}\nBody: ${response.body}');
    }
  }
}
