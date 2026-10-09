import 'dart:convert';
import 'package:http/http.dart' as http;

import '../../utils/category/category_model.dart';
import '../token_storage.dart';
import '../http_client.dart';

class CategoryApiService {
  static const String baseUrl =
      'https://habit-tracker-17sr.onrender.com/api';

  /// Fetch all categories for the logged-in user - with auto-refresh
  Future<List<CategoryModel>> fetchCategories({String? token}) async {
    final response = await AuthenticatedHttpClient.get('/categories');

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      final List list = body['data'] ?? [];

      return list.map((e) => CategoryModel.fromJson(e)).toList();
    } else {
      throw Exception('Failed to fetch categories');
    }
  }

  /// Create a new category - with auto-refresh
  Future<CategoryModel> createCategory(
      CreateCategoryModel category) async {
    final response = await AuthenticatedHttpClient.post(
      '/categories',
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
