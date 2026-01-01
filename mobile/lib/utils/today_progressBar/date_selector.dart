import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:intl/intl.dart';
class DateSelector extends StatelessWidget {
  final List<DateTime> weekDates;
  final DateTime selectedDate;
  final ValueChanged<DateTime> onDateSelected;

  const DateSelector({
    super.key,
    required this.weekDates,
    required this.selectedDate,
    required this.onDateSelected,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 80,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: weekDates.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final date = weekDates[index];
          final isSelected = DateUtils.isSameDay(date, selectedDate);

          return GestureDetector(
            onTap: () => onDateSelected(date),
            child: Container(
              width: 64,
              decoration: BoxDecoration(
                color: isSelected ? AppTheme.primary : AppTheme.surface,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    DateFormat.E().format(date),
                    style: TextStyle(
                      color: isSelected ? AppTheme.surface : AppTheme.textMuted,
                      fontWeight: isSelected ? FontWeight.bold : null,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${date.day}',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: isSelected ? AppTheme.textWhite : AppTheme.textPrimary,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
