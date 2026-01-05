import 'package:flutter/material.dart';
import 'package:habit_tracker/utils/today_progressBar/task.dart';
import 'package:habit_tracker/utils/today_progressBar/task_item.dart';

import 'daily_grid.dart';
Widget dailySectionsList({
  required Map<String, List<TaskItem>> sections,
  required ValueChanged<TaskItem> onToggle,
}) {
  int completed = 0;
  int total = 0;

  sections.forEach((_, tasks) {
    total += tasks.length;
    completed += tasks.where((t) => t.done).length;
  });

  return Column(
    children: [
      dailyGoalCard(
        completed: completed,
        total: total,
        progress: total == 0 ? 0 : completed / total,
        streakDays: 5,
      ),
      const SizedBox(height: 16),
      ...sections.entries.map((entry) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              entry.key,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            ...entry.value.map((task) {
              return TaskCard(
                item: task,
                onToggleDone: (done) {
                  task.done = done;
                  onToggle(task);
                },
              );
            }),
            const SizedBox(height: 16),
          ],
        );
      }),
    ],
  );
}
