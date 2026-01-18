import 'package:flutter/material.dart';
import 'tasks_model.dart'; // مدل Task شامل: title, description, status, priority, categoryName, categoryColor, icon

class TasksCard extends StatelessWidget {
  final List<Task> tasks;
  final Function(Task)? onEdit;
  final Function(Task)? onToggleDone;

  const TasksCard({
    super.key,
    required this.tasks,
    this.onEdit,
    this.onToggleDone,
  });

  @override
  Widget build(BuildContext context) {
    if (tasks.isEmpty) {
      return const Center(
        child: Text('No tasks available'),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: tasks.length,
      itemBuilder: (context, index) {
        final task = tasks[index];
        final isDone = task.status == 'done';

        return Card(
          color: isDone ? Colors.grey.shade200 : Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(25),
          ),
          margin: const EdgeInsets.fromLTRB(16, 8, 16, 8),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                // ====== Icon Container ======
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: task.iconColor ?? Colors.blue,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(task.icon ?? Icons.task_alt,
                      color: Colors.white, size: 24),
                ),

                const SizedBox(width: 12),

                // ====== Title + Category ======
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        task.title,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: isDone ? Colors.grey : Colors.black,
                        ),
                      ),
                      const SizedBox(height: 4),
                      // Category Badge
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: task.categoryColor ?? Colors.blue.shade100,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          task.categoryName ?? 'General',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // ====== Edit & Done Buttons ======
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.edit, color: Colors.black54),
                      onPressed: () {
                        if (onEdit != null) onEdit!(task);
                      },
                    ),
                    IconButton(
                      icon: Icon(
                        isDone ? Icons.check_circle : Icons.radio_button_unchecked,
                        color: isDone ? Colors.green : Colors.grey,
                      ),
                      onPressed: () {
                        if (onToggleDone != null) onToggleDone!(task);
                      },
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
}
