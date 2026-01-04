import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'features/routes.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // Initialize ScreenUtil for responsive sizing.
  // Use a designSize that matches your UI design (example: iPhone 12/13 size).
  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
        designSize: const Size(375, 812),
        minTextAdapt: true,
        splitScreenMode: true,
        builder: (context, child) {
          return MaterialApp(
            initialRoute: AppRoutes.splash,
            routes: AppRoutes.routes,
            debugShowCheckedModeBanner: false,
          );
        }
    );
  }
}
