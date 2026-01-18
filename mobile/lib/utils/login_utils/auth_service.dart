import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  final String baseUrl = "https://habit-tracker-17sr.onrender.com";

  Future<Map<String, dynamic>> loginUser({
    required String email,
    required String password,
  }) async {
    final url = Uri.parse("$baseUrl/api/auth/login");

    try {
      print("🔵 trying to login...");
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      final responseData = jsonDecode(response.body);
      print("🟢Server response: ${response.body}");

      if (response.statusCode == 200 && responseData['success'] == true) {
        final prefs = await SharedPreferences.getInstance();

        String? tokenToSave;
        if (responseData['data'] != null && responseData['data']['token'] != null) {
          tokenToSave = responseData['data']['token'];
        }

        if (tokenToSave != null) {
          await prefs.setString('auth_token', tokenToSave);
          print("✅ Token saved successfully");
          return responseData;
        } else {
          print("❌ Error:Token filed not found in server response.");
          return {"success": false, "message": "The token structure in not valid"};
        }
      } else {
        return {"success": false, "message": responseData['message'] ?? "Error in login"};
      }
    } catch (e) {
      print("🔴 Exception error: $e");
      return {"success": false, "message": "Error with connecting to network"};
    }
  }
}