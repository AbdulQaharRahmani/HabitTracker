import 'package:flutter/material.dart';
import 'package:habit_tracker/screans/login_screen.dart';
import 'package:provider/provider.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

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
