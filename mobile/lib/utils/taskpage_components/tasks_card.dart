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

    return Card(
      margin: const EdgeInsets.fromLTRB(21, 0, 21, 10),
      elevation: 0,
      color: done ? AppTheme.textMuted.withOpacity(0.2) : AppTheme.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ===== Category Icon =====
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: category?.backgroundColor ?? AppTheme.primary,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                category?.icon ?? Icons.task_alt_sharp,
                color: AppTheme.textWhite,
                size: 22,
              ),
            ),
            const SizedBox(width: 12),

            // ===== Task Content =====
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    task.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: done ? AppTheme.textMuted : AppTheme.textPrimary,
                      decoration: done ? TextDecoration.lineThrough : null,
                    ),
                  ),
                  const SizedBox(height: 4),
                  if (task.description != null && task.description!.isNotEmpty)
                    Text(
                      task.description!,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 13,
                        color: done ? AppTheme.textMuted : AppTheme.textSecondary,
                        decoration: done ? TextDecoration.lineThrough : null,
                      ),
                    ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: task.category?.backgroundColor.withOpacity(0.5) ?? AppTheme.primary.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      ' ${task.priority.toUpperCase()}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),

                  // ===== Due Date =====
                  if (task.dueDate != null)
                    Row(
                      children: [
                        Icon(Icons.access_time, size: 18, color: AppTheme.textMuted),
                        const SizedBox(width: 4),
                        Text(
                          _formatDueDate(task.dueDate!),
                          style: TextStyle(
                            fontSize: 13,
                            color: _dueDateColor(task.dueDate!),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                ],
              ),
            ),

            // ===== Actions =====
            Column(
              children: [
                IconButton(
                  icon: Icon(
                    done ? Icons.check_circle : Icons.radio_button_unchecked,
                    color: done ? AppTheme.success : AppTheme.textMuted,
                  ),
                  onPressed: onStatusChanged != null ? () => onStatusChanged!(task) : null,
                ),
                if (onEdit != null)
                  IconButton(
                    icon: Icon(Icons.edit, color: AppTheme.textSecondary),
                    onPressed: () => onEdit!(task),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
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