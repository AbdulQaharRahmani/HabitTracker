import 'package:flutter/material.dart';
import 'package:habit_tracker/utils/today_progressBar/task_item.dart';
import '../../app/app_theme.dart';

class TaskCard extends StatelessWidget {
  final TaskItem item;
  final ValueChanged<bool> onToggleDone;

  const TaskCard({
    super.key,
    required this.item,
    required this.onToggleDone,
  });

  @override
  Widget build(BuildContext context) {
    final categoryConfig =
        taskCategoryMap[item.category] ?? taskCategoryMap['Other']!;

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 6),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: AppTheme.textWhite,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // ===== Task Icon =====
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: categoryConfig.color.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(
              categoryConfig.icon,
              color: categoryConfig.color,
              size: 22,
            ),
          ),

          const SizedBox(width: 12),

          // ===== Task Info =====
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.title,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                    color: item.done
                        ? AppTheme.textMuted
                        : AppTheme.textPrimary,
                    decoration: item.done
                        ? TextDecoration.lineThrough
                        : TextDecoration.none,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Icon(Icons.access_time,
                        size: 14, color: AppTheme.textMuted),
                    const SizedBox(width: 4),
                    Text(
                      item.time,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.textMuted,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.surface,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        item.category,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppTheme.textMuted,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(width: 10),

          // ===== Done Checkbox =====
          GestureDetector(
            onTap: () => onToggleDone(!item.done),
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color:
                item.done ? AppTheme.primary : AppTheme.background,
                shape: BoxShape.circle,
              ),
              child: Icon(
                item.done
                    ? Icons.check
                    : Icons.radio_button_unchecked,
                color:
                item.done ? Colors.white : AppTheme.textMuted,
                size: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
