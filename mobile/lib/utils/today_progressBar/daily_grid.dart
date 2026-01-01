import 'package:flutter/material.dart';
import 'package:habit_tracker/utils/today_progressBar/status_bar.dart';
import 'package:habit_tracker/utils/today_progressBar/streak_badge.dart';

import '../../app/app_theme.dart';
Widget dailyGoalCard({
  //  replace these with a model loaded from backend
  required int completed,
  required int total,
  required double progress,
  required int streakDays,
}) {
  final percentText = '${(progress * 100).round()}%';

  return Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(20),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.05),
          blurRadius: 12,
          offset: const Offset(0, 6),
        ),
      ],
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        /// Top Row
        Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Daily Goal',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '$completed of $total habits completed',
                  style: const TextStyle(color: AppTheme.textMuted),
                ),
              ],
            ),
            const Spacer(),
            //  streakDays should come from backend
            streakBadgeWithValue(streakDays),
          ],
        ),

        const SizedBox(height: 16),

        // Progress Row
        Row(
          children: [
            const Text(
              'PROGRESS',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: AppTheme.textMuted,
              ),
            ),
            const Spacer(),
            Text(
              percentText,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: AppTheme.primary,
              ),
            ),
          ],
        ),

        const SizedBox(height: 8),

        /// Progress Bar
        ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 10,
            backgroundColor: AppTheme.background,
            valueColor: const AlwaysStoppedAnimation(AppTheme.primary),
          ),
        ),

        const SizedBox(height: 16),

        /// Bottom Stats
        Row(
          children: [
            Expanded(
              child: StatusCard(
                color: AppTheme.success,
                count: '$completed',
                title: 'Done',
                subtitle: 'Keep it up!',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: StatusCard(
                color: AppTheme.warning,
                count: '${total - completed}',
                title: 'Pending',
                subtitle: 'Almost there',
              ),
            ),
          ],
        ),
      ],
    ),
  );
}
