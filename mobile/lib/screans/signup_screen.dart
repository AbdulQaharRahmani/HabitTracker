import 'package:flutter/material.dart';
import 'package:habit_tracker/screans/login_screen.dart';
import 'package:habit_tracker/utils/signup_form.dart';
import '../utils/signup_controller.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final controller = SignUpController();
  bool isPasswordHidden = true;

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF2F6),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(height: 10),
              // App Logo
              ClipRRect(
                borderRadius: BorderRadius.circular(40),
                child: Image.asset(
                  fit: BoxFit.contain,
                  'assets/appLogo.png',
                  height: 80,
                ),
              ),
              const SizedBox(height:5),
              Text(
                'Create Account',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25),
              ),

              // Start your journey
              Text(
                'Start your journey, to better habits today.',
                style: TextStyle(color: Colors.grey[700], fontSize: 16),
              ),
              const SizedBox(height: 15),

              // Sign up form
              SignupForm(),
              const SizedBox(height: 10),

              // Already you have an account.
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Already have an account?',
                    style: TextStyle(color: Colors.grey[700]),
                  ),
                  const SizedBox(width: 4),
                  GestureDetector(
                    onTap: () {
                      Navigator.push(context,MaterialPageRoute(builder:(context) => const LoginScreen(),));
                    },
                    child: Text(
                      'Login In',
                      style: TextStyle(
                        color: Colors.blue,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
