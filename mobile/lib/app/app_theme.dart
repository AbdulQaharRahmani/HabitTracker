import 'package:flutter/material.dart';

class AppTheme {
  // ──────────────────────────────────────────────────────────────
  // رنگ‌های دینامیک (در زمان اجرا تغییر می‌کنند)
  // ──────────────────────────────────────────────────────────────
  static Color background = const Color(0xFFEFF2F6);
  static Color surface = const Color(0xFFFFFFFF);
  static Color inputBackground = const Color(0xFFF9FAFB);
  static Color primary = const Color(0xFF6366F1);
  static Color border = const Color(0xFFE5E7EB);
  static Color shadow = const Color(0x14000000);

  static Color textPrimary = const Color(0xFF0F172A);
  static Color textSecondary = const Color(0xFF64748B);
  static Color textMuted = const Color(0xFF94A3B8);
  static Color textWhite = const Color(0xFFFFFFFF);

  static Color success = const Color(0xFF22C55E);
  static Color successBackground = const Color(0xFFDCFCE7);
  static Color warning = const Color(0xFFF59E0B);
  static Color warningBackground = const Color(0xFFFFEDD5);
  static Color error = const Color(0xFFEF4444);
  static Color pendingIcon = const Color(0xFFF97316);
  static Color streakBadge = const Color(0x80EFD8C2);

  static Color healthBackground = const Color(0xFFE0F2FE);
  static Color healthText = const Color(0xFF0284C7);
  static Color learningBackground = const Color(0xFFF3E8FF);
  static Color learningText = const Color(0xFF7C3AED);
  static Color fitnessBackground = const Color(0xFFFFF7ED);
  static Color fitnessText = const Color(0xFFEA580C);
  static Color productivityBackground = const Color(0xFFE0E7FF);
  static Color productivityText = const Color(0xFF3730A3);
  static Color creativityBackground = const Color(0xFFFEF3C7);
  static Color creativityText = const Color(0xFFB45309);
  static Color mindfulnessBackground = const Color(0xFFE5E7EB);
  static Color mindfulnessText = const Color(0xFF475569);

  static Color chartLine = const Color(0xFF6366F1);
  static Color chartFillTop = const Color(0x406366F1);
  static Color chartFillBottom = const Color(0x006366F1);
  static Color chartGrid = const Color(0xFFE5E7EB);
  static Color chartTooltipBackground = const Color(0xFF0F172A);

  static Color heatEmpty = const Color(0xFFF1F5F9);
  static Color heatLow = const Color(0xFFE0E7FF);
  static Color heatMedium = const Color(0xFFA5B4FC);
  static Color heatHigh = const Color(0xFF6366F1);

  static Color progressTrack = const Color(0xFFE5E7EB);
  static Color progressFill = const Color(0xFF6366F1);

  static Color filterActiveBackground = const Color(0xFF6366F1);
  static Color filterActiveText = const Color(0xFFFFFFFF);
  static Color filterInactiveBackground = const Color(0xFFFFFFFF);
  static Color filterInactiveText = const Color(0xFF64748B);

  static Color calendarActiveBackground = const Color(0xFF6366F1);
  static Color calendarInactiveBackground = const Color(0xFFFFFFFF);

  static Color fabBackground = const Color(0xFF6366F1);
  static Color fabIcon = const Color(0xFFFFFFFF);
  static Color fabShadow = const Color(0x506366F1);

  // ──────────────────────────────────────────────────────────────
  // رنگ‌های دارک جدید (بر اساس کد HTML که دادی)
  // ──────────────────────────────────────────────────────────────
  static const Color darkBackground = Color(0xFF111827);     // page-bg
  static const Color darkSurface = Color(0xFF1F2937);        // card-bg
  static const Color darkSurfaceHover = Color(0xFF374151);   // search-bg / input
  static const Color darkPrimary = Color(0xFF6366F1);        // primary-purple
  static const Color darkBorder = Color(0xFF374151);

  static const Color darkTextPrimary = Color(0xFFF9FAFB);    // text-main
  static const Color darkTextSecondary = Color(0xFF9CA3AF);  // text-sub
  static const Color darkTextMuted = Color(0xFF9CA3AF);      // text-sub

