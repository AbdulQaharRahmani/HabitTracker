import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/screans/taskPage/tasks_screen.dart';
import '../utils/header_card_login.dart';
import '../utils/login_card.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {


    return Scaffold(
      body: SingleChildScrollView(
        padding:  EdgeInsets.symmetric(horizontal: 12.h, vertical:100.h),
        child: Column(
          children: [
            const HeaderCard(),
            LoginCard(
              emailController: emailController,
              passwordController: passwordController,
              onLoginSuccess: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Login success! Token saved.')),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
