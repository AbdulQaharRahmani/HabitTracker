import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';

class SettingIcon extends StatelessWidget {
  final IconData icon;
  final Color color;

  const SettingIcon({
    super.key,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Icon(icon, color: AppTheme.surface),
    );
  }
}