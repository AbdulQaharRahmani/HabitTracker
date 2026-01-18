import 'dart:convert';
import 'package:http/http.dart' as http;

import '../tasks_page_component/token_storage.dart';

class AuthService {
  final String baseUrl = "https://habit-tracker-17sr.onrender.com";

  Future<Map<String, dynamic>> loginUser({
    required String email,
    required String password,
  }) async {
    final url = Uri.parse("$baseUrl/api/auth/login");

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['data'] != null && data['data']['token'] != null) {
        print("Token received: ${data['data']['token']}");
        await TokenStorage.saveToken(data['data']['token']);
      } else {
        print("No token received or login failed");
      }

      return data;
    } catch (e) {
      print("Error during login: $e");
      return {
        "success": false,
        "message": "Connection error",
      };
    }
  }
}
