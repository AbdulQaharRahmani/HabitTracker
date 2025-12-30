import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  final String baseUrl = "http://10.100.100.34:3000";

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
        "name": name,
        "email": email,
        "password": password,
      }),
    );

    print("HTTP Status: ${response.statusCode}");
    print("HTTP Body: ${response.body}");

    return jsonDecode(response.body);
  }
  }