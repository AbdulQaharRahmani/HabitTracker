import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/taskpage_components/token_storage.dart';

class AuthService {
  final String baseUrl = "https://habit-tracker-17sr.onrender.com";

  /// =========================
  /// REGISTER USER
  /// =========================
  /// Sends a POST request to register a new user.
  /// Returns a Map with 'success' and 'message'.
  Future<Map<String, dynamic>> registerUser({
    required String username, // Backend expects 'username' field
    required String email,
    required String password,
  }) async {
    print("AuthService: registerUser CALLED");
    print("Username: $username");
    print("Email: $email");

    final url = Uri.parse("$baseUrl/api/auth/register");
    print("URL: $url");

    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "username": username,
          "email": email,
          "password": password,
        }),
      );

      final responseData = jsonDecode(response.body);
      print("🟢 Server response: $responseData");

      // ====== Handle server errors ======
      if (responseData['code'] == 'DUPLICATE') {
        return {"success": false, "message": "This email or username is already taken"};
      } else if (responseData['code'] == 'VALIDATION_ERROR') {
        return {"success": false, "message": responseData['message'] ?? "Validation error"};
      }

      // If successful
      if (responseData['success'] == true) {
        return responseData;
      } else {
        return {"success": false, "message": responseData['message'] ?? "Registration failed"};
      }
    } catch (e) {
      print("🔴 Exception during register: $e");
      return {"success": false, "message": "Network or server error"};
    }
  }

  /// =========================
  /// LOGIN USER
  /// =========================
  /// Sends a POST request to login a user.
  /// Saves token to TokenStorage if successful.
  /// Returns a Map with 'success' and 'message'.
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
      print("🟢 Server response: $responseData");

      // ====== Successful login ======
      if (response.statusCode == 200 && responseData['success'] == true) {
        // Save token
        if (responseData['data'] != null && responseData['data']['token'] != null) {
          final token = responseData['data']['token'];
          await TokenStorage.saveToken(token);
          print("✅ Token saved successfully");
          return responseData;
        } else {
          print("❌ Token not found in server response.");
          return {"success": false, "message": "Token not received"};
        }
      } else {
        return {"success": false, "message": responseData['message'] ?? "Login failed"};
      }
    } catch (e) {
      print("🔴 Exception during login: $e");
      return {"success": false, "message": "Network or server error"};
    }
  }
}
