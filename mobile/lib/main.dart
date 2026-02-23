import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/providers/theme_provider.dart';
import 'package:provider/provider.dart';
import 'app/app_theme.dart';
import 'features/routes.dart';

void main() {
  runApp(ChangeNotifierProvider(
    create: (context) => ThemeProvider(),
    child: const MyApp(),
  ),);
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // Initialize ScreenUtil for responsive sizing.
  // Use a designSize that matches your UI design (example: iPhone 12/13 size).
  @override
  Widget build(BuildContext context) {
     Provider.of<ThemeProvider>(context);
    return ScreenUtilInit(
        designSize: const Size(375, 812),
        minTextAdapt: true,
        splitScreenMode: true,
        builder: (context, child) {
          return MaterialApp(
            theme: Provider.of<ThemeProvider>(context).currentTheme,


            initialRoute: AppRoutes.splash,
            routes: AppRoutes.routes,
            debugShowCheckedModeBanner: false,
          );
        }
    );
  }
}
