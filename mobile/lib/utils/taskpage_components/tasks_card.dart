import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../app/app_theme.dart';
import '../../providers/theme_provider.dart';
import 'tasks_model.dart';

class TasksScreenCard extends StatelessWidget {
  final Task task;
  final Function(Task)? onEdit;
  final Function(Task)? onStatusChanged;

  const TasksScreenCard({
    super.key,
    required this.task,
    this.onEdit,
    this.onStatusChanged,
  });

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);

    final done = task.isDone;
    final category = task.category;
    final categoryColor = category?.backgroundColor ?? AppTheme.primary;

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: done ? AppTheme.success.withValues(alpha: 0.06) : AppTheme.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: done ? AppTheme.success.withValues(alpha: 0.35) : AppTheme.border,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: categoryColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              category?.icon ?? Icons.task_alt_sharp,
              color: categoryColor,
              size: 20,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  task.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: done ? AppTheme.textSecondary : AppTheme.textPrimary,
                    decoration: done ? TextDecoration.lineThrough : null,
                  ),
                ),
                if (task.description != null && task.description!.isNotEmpty) ...[
                  const SizedBox(height: 4),
                  Text(
                    task.description!,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      color: done ? AppTheme.textMuted : AppTheme.textSecondary,
                      decoration: done ? TextDecoration.lineThrough : null,
                    ),
                  ),
                ],
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  children: [
                    _Tag(
                      text: task.priority.toUpperCase(),
                      color: _priorityColor(task.priority),
                      bg: _priorityColor(task.priority).withValues(alpha: 0.12),
                    ),
                    _Tag(
                      text: (category?.name ?? 'Task').toUpperCase(),
                      color: categoryColor,
                      bg: categoryColor.withValues(alpha: 0.12),
                    ),
                  ],
                ),
                if (task.dueDate != null) ...[
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.access_time, size: 14, color: AppTheme.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        _formatDueDate(task.dueDate!),
                        style: TextStyle(
                          fontSize: 11,
                          color: _dueDateColor(task.dueDate!),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(width: 8),
          Column(
            children: [
              InkWell(
                onTap: onStatusChanged != null ? () => onStatusChanged!(task) : null,
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  width: 30,
                  height: 30,
                  decoration: BoxDecoration(
                    color: done ? AppTheme.success : Colors.transparent,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: done ? AppTheme.success : AppTheme.textMuted,
                      width: 1.5,
                    ),
                  ),
                  child: Icon(
                    done ? Icons.check : Icons.circle_outlined,
                    color: done ? AppTheme.textWhite : AppTheme.textMuted,
                    size: done ? 16 : 14,
                  ),
                ),
              ),
              if (onEdit != null) ...[
                const SizedBox(height: 6),
                InkWell(
                  onTap: () => onEdit!(task),
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    width: 30,
                    height: 30,
                    decoration: BoxDecoration(
                      color: AppTheme.textSecondary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(Icons.edit_outlined, size: 16, color: AppTheme.textSecondary),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Color _priorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return AppTheme.error;
      case 'low':
        return AppTheme.success;
      default:
        return AppTheme.warning;
    }
  }

  String _formatDueDate(DateTime dueDate) {
    return '${dueDate.year.toString().padLeft(2, '0')} '
        '${_monthName(dueDate.month)} ${dueDate.day}, '
        '${dueDate.hour.toString().padLeft(2, '0')}:${dueDate.minute.toString().padLeft(2, '0')}';
  }

  String _monthName(int month) {
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return names[month - 1];
  }

  Color _dueDateColor(DateTime dueDate) {
    final now = DateTime.now();
    if (dueDate.isBefore(now)) return AppTheme.textMuted;
    if (dueDate.difference(now).inHours <= 24) return AppTheme.warning;
    return AppTheme.textSecondary;
  }
}

class _Tag extends StatelessWidget {
  final String text;
  final Color color;
  final Color bg;

  const _Tag({
    required this.text,
    required this.color,
    required this.bg,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
