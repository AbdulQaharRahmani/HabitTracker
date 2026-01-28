import 'package:flutter/material.dart';
import 'package:habit_tracker/screens/homeScreen/home_screen.dart';
import 'package:habit_tracker/screens/profileScreen/profile_screen.dart';
import 'package:habit_tracker/screens/settingScreen/setting_screen.dart';
import '../screens/signUpScreen/signup_screen.dart';
import '../screens/loginScreen/login_screen.dart';
import '../screens/splashScreen/splash_screen.dart';

// for my dear friends add the new routes here
//   Navigator.pushNamed(context,AppRoutes.home);

class AppRoutes {
  static const splash = '/';

  static const login = '/login';
  static const signup = '/signup';
  static const home = '/home';
  static const profile = '/profile';
  static const setting="/setting";

  static final Map<String, WidgetBuilder> routes = {
    splash: (context) => const SplashScreen(),

    login: (context) => const LoginScreen(),
    signup: (context) => const SignUpScreen(),
    home: (context) => const HomeScreen(),
    profile: (context) => const ProfileScreen(),
    setting:(context)=> const SettingScreen(),
  };
}
