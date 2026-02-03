import 'package:flutter/material.dart';
import '../../services/auth_service.dart';

class SignUpController extends ChangeNotifier {
  final formKey = GlobalKey<FormState>();

  final usernameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  bool isAgreeTerms = false;
  bool isLoading = false;
  String? errorMessage;

  final ApiService _authService = ApiService();

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
      return 'Enter a valid email ex: ali321@gmail.com';
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
  Future<bool> signUp(BuildContext context) async {
    print("SignUp started");

    if (formKey.currentState?.validate() != true) {
      print("Form validation failed");
      return false;
    }


    if (!isAgreeTerms) {
      errorMessage = 'Please agree to the terms and conditions';
      _showErrorMessage(context, errorMessage!);
      return false;
    }

    final result = await _authService.register(
      name: usernameController.text,
      email: emailController.text,
      password: passwordController.text,
    );
    isLoading = true;
    errorMessage = null;
    notifyListeners();

    try {
      final result = await _authService.register(
        name: usernameController.text.trim(),
        email: emailController.text.trim(),
        password: passwordController.text.trim(),
      );

      print("Server response: $result");

      if (result["success"] == true) {

        _showSuccessMessage(context);
        return true;
      } else {
        errorMessage = result["message"] ?? 'Registration failed';
        _showErrorMessage(context, errorMessage!);
        return false;
      }
    } catch (e) {
      errorMessage = 'Connection error: $e';
      _showErrorMessage(context, errorMessage!);
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void _showSuccessMessage(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Sign up successful!'),
        backgroundColor: Colors.green,
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _showErrorMessage(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        duration: Duration(seconds: 3),
      ),
    );
  }

  void clear() {
    usernameController.clear();
    emailController.clear();
    passwordController.clear();
    isAgreeTerms = false;
    errorMessage = null;
    notifyListeners();
  }

  void dispose() {
    usernameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
