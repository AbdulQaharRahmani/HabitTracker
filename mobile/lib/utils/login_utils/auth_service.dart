import 'dart:convert';
import 'package:http/http.dart' as http;

import '../taskpage_components/token_storage.dart';

class AuthService {
  final String baseUrl = "https://habit-tracker-17sr.onrender.com";

  Future<Map<String, dynamic>> loginUser({
    required String email,
    required String password,
  }) async {
    final url = Uri.parse("$baseUrl/api/auth/login");

    try {
      print("🔵 Trying to login...");
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      final responseData = jsonDecode(response.body);
      print("🟢 Server response: ${response.body}");

      if (response.statusCode == 200 && responseData['success'] == true) {
        // Save token using TokenStorage
        if (responseData['data'] != null && responseData['data']['token'] != null) {
          final token = responseData['data']['token'];
          await TokenStorage.saveToken(token);
          print("✅ Token saved successfully");
          return responseData;
        } else {
          print("❌ Token not found in server response.");
          return {"success": false, "message": "Invalid token structure"};
        }
      } else {
        return {"success": false, "message": responseData['message'] ?? "Login failed"};
      }
    } catch (e) {
      print("🔴 Exception error: $e");
      return {"success": false, "message": "Network or server error"};
    }
  }
}