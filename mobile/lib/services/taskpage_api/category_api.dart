import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../utils/category/category_model.dart';
import '../../utils/taskpage_components/token_storage.dart';

class CategoryApiService {
  static const String baseUrl = 'https://habit-tracker-17sr.onrender.com/api';

  Future<List<CategoryModel>> fetchCategories({String? token}) async {
    final authToken = token ?? await TokenStorage.getToken();
    if (authToken == null) throw Exception('Token not found');

    final response = await http.get(
      Uri.parse('$baseUrl/categories'),
      headers: {'Authorization': 'Bearer $authToken'},
    );

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      final List categories = body['data'] ?? [];
      return categories.map((e) => CategoryModel.fromJson(e)).toList();
    } else {
      throw Exception('Failed to fetch categories');
    }
  }
}