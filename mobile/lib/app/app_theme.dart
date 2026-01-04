import 'package:flutter/material.dart';

class AppTheme {

  /* -------------------------------------------------------------------------- */
  /*                                Base Colors                                 */
  /* -------------------------------------------------------------------------- */

  /// App background
  static const Color background = Color(0xFFEFF2F6);

  /// Cards, sheets, tiles
  static const Color surface = Color(0xFFFFFFFF);

  /// TextFields, search bars
  static const Color inputBackground = Color(0xFFF9FAFB);

  /// Primary brand color
  static const Color primary = Color(0xFF6366F1);

  /// Borders & dividers
  static const Color border = Color(0xFFE5E7EB);

  /// Shadows (cards, FAB)
  static const Color shadow = Color(0x14000000);

  /* -------------------------------------------------------------------------- */
  /*                                 Text Colors                                 */
  /* -------------------------------------------------------------------------- */

  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color textWhite = Color(0xFFFFFFFF);

  /* -------------------------------------------------------------------------- */
  /*                              Status & States                                */
  /* -------------------------------------------------------------------------- */

  static const Color success = Color(0xFF22C55E);
  static const Color successBackground = Color(0xFFDCFCE7);

  static const Color warning = Color(0xFFF59E0B);
  static const Color warningBackground = Color(0xFFFFEDD5);

  static const Color error = Color(0xFFEF4444);

  static const Color pendingIcon = Color(0xFFF97316);

  /* -------------------------------------------------------------------------- */
  /*                                Category Chips                               */
  /* -------------------------------------------------------------------------- */

  static const Color healthBackground = Color(0xFFE0F2FE);
  static const Color healthText = Color(0xFF0284C7);

  static const Color learningBackground = Color(0xFFF3E8FF);
  static const Color learningText = Color(0xFF7C3AED);

  static const Color fitnessBackground = Color(0xFFFFF7ED);
  static const Color fitnessText = Color(0xFFEA580C);

  static const Color productivityBackground = Color(0xFFE0E7FF);
  static const Color productivityText = Color(0xFF3730A3);

  static const Color creativityBackground = Color(0xFFFEF3C7);
  static const Color creativityText = Color(0xFFB45309);

  static const Color mindfulnessBackground = Color(0xFFE5E7EB);
  static const Color mindfulnessText = Color(0xFF475569);

  /* -------------------------------------------------------------------------- */
  /*                              Charts & Statistics                             */
  /* -------------------------------------------------------------------------- */

  static const Color chartLine = primary;
  static const Color chartFillTop = Color(0x406366F1);
  static const Color chartFillBottom = Color(0x006366F1);
  static const Color chartGrid = border;
  static const Color chartTooltipBackground = textPrimary;

  /* -------------------------------------------------------------------------- */
  /*                              Heatmap (Consistency)                           */
  /* -------------------------------------------------------------------------- */

  static const Color heatEmpty = Color(0xFFF1F5F9);
  static const Color heatLow = Color(0xFFE0E7FF);
  static const Color heatMedium = Color(0xFFA5B4FC);
  static const Color heatHigh = primary;

  /* -------------------------------------------------------------------------- */
  /*                                Progress Bars                                 */
  /* -------------------------------------------------------------------------- */

  static const Color progressTrack = border;
  static const Color progressFill = primary;

  /* -------------------------------------------------------------------------- */
  /*                                Chips & Filters                                */
  /* -------------------------------------------------------------------------- */

  static const Color filterActiveBackground = primary;
  static const Color filterActiveText = textWhite;
  static const Color filterInactiveBackground = surface;
  static const Color filterInactiveText = textSecondary;

  /* -------------------------------------------------------------------------- */
  /*                              Calendar / Date Picker                           */
  /* -------------------------------------------------------------------------- */

  static const Color calendarActiveBackground = primary;
  static const Color calendarInactiveBackground = surface;

  /* -------------------------------------------------------------------------- */
  /*                                 Floating Button                               */
  /* -------------------------------------------------------------------------- */

  static const Color fabBackground = primary;
  static const Color fabIcon = textWhite;
  static const Color fabShadow = Color(0x506366F1);

  /* -------------------------------------------------------------------------- */
  /*                                   Theme Data                                  */
  /* -------------------------------------------------------------------------- */

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: background,
    primaryColor: primary,

    colorScheme: const ColorScheme.light(
      primary: primary,
      surface: surface,
      error: error,
    ),

    appBarTheme: const AppBarTheme(
      backgroundColor: background,
      elevation: 0,
      foregroundColor: textPrimary,
      centerTitle: false,
    ),

    cardColor: surface,
    dividerColor: border,

    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: inputBackground,
      hintStyle: const TextStyle(color: textMuted),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: primary, width: 1.5),
      ),
    ),

    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary,
        foregroundColor: textWhite,
        elevation: 0,
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
        ),
      ),
    ),

    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: fabBackground,
      foregroundColor: fabIcon,
      elevation: 8,
    ),

    textTheme: const TextTheme(
      titleLarge: TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.bold,
        color: textPrimary,
      ),
      titleMedium: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
      bodyMedium: TextStyle(
        fontSize: 14,
        color: textSecondary,
      ),
      bodySmall: TextStyle(
        fontSize: 12,
        color: textMuted,
      ),
    ),
  );
}
