import 'package:flutter/material.dart';
import 'package:habit_tracker/screans/login_screen.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/screans/sign_up_page.dart';
import 'package:habit_tracker/screans/home_screan.dart';

void main() {

  runApp(
       ScreenUtilInit(
        designSize: const Size(375, 812),
        minTextAdapt: true,
        builder: (context, child) {
          return const MaterialApp(
            debugShowCheckedModeBanner: false,
            home: LoginScreen(),
          );
        },
      ),
  );
}

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
         home:SignUpPage(),
      debugShowCheckedModeBanner: false,
    );
  }