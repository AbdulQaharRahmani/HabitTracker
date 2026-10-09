import 'package:flutter/material.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/usecases/register_usecase.dart';

class SignUpController extends ChangeNotifier {
  final formKey = GlobalKey<FormState>();

  final usernameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  bool isAgreeTerms = false;
  bool isLoading = false;
  String? errorMessage;

  final RegisterUseCase _registerUseCase = RegisterUseCase(AuthRepositoryImpl());

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
  Future<bool> signUp() async {
    if (formKey.currentState?.validate() != true) {
      return false;
    }


    if (!isAgreeTerms) {
      errorMessage = 'Please agree to the terms and conditions';
      return false;
    }

    isLoading = true;
    errorMessage = null;
    notifyListeners();

    try {
      final result = await _registerUseCase(
        name: usernameController.text.trim(),
        email: emailController.text.trim(),
        password: passwordController.text.trim(),
      );

      if (result.success) {
        errorMessage = null;
        return true;
      } else {
        errorMessage = result.message ?? 'Registration failed';
        return false;
      }
    } catch (e) {
      errorMessage = 'Connection error: $e';
      return false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void clear() {
    usernameController.clear();
    emailController.clear();
    passwordController.clear();
    isAgreeTerms = false;
    errorMessage = null;
    notifyListeners();
  }

  @override
  void dispose() {
    usernameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }
}
