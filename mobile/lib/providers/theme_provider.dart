import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../app/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../app/app_theme.dart';

class ThemeProvider extends ChangeNotifier {
  static const String _themeKey = 'isDarkMode';
  bool _isDarkMode = false;

  bool get isDarkMode => _isDarkMode;

  // ──────────────────────────────────────────────────────────────
  // این خط خیلی مهم است — از currentTheme دینامیک AppTheme استفاده می‌کنه
  // ──────────────────────────────────────────────────────────────
  ThemeData get currentTheme => AppTheme.currentTheme;

  ThemeProvider() {
    _loadTheme();
  }

  // ──────────────────────────────────────────────────────────────
  // لود تم از حافظه
  // ──────────────────────────────────────────────────────────────
  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    _isDarkMode = prefs.getBool(_themeKey) ?? false;

    AppTheme.setTheme(_isDarkMode);   // رنگ‌های AppTheme رو بروز می‌کنه
    notifyListeners();
  }

  // ──────────────────────────────────────────────────────────────
  // سوئیچ تم (دکمه Dark Mode)
  // ──────────────────────────────────────────────────────────────
  Future<void> toggleTheme() async {
    _isDarkMode = !_isDarkMode;

    AppTheme.setTheme(_isDarkMode);   // رنگ‌ها رو عوض می‌کنه
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_themeKey, _isDarkMode);

    notifyListeners();
  }

  // ──────────────────────────────────────────────────────────────
  // تنظیم مستقیم تم (در صورت نیاز)
  // ──────────────────────────────────────────────────────────────
  Future<void> setTheme(bool isDark) async {
    _isDarkMode = isDark;

    AppTheme.setTheme(_isDarkMode);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_themeKey, _isDarkMode);

    notifyListeners();
  }
}