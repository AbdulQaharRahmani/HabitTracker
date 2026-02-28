import '../utils/category/category_model.dart';
import 'package:http/http.dart' as http;
import 'token_storage.dart';
import 'dart:convert';

class CategoryCache {
  static final CategoryCache _instance = CategoryCache._internal();
  factory CategoryCache() => _instance;
  CategoryCache._internal();

  List<CategoryModel>? _cachedCategories;

  /// Returns cached categories synchronously if available.
  List<CategoryModel>? getCachedCategoriesSync() => _cachedCategories;

  /// Returns cached categories if available, otherwise fetches from network.
  Future<List<CategoryModel>> getCategories({bool forceRefresh = false}) async {
    if (!forceRefresh && _cachedCategories != null) {
      return _cachedCategories!;
    }

    final token = await AuthManager.getToken();
    if (token == null) return [];

    final url = Uri.parse('https://habit-tracker-17sr.onrender.com/api/categories');
    final response = await http.get(
      url,
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> decoded = jsonDecode(response.body);
      final List<dynamic> jsonList = decoded['data'];
      _cachedCategories = jsonList.map((item) => CategoryModel.fromJson(item)).toList();
      return _cachedCategories!;
    } else {
      throw Exception('Failed to load categories');
    }
  }

  void setCategories(List<CategoryModel> categories) {
    _cachedCategories = categories;
  }

  void clear() {
    _cachedCategories = null;
  }
}