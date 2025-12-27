import 'package:flutter/material.dart';
import 'package:habit_tracker/screans/sign_up_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
         home:SignUpPage(),
      debugShowCheckedModeBanner: false,
    );
  }}