import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';

class SettingSection extends StatelessWidget {
  final String title;

  const SettingSection({
    super.key,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          fontSize: 13,
          letterSpacing: 1,
          fontWeight: FontWeight.bold,
          color: AppTheme.textPrimary,
        ),
      ),
    );
  }
}