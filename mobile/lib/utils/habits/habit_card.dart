import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../app/app_theme.dart';
import 'habit.dart';

class HabitCard extends StatelessWidget {
  const HabitCard({
    super.key,
    required this.habit,
    required this.onEdit,
    required this.onDelete,
    this.clock,
  });

  final Habit habit;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final ValueListenable<DateTime>? clock;

  @override
  Widget build(BuildContext context) {
    final categoryColor = habit.category.backgroundColor;

    return DecoratedBox(
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(14.r),
        border: Border.all(color: AppTheme.border),
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadow.withValues(alpha: 0.07),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 12.h),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 42.w,
              height: 42.w,
              decoration: BoxDecoration(
                color: categoryColor.withValues(alpha: 0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(
                habit.category.icon,
                color: categoryColor,
                size: 20.sp,
              ),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    habit.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 14.sp,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  SizedBox(height: 4.h),
                  Text(
                    habit.description,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 11.sp,
                      color: AppTheme.textSecondary,
                    ),
                  ),
                  SizedBox(height: 8.h),
                  _TagRow(habit: habit),
                  SizedBox(height: 8.h),
                  _ReminderInfo(habit: habit, clock: clock),
                ],
              ),
            ),
            SizedBox(width: 8.w),
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _ActionButton(
                  icon: Icons.edit_outlined,
                  color: AppTheme.textSecondary,
                  onTap: onEdit,
                ),
                SizedBox(height: 6.h),
                _ActionButton(
                  icon: Icons.delete_outline,
                  color: AppTheme.error,
                  onTap: onDelete,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _TagRow extends StatelessWidget {
  const _TagRow({required this.habit});

  final Habit habit;

  @override
  Widget build(BuildContext context) {
    final categoryColor = habit.category.backgroundColor;

    return Wrap(
      spacing: 8.w,
      runSpacing: 4.h,
      children: [
        _Pill(
          text: habit.category.name.toUpperCase(),
          textColor: categoryColor,
          backgroundColor: categoryColor.withValues(alpha: 0.14),
        ),
        _Pill(
          text: habit.formatFrequency(),
          textColor: AppTheme.textSecondary,
          backgroundColor: AppTheme.inputBackground,
        ),
        if (habit.currentStreak > 0)
          _Pill(
            text: '${habit.currentStreak} day streak',
            textColor: AppTheme.warning,
            backgroundColor: AppTheme.warning.withValues(alpha: 0.12),
            icon: Icons.local_fire_department,
          ),
      ],
    );
  }
}

class _ReminderInfo extends StatelessWidget {
  const _ReminderInfo({required this.habit, required this.clock});

  final Habit habit;
  final ValueListenable<DateTime>? clock;

  @override
  Widget build(BuildContext context) {
    if (!habit.reminderEnabled || habit.reminderTimeOfDay == null) {
      return const SizedBox.shrink();
    }

    if (clock == null) {
      return _buildContent(context, DateTime.now());
    }

    return ValueListenableBuilder<DateTime>(
      valueListenable: clock!,
      builder: (context, now, _) => _buildContent(context, now),
    );
  }

  Widget _buildContent(BuildContext context, DateTime now) {
    final reminderTime = habit.reminderTimeOfDay!;
    final nextReminder = habit.nextReminderDateTime(now: now);

    if (nextReminder == null) {
      return const SizedBox.shrink();
    }

    final localizations = MaterialLocalizations.of(context);
    final formattedTime = localizations.formatTimeOfDay(
      reminderTime,
      alwaysUse24HourFormat: false,
    );

    final timeLeft = nextReminder.difference(now);
    final showCountdown = timeLeft.inSeconds > 0 && timeLeft.inMinutes < 30;

    return Row(
      children: [
        Icon(Icons.alarm_rounded, size: 14.sp, color: AppTheme.primary),
        SizedBox(width: 4.w),
        Text(
          formattedTime,
          style: TextStyle(
            fontSize: 11.sp,
            fontWeight: FontWeight.w600,
            color: AppTheme.textSecondary,
          ),
        ),
        if (showCountdown) ...[
          SizedBox(width: 8.w),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 3.h),
            decoration: BoxDecoration(
              color: AppTheme.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(999.r),
            ),
            child: Text(
              _formatCountdown(timeLeft),
              style: TextStyle(
                color: AppTheme.primary,
                fontSize: 10.sp,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ],
    );
  }

  String _formatCountdown(Duration value) {
    final hours = value.inHours;
    final minutes = value.inMinutes.remainder(60);
    final seconds = value.inSeconds.remainder(60);

    if (hours > 0) {
      return 'in ${hours}h ${minutes}m';
    }
    return 'in ${minutes}m ${seconds}s';
  }
}

class _Pill extends StatelessWidget {
  const _Pill({
    required this.text,
    required this.textColor,
    required this.backgroundColor,
    this.icon,
  });

  final String text;
  final Color textColor;
  final Color backgroundColor;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 4.h),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(999.r),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 11.sp, color: textColor),
            SizedBox(width: 4.w),
          ],
          Text(
            text,
            style: TextStyle(
              fontSize: 10.sp,
              fontWeight: FontWeight.w600,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  const _ActionButton({
    required this.icon,
    required this.color,
    required this.onTap,
  });

  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8.r),
      child: Container(
        width: 30.w,
        height: 30.w,
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.09),
          borderRadius: BorderRadius.circular(8.r),
        ),
        child: Icon(icon, size: 16.sp, color: color),
      ),
    );
  }
}
