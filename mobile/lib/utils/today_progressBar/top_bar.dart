import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../app/app_theme.dart';

class TopBar extends StatelessWidget {
  final VoidCallback onPickDate;
  final DateTime selectedDate;

  const TopBar({
    super.key,
    required this.onPickDate,
    required this.selectedDate,
  });

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final isToday = DateUtils.isSameDay(now, selectedDate);

    final subtitle = isToday
        ? 'Today, ${DateFormat.yMMMMd().format(selectedDate)}'
        : DateFormat('MMMM d, EEEE').format(selectedDate);

    return Row(
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Today's Progress",
              style: const TextStyle(
                color: AppTheme.textPrimary,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: const TextStyle(
                color: AppTheme.textMuted,
                fontSize: 12,
              ),
            ),
          ],
        ),
        const Spacer(),
        _iconButton(Icons.tune),
        const SizedBox(width: 8),
        _iconButton(Icons.calendar_today, onTap: onPickDate),
      ],
    );
  }

  Widget _iconButton(IconData icon, {VoidCallback? onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: CircleAvatar(
        backgroundColor: AppTheme.background,
        child: Icon(icon, color: AppTheme.pendingIcon),
      ),
    );
  }
}