  // بقیه رنگ‌های دارک (بدون تغییر یا بهبود یافته)
  static const Color successDark = Color(0xFF4ADE80);
  static const Color successBackgroundDark = Color(0x334ADE80);
  static const Color warningDark = Color(0xFFFB923C);
  static const Color warningBackgroundDark = Color(0x33FB923C);
  static const Color errorDark = Color(0xFFEF4444);
  static const Color pendingIconDark = Color(0xFFFB923C);
  static const Color streakBadgeDark = Color(0x33FB923C);

  static const Color chartLineDark = Color(0xFF6366F1);
  static const Color chartFillTopDark = Color(0x406366F1);
  static const Color chartFillBottomDark = Color(0x006366F1);
  static const Color chartGridDark = Color(0xFF374151);
  static const Color chartTooltipBackgroundDark = Color(0xFF1F2937);

  static const Color heatEmptyDark =  Color(0x144f46e5);
  static const Color heatLowDark = Color(0x334f46e5);
  static const Color heatMediumDark = Color(0x664f46e5);
  static const Color heatHighDark = Color(0xFF6366F1);

  static const Color progressTrackDark = Color(0xFF374151);
  static const Color progressFillDark = Color(0xFF6366F1);

  static const Color filterActiveBackgroundDark = Color(0xFF6366F1);
  static const Color filterActiveTextDark = Color(0xFFFFFFFF);
  static const Color filterInactiveBackgroundDark = Color(0xFF1F2937);
  static const Color filterInactiveTextDark = Color(0xFF9CA3AF);

  static const Color calendarActiveBackgroundDark = Color(0xFF6366F1);
  static const Color calendarInactiveBackgroundDark = Color(0xFF1F2937);

  static const Color fabBackgroundDark = Color(0xFF6366F1);
  static const Color fabIconDark = Colors.white;
  static const Color fabShadowDark = Color(0x506366F1);

  // ──────────────────────────────────────────────────────────────
  // متد سوئیچ تم (به‌روزرسانی شده)
  // ──────────────────────────────────────────────────────────────
  static void setTheme(bool isDark) {
    if (isDark) {
      background = darkBackground;
      surface = darkSurface;
      inputBackground = darkSurfaceHover;
      primary = darkPrimary;
      border = darkBorder;
      shadow = const Color(0x1A000000);

      textPrimary = darkTextPrimary;
      textSecondary = darkTextSecondary;
      textMuted = darkTextMuted;
      textWhite = darkTextPrimary;

      success = successDark;
      successBackground = successBackgroundDark;
      warning = warningDark;
      warningBackground = warningBackgroundDark;
      error = errorDark;
      pendingIcon = pendingIconDark;
      streakBadge = streakBadgeDark;

      healthBackground = const Color(0x332636f1);
      healthText = const Color(0xFF818CF8);
      learningBackground = const Color(0x334f46e5);
      learningText = const Color(0xFF818CF8);
      fitnessBackground = const Color(0x33ea580c);
      fitnessText = const Color(0xFFFB923C);
      productivityBackground = const Color(0x333636f1);
      productivityText = const Color(0xFF6366F1);
      creativityBackground = const Color(0x33f59e0b);
      creativityText = const Color(0xFFFB923C);
      mindfulnessBackground = const Color(0x334b5563);
      mindfulnessText = const Color(0xFF9CA3AF);

      chartLine = chartLineDark;
      chartFillTop = chartFillTopDark;
      chartFillBottom = chartFillBottomDark;
      chartGrid = chartGridDark;
      chartTooltipBackground = chartTooltipBackgroundDark;

      heatEmpty = heatEmptyDark;
      heatLow = heatLowDark;
      heatMedium = heatMediumDark;
      heatHigh = heatHighDark;

      progressTrack = progressTrackDark;
      progressFill = progressFillDark;

      filterActiveBackground = filterActiveBackgroundDark;
      filterActiveText = filterActiveTextDark;
      filterInactiveBackground = filterInactiveBackgroundDark;
      filterInactiveText = filterInactiveTextDark;

      calendarActiveBackground = calendarActiveBackgroundDark;
      calendarInactiveBackground = calendarInactiveBackgroundDark;

      fabBackground = fabBackgroundDark;
      fabIcon = fabIconDark;
      fabShadow = fabShadowDark;
    } else {
      // Light Theme (بدون تغییر)
      background = const Color(0xFFEFF2F6);
      surface = const Color(0xFFFFFFFF);
      inputBackground = const Color(0xFFF9FAFB);
      primary = const Color(0xFF6366F1);
      border = const Color(0xFFE5E7EB);
      shadow = const Color(0x14000000);

      textPrimary = const Color(0xFF0F172A);
      textSecondary = const Color(0xFF64748B);
      textMuted = const Color(0xFF94A3B8);
      textWhite = const Color(0xFFFFFFFF);

      success = const Color(0xFF22C55E);
      successBackground = const Color(0xFFDCFCE7);
      warning = const Color(0xFFF59E0B);
      warningBackground = const Color(0xFFFFEDD5);
      error = const Color(0xFFEF4444);
      pendingIcon = const Color(0xFFF97316);
      streakBadge = const Color(0x80EFD8C2);

      healthBackground = const Color(0xFFE0F2FE);
      healthText = const Color(0xFF0284C7);
      learningBackground = const Color(0xFFF3E8FF);
      learningText = const Color(0xFF7C3AED);
      fitnessBackground = const Color(0xFFFFF7ED);
      fitnessText = const Color(0xFFEA580C);
      productivityBackground = const Color(0xFFE0E7FF);
      productivityText = const Color(0xFF3730A3);
      creativityBackground = const Color(0xFFFEF3C7);
      creativityText = const Color(0xFFB45309);
      mindfulnessBackground = const Color(0xFFE5E7EB);
      mindfulnessText = const Color(0xFF475569);

      chartLine = const Color(0xFF6366F1);
      chartFillTop = const Color(0x406366F1);
      chartFillBottom = const Color(0x006366F1);
      chartGrid = const Color(0xFFE5E7EB);
      chartTooltipBackground = const Color(0xFF0F172A);

      heatEmpty = const Color(0xFFF1F5F9);
      heatLow = const Color(0xFFE0E7FF);
      heatMedium = const Color(0xFFA5B4FC);
      heatHigh = const Color(0xFF6366F1);

      progressTrack = const Color(0xFFE5E7EB);
      progressFill = const Color(0xFF6366F1);

      filterActiveBackground = const Color(0xFF6366F1);
      filterActiveText = const Color(0xFFFFFFFF);
      filterInactiveBackground = const Color(0xFFFFFFFF);
      filterInactiveText = const Color(0xFF64748B);

      calendarActiveBackground = const Color(0xFF6366F1);
      calendarInactiveBackground = const Color(0xFFFFFFFF);

      fabBackground = const Color(0xFF6366F1);
      fabIcon = const Color(0xFFFFFFFF);
      fabShadow = const Color(0x506366F1);
    }
  }

