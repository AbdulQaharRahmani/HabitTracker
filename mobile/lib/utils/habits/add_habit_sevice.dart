// features/habits/services/habit_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../category/category_model.dart';



class HabitService {
  final String baseUrl = 'https://habit-tracker-17sr.onrender.com/api';


  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<List<CategoryModel>> fetchCategories() async {
    final token = await _getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/categories'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    ).timeout(const Duration(seconds: 30));

    if (response.statusCode == 200) {
      final Map<String, dynamic> decodedData = jsonDecode(response.body);
      final List<dynamic> categoriesJson = decodedData['data'];
      return categoriesJson.map((item) => CategoryModel.fromJson(item)).toList();
    } else {
      throw Exception("خطای سرور: ${response.statusCode}");
    }
  }

  Future<bool> createHabit({
    required String title,
    required String description,
    required String frequency,
    required String categoryId,
  }) async {
    final token = await _getToken();
    final response = await http.post(
      Uri.parse('$baseUrl/habits'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        "title": title,
        "description": description,
        "frequency": frequency.toLowerCase(),
        "categoryId": categoryId,
      }),
    ).timeout(const Duration(seconds: 20));

    return response.statusCode == 200 || response.statusCode == 201;
  }
}