import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';

import '../../app/app_theme.dart';
import '../../utils/login/header_card_login.dart';
import '../../utils/login/login_card.dart';
import '../../services/controller.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => LoginController(),
      child: Scaffold(
        backgroundColor: AppTheme.background,
        body: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 12.h, vertical: 100.h),
          child: Column(
            children: [
              const HeaderCard(),
              const SizedBox(height: 20),
              LoginCard(controller: LoginController() ),
            ],
          ),
        ),
      ),
    );
  }
}