  // ThemeData دینامیک (بدون تغییر)
  static ThemeData get currentTheme {
    final isDark = background == darkBackground;
    return isDark ? _darkThemeData : _lightThemeData;
  }

  static final ThemeData _lightThemeData = ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: background,
    primaryColor: primary,
    colorScheme: ColorScheme.light(primary: primary, surface: surface, error: error),
    appBarTheme: AppBarTheme(backgroundColor: background, elevation: 0, foregroundColor: textPrimary),
    cardColor: surface,
    dividerColor: border,
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: inputBackground,
      hintStyle: TextStyle(color: textMuted),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: border)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: border)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: primary, width: 1.5)),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary,
        foregroundColor: textWhite,
        elevation: 0,
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    ),
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: fabBackground,
      foregroundColor: fabIcon,
      elevation: 8,
    ),
    textTheme: TextTheme(
      titleLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: textPrimary),
      titleMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: textPrimary),
      bodyMedium: TextStyle(fontSize: 14, color: textSecondary),
      bodySmall: TextStyle(fontSize: 12, color: textMuted),
    ),
  );

  static final ThemeData _darkThemeData = ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: background,
    primaryColor: primary,
    colorScheme: ColorScheme.dark(primary: primary, surface: surface, error: error),
    appBarTheme: AppBarTheme(backgroundColor: background, elevation: 0, foregroundColor: textPrimary),
    cardColor: surface,
    dividerColor: border,
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: inputBackground,
      hintStyle: TextStyle(color: textMuted),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: border)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: border)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide(color: primary, width: 1.5)),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary,
        foregroundColor: textWhite,
        elevation: 0,
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    ),
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: fabBackground,
      foregroundColor: fabIcon,
      elevation: 8,
    ),
    textTheme: TextTheme(
      titleLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: textPrimary),
      titleMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: textPrimary),
      bodyMedium: TextStyle(fontSize: 14, color: textSecondary),
      bodySmall: TextStyle(fontSize: 12, color: textMuted),
    ),
  );
}