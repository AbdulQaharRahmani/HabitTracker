import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../utils/category/category_model.dart';
import '../../utils/taskpage_components/token_storage.dart';

class CategoryApiService {
  static const String baseUrl =
      'https://habit-tracker-17sr.onrender.com/api';

  /// Fetch all categories for the logged-in user
  Future<List<CategoryModel>> fetchCategories({String? token}) async {
    final authToken = token ?? await TokenStorage.getToken();
    if (authToken == null) {
      throw Exception('Auth token not found');
    }

    final response = await http.get(
      Uri.parse('$baseUrl/categories'),
      headers: {
        'Authorization': 'Bearer $authToken',
      },
    );

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      final List list = body['data'] ?? [];

      return list.map((e) => CategoryModel.fromJson(e)).toList();
    } else {
      throw Exception('Failed to fetch categories');
    }
  }

  /// Create a new category
  Future<CategoryModel> createCategory(
      CreateCategoryModel category) async {
    final token = await TokenStorage.getToken();
    if (token == null) {
      throw Exception('Auth token not found');
    }

    final response = await http.post(
      Uri.parse('$baseUrl/categories'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: jsonEncode(category.toJson()),
    );

    if (response.statusCode == 200 ||
        response.statusCode == 201) {
      final body = jsonDecode(response.body);
      return CategoryModel.fromJson(body['data']);
    } else {
      throw Exception('Failed to create category');
    }
  }
}
