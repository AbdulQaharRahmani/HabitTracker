import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ProfileService {
  final String baseUrl = "https://habit-tracker-17sr.onrender.com";

  /// ─────────────────────────────────────────────
  /// GET USER PREFERENCE (Profile Data)
  /// ─────────────────────────────────────────────
  Future<Map<String, dynamic>> getUserProfile() async {
    final url = Uri.parse("$baseUrl/api/users/preference");

    try {
      print("🔵 fetching user profile...");

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token == null) {
        print("❌ Token not found");
        return {
          "success": false,
          "message": "User not authenticated",
        };
      }

      final response = await http.get(
        url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );

      final responseData = jsonDecode(response.body);
      print("🟢Server response: ${response.body}");

      if (response.statusCode == 200 && responseData['success'] == true) {
        return responseData;
      } else {
        return {
          "success": false,
          "message": responseData['message'] ?? "Failed to load profile",
        };
      }
    } catch (e) {
      print("🔴 Exception error: $e");
      return {
        "success": false,
        "message": "Error with connecting to network",
      };
    }
  }

  /// ─────────────────────────────────────────────
  /// GET HABITS DASHBOARD
  /// ─────────────────────────────────────────────
  Future<Map<String, dynamic>> getHabitsDashboard() async {
    final url = Uri.parse("$baseUrl/api/habits/dashboard");

    try {
      print("🔵 fetching habits dashboard...");

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token == null) {
        return {
          "success": false,
          "message": "User not authenticated",
        };
      }

      final response = await http.get(
        url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
      );

      final responseData = jsonDecode(response.body);
      print("🟢Server response: ${response.body}");

      if (response.statusCode == 200 && responseData['success'] == true) {
        return responseData;
      } else {
        return {
          "success": false,
          "message": responseData['message'] ?? "Failed to load dashboard",
        };
      }
    } catch (e) {
      print("🔴 Exception error: $e");
      return {
        "success": false,
        "message": "Error with connecting to network",
      };
    }
  }

  /// ─────────────────────────────────────────────
  /// POST PROFILE IMAGE
  /// ─────────────────────────────────────────────
  Future<Map<String, dynamic>> uploadProfileImage(File imageFile) async {
    final url = Uri.parse("$baseUrl/api/users/profile-picture");

    try {
      print("🔵 uploading profile image...");

      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token == null) {
        return {
          "success": false,
          "message": "User not authenticated",
        };
      }

      final request = http.MultipartRequest("POST", url);
      request.headers["Authorization"] = "Bearer $token";

      request.files.add(
        await http.MultipartFile.fromPath(
          "image",
          imageFile.path,
        ),
      );

      final streamedResponse = await request.send();
      final response =
      await http.Response.fromStream(streamedResponse);

      final responseData = jsonDecode(response.body);
      print("🟢Server response: ${response.body}");

      if (response.statusCode == 200) {
        return responseData;
      } else {
        return {
          "success": false,
          "message": responseData['message'] ?? "UPLOAD_IMAGE",
        };
      }
    } catch (e) {
      print("🔴 Exception error: $e");
      return {
        "success": false,
        "message": "Error uploading image",
      };
    }
  }
}
