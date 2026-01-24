import 'package:flutter/material.dart';
import 'tasks_model.dart';

class TasksCard extends StatelessWidget {
  final List<Task> tasks;
  final Function(Task)? onEdit;
  final Function(Task)? onStatusChanged;

  const TasksCard({
    super.key,
    required this.tasks,
    this.onEdit,
    this.onStatusChanged,
  });

  @override
  Widget build(BuildContext context) {
    if (tasks.isEmpty) return const Center(child: Text('No tasks available'));

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: tasks.length,
      itemBuilder: (context, index) {
        final task = tasks[index];
        final done = task.isDone;
        final category = task.category;

        return Card(
          margin: const EdgeInsets.fromLTRB(21, 0, 21, 10),
          elevation: 0,
          color: done ? Colors.grey.shade200 : Colors.white,
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
                    color: category?.backgroundColor ?? Colors.blue,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(category?.icon ?? Icons.task_alt_sharp, color: Colors.white, size: 22),
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
                          color: done ? Colors.grey : Colors.black,
                          decoration: done ? TextDecoration.lineThrough : null,
                        ),
                      ),
                      const SizedBox(height: 4),
                      if (task.description.isNotEmpty)
                        Text(
                          task.description,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 13,
                            color: done ? Colors.grey : Colors.black54,
                            decoration: done ? TextDecoration.lineThrough : null,
                          ),
                        ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: _priorityColor(task.priority).withOpacity(0.6),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'Priority: ${task.priority.toUpperCase()}',
                          style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ),

                // ===== Actions =====
                Column(
                  children: [
                    IconButton(
                      icon: Icon(done ? Icons.check_circle : Icons.radio_button_unchecked,
                          color: done ? Colors.green : Colors.grey),
                      onPressed: onStatusChanged != null ? () => onStatusChanged!(task) : null,
                    ),
                    if (onEdit != null)
                      IconButton(
                        icon: const Icon(Icons.edit, color: Colors.black54),
                        onPressed: () => onEdit!(task),
                      ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Color _priorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'low':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }
}
