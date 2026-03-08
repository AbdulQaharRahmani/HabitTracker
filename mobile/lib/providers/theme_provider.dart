import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../app/app_theme.dart' as legacy_theme;
import '../core/theme/app_theme.dart' as core_theme;

class ThemeProvider extends ChangeNotifier {
  static const String _themeKey = 'isDarkMode';
  bool _isDarkMode = false;

  bool get isDarkMode => _isDarkMode;
  ThemeMode get themeMode => _isDarkMode ? ThemeMode.dark : ThemeMode.light;

  ThemeData get currentTheme =>
      _isDarkMode ? core_theme.AppTheme.dark() : core_theme.AppTheme.light();

  ThemeProvider() {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    _isDarkMode = prefs.getBool(_themeKey) ?? false;

    // Keep legacy static palette in sync while old UI is being migrated.
    legacy_theme.AppTheme.setTheme(_isDarkMode);
    notifyListeners();
  }

  Future<void> toggleTheme() async {
    _isDarkMode = !_isDarkMode;

    legacy_theme.AppTheme.setTheme(_isDarkMode);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_themeKey, _isDarkMode);

    notifyListeners();
  }

  Future<void> setTheme(bool isDark) async {
    _isDarkMode = isDark;

    legacy_theme.AppTheme.setTheme(_isDarkMode);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_themeKey, _isDarkMode);

    notifyListeners();
  }
}
