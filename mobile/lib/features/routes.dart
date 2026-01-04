import 'package:flutter/material.dart';
import 'package:habit_tracker/screens/homeScreen/home_screen.dart';
import 'package:habit_tracker/screens/profileScreen/profile_screen.dart';
import '../screens/signUpScreen/signup_screen.dart';
import '../screens/loginScreen/login_screen.dart';

// for my dear friends add the new routes here
//   Navigator.pushNamed(context,AppRoutes.home);

class AppRoutes {
  static const splash = '/';
  static const signup = '/signup';
  static const login = '/login';
  static const home = '/home';
  static const profile = '/profile';

  static final Map<String, WidgetBuilder> routes = {
    splash: (context) => const SignUpScreen(),
    signup: (context) => const SignUpScreen(),
    login: (context) => const LoginScreen(),
    home: (context) => const HomeScreen(),
    profile: (context) => const ProfileScreen(),
  };
}
