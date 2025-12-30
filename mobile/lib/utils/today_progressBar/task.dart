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
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 6),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Checkbox circle
          GestureDetector(
            onTap: () => onToggleDone(!item.done),
            child: Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: item.done ? AppTheme.primary : AppTheme.background,
                shape: BoxShape.circle,
              ),
              child: item.done
                  ? const Icon(Icons.check, color: Colors.white, size: 20)
                  : const Icon(Icons.radio_button_unchecked,
                  color: AppTheme.textMuted, size: 20),
            ),
          ),
          const SizedBox(width: 12),

          // Task info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.title,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: item.done ? AppTheme.textMuted : AppTheme.textPrimary,
                    decoration:
                    item.done ? TextDecoration.lineThrough : TextDecoration.none,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Text(
                      item.time,
                      style: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppTheme.surface,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        item.category,
                        style: const TextStyle(fontSize: 11, color: AppTheme.textMuted),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Optional trailing action (e.g., more)
          IconButton(
            onPressed: () {
              //  open task details / edit
            },
            icon: const Icon(Icons.more_vert),
          ),
        ],
      ),
    );
  }
}