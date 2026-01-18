import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  final String baseUrl = 'https://habit-tracker-17sr.onrender.com/api';

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
      body: jsonEncode({"name": name, "email": email, "password": password}),
    );
    return jsonDecode(response.body);
  }

// ======= login user and save token  =======
//   Future<bool> loginUser({
//     required String email,
//     required String password,
//   }) async {
//     final url = Uri.parse('$baseUrl/auth/login');
//
//     final response = await http.post(
//       url,
//       headers: {"Content-Type": "application/json"},
//       body: jsonEncode({"email": email, "password": password}),
//     );
//
//     if (response.statusCode == 200) {
//       final data = jsonDecode(response.body);
//       await TokenStorage.saveToken(data['token']);
//       return true;
//     } else {
//       return false;
//     }
//   }
}
