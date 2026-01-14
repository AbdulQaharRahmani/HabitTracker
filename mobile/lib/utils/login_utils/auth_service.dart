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
      print("🔵 در حال تلاش برای ورود...");
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      final responseData = jsonDecode(response.body);
      print("🟢 پاسخ سرور: ${response.body}");

      if (response.statusCode == 200 && responseData['success'] == true) {
        final prefs = await SharedPreferences.getInstance();

        // اصلاح مسیر استخراج توکن بر اساس لاگ ارسالی شما
        String? tokenToSave;
        if (responseData['data'] != null && responseData['data']['token'] != null) {
          tokenToSave = responseData['data']['token'];
        }

        if (tokenToSave != null) {
          await prefs.setString('auth_token', tokenToSave);
          print("✅ توکن با موفقیت ذخیره شد.");
          return responseData;
        } else {
          print("❌ خطا: فیلد توکن در پاسخ سرور یافت نشد.");
          return {"success": false, "message": "ساختار توکن نامعتبر است"};
        }
      } else {
        return {"success": false, "message": responseData['message'] ?? "خطا در ورود"};
      }
    } catch (e) {
      print("🔴 خطای استثنا: $e");
      return {"success": false, "message": "خطای اتصال به شبکه"};
    }
  }
}