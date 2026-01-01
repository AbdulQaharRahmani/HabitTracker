import 'package:flutter/material.dart';
import '../../app/app_theme.dart';

Widget streakBadgeWithValue(int streakDays) {
  return Container(
    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
    decoration: BoxDecoration(
      color: AppTheme.streakBadge,
      borderRadius: BorderRadius.circular(20),
    ),
    child: Row(
      children: [
        Icon(Icons.local_fire_department, size: 16, color: AppTheme.warning),
        const SizedBox(width: 6),
        Text(
          '$streakDays Days\nStreak',
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 12,
            color: AppTheme.warning,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    ),
  );
}
