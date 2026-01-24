import 'package:flutter/material.dart';

import '../../services/auth_service.dart';

class SignUpController {
  final formKey = GlobalKey<FormState>();

  final usernameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  bool isAgreeTerms = false;


  final AuthService _authService = AuthService();

  // ===== Validators =====
  String? nameValidator(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Please enter name';
    }
    return null;
  }

  String? emailValidator(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Please enter email';
    }
    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
      return 'Enter a valid email ex: ali321@gmial.com';
    }
    return null;
  }

  String? passwordValidator(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Please enter password';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  }

  // ===== Sign Up Logic =====
  Future<bool> signUp() async {
    print("SignUp started");
    if (formKey.currentState?.validate() != true) {
      print("Form validation failed");
      return false;
    }
    if (!isAgreeTerms) {
      print("Terms not agreed");
      return false;
    }

    final result = await _authService.registerUser(
      username: usernameController.text,
      email: emailController.text,
      password: passwordController.text,
    );

    print("Server response: $result");
    return result["success"] == true;
  }


  void _showSuccessMessage(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Sign up successful!'),
        backgroundColor: Colors.green,
        duration: Duration(seconds: 2),
      ),
    );
  }

  void clear() {
    usernameController.clear();
    emailController.clear();
    passwordController.clear();
    isAgreeTerms = false;
  }

  void dispose() {
    usernameController.dispose();
    emailController.dispose();
    passwordController.dispose();
  }
}