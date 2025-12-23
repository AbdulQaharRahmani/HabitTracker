import 'package:flutter/material.dart';

class AppTheme {

  static const Color background60 = Color(0xFFFFF8F4);
  static const Color primary30   = Color(0xFF9E6F5E);
  static const Color accent10    = Color(0xFFE6B8A2);
  static const Color cardColor   = Color(0xFFF4EDE8);

  static ThemeData get lightTheme {
    return ThemeData(
      scaffoldBackgroundColor: background60,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary30,
        primary: primary30,
        secondary: accent10,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: primary30,
        foregroundColor: Colors.white,
        centerTitle: true,
        elevation: 2,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: cardColor,
        contentPadding:
        const EdgeInsets.symmetric(vertical: 12, horizontal: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: accent10,
          foregroundColor: Colors.black87,
          padding: const EdgeInsets.symmetric(vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          textStyle: const TextStyle(fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
