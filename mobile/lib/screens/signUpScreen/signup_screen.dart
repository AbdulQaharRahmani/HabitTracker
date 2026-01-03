import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:habit_tracker/screens/loginScreen/login_screen.dart';
import 'package:habit_tracker/utils/signUp/signup_form.dart';
import '../../utils/signUp/signup_controller.dart';
import '../../utils/signUp/social_buttons.dart';

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
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(height: 10.h),
              // App Logo
              Container(
                width: 60.w,
                height: 60.w,
                decoration: BoxDecoration(
                  color: AppTheme.primary,
                  borderRadius: BorderRadius.circular(20.r),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.06),
                      blurRadius: 12,
                      offset: const Offset(0, 6),
                    ),
                  ],
                ),
                child: Center(
                  child: Icon(
                    Icons.stacked_line_chart,
                    color: AppTheme.fabIcon,
                    size: 36.sp,
                  ),
                ),
              ),

              SizedBox(height: 5.h),
              Text(
                'Create Account',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25),
              ),

              // Start your journey
              Text(
                'Start your journey, to better habits today.',
                style: TextStyle(color: AppTheme.textMuted, fontSize: 16),
              ),
              SizedBox(height: 12.h),

              // Sign up form
              SignupForm(),
              SizedBox(height: 12.h),

              /// Social buttons
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 20.w),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    socialButton(
                      label: 'Google',
                      icon: 'assets/icons/google-icon.png',
                    ),
                    SizedBox(width: 12.w),
                    socialButton(label: 'Apple', icon: 'assets/apple-logo.png'),
                  ],
                ),
              ),
              SizedBox(height: 16.h),
              // Already you have an account.
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Already have an account?',
                    style: TextStyle(color: AppTheme.textMuted),
                  ),
                  SizedBox(width: 4.w),
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const LoginScreen(),
                        ),
                      );
                    },
                    child: Text(
                      'Login In',
                      style: TextStyle(
                        color: AppTheme.primary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 18.h),
            ],
          ),
        ),
      ),
    );
  }
}
