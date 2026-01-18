import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../utils/category/model.dart';
import '../../utils/tasks_page_component/token_storage.dart';

class CategoryApiService {
  static const String baseUrl = 'https://habit-tracker-17sr.onrender.com/api';

  Future<List<CategoryModel>> fetchCategories() async {
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

      // ===== Map JSON to CategoryModel =====
      return categoriesJson.map((c) => CategoryModel.fromJson({
        'id': c['_id'],
        'name': c['name'],
        'icon': c['icon'] ?? 'widgets',
        'backgroundColor': c['backgroundColor'] ?? 'grey',
      })).toList();
    } else {
      throw Exception('Failed to fetch categories. Status: ${response.statusCode}');
    }
  }
}
