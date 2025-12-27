import 'package:flutter/material.dart';

class SignUpController {
  final formKey = GlobalKey<FormState>();

  final usernameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  bool isAgreeTerms = false;

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
      return 'Enter a valid email';
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
  bool signUp(BuildContext context) {
    // Validate form
    if (formKey.currentState?.validate() != true) {
      _showValidationDialog(context, 'Please fill all fields correctly');
      return false;
    }

    // Check terms agreement
    if (!isAgreeTerms) {
      _showValidationDialog(context, 'Please accept terms and conditions');
      return false;
    }

    // All validations passed
    _showSuccessMessage(context);

    // Here you would typically call your API
    print('Sign up successful!');
    print('Name: ${usernameController.text}');
    print('Email: ${emailController.text}');

    return true;
  }

  // ===== Helper Methods =====
  void _showValidationDialog(BuildContext context, String message) {
    showDialog(
      context: context,
      barrierDismissible: false, // جلوگیری از بستن تصادفی
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Icon
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.error_outline,
                  color: Colors.red,
                  size: 36,
                ),
              ),

              const SizedBox(height: 16),

              // Title
              const Text(
                'Validation Error',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),

              const SizedBox(height: 10),

              // Message
              Text(
                message,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[700],
                ),
              ),

              const SizedBox(height: 20),

              // Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    'Got it',
                    style: TextStyle(fontSize: 15),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
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