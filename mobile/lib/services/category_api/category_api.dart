import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../utils/tasks_page_component/token_storage.dart';
import '../../utils/tasks_page_component/category.dart';

class CategoryApiService {
  static const String baseUrl = 'https://habit-tracker-17sr.onrender.com/api';

  Future<List<Category>> fetchCategories() async {
    final token = await TokenStorage.getToken();
    if (token == null) throw Exception('No token found');

    final response = await http.get(
      Uri.parse('$baseUrl/categories'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final List categoriesJson = data['data'];
      return categoriesJson.map((c) => Category.fromJson(c)).toList();
    } else {
      throw Exception('Failed to fetch categories. Status: ${response.statusCode}');
    }
  }
}