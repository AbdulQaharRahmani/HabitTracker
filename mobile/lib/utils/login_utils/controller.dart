import 'package:flutter/material.dart';
import 'package:habit_tracker/services/auth_service.dart';


class LoginController extends ChangeNotifier {
  final formKey = GlobalKey<FormState>();

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  final ApiService _authService = ApiService();

  bool isLoading = false;
  String? errorMessage;

  // ===== Validators =====
  String? emailValidator(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Email is required';
    }
    if (!value.contains('@')) {
      return 'Invalid email';
    }
    return null;
  }

  String? passwordValidator(String? value) {
    if (value == null || value.length < 4) {
      return 'Password must be at least 4 characters';
    }
    return null;
  }

  // ===== Login =====
  Future<bool> login() async {
    if (formKey.currentState?.validate() != true) {
      return false;
    }

    isLoading = true;
    errorMessage = null;
    notifyListeners();

    try {
      final result = await _authService.login(
        email: emailController.text.trim(),
        password: passwordController.text.trim(),
      );

      if (result['success'] == true) {
        return true;
      } else {
        errorMessage = result['message'] ?? 'Login failed';
        return false;
      }
    } catch (e) {
      errorMessage = 'Connection error';
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void disposeAll() {
    emailController.dispose();
    passwordController.dispose();
    dispose();
  }
}
