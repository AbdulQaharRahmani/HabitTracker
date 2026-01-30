import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  final String baseUrl = "https://habit-tracker-17sr.onrender.com";

  Future<Map<String, dynamic>> registerUser({
    required String name,
    required String email,
    required String password,
  }) async {
    print("AuthService: registerUser CALLED");
    print("Name: $name");
    print("Email: $email");

    final url = Uri.parse("$baseUrl/api/auth/register");
    print("URL: $url");

    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "username": name,
        "email": email,
        "password": password,
      }),
    );
    return jsonDecode(response.body);
  }
  }