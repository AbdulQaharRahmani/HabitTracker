import 'package:flutter/material.dart';
import '../../app/app_theme.dart';

class TaskItem {
  final String title;
  final String time;
  final String category;
  bool done;

  TaskItem({
    required this.title,
    required this.time,
    required this.category,
    this.done = false,
  });
  // From JSON
  factory TaskItem.fromJson(Map<String, dynamic> json) {
    return TaskItem(
      title: json['title'] as String,
      time: json['time'] as String,
      category: json['category'] as String,
      done: json['done'] as bool? ?? false,
    );
  }
  // To JSON
  Map<String, dynamic> toJson() {
    return {'title': title, 'time': time, 'category': category, 'done': done};
  }

  // copyWith
  TaskItem copyWith({
    String? title,
    String? time,
    String? category,
    bool? done,
  }) {
    return TaskItem(
      title: title ?? this.title,
      time: time ?? this.time,
      category: category ?? this.category,
      done: done ?? this.done,
    );
  }
}

class TaskCategoryConfig {
  final IconData icon;
  final Color color;

  const TaskCategoryConfig({required this.icon, required this.color});
}

const Map<String, TaskCategoryConfig> taskCategoryMap = {
  'Work': TaskCategoryConfig(icon: Icons.work_outline, color: Colors.blue),
  'Study': TaskCategoryConfig(
    icon: Icons.school_outlined,
    color: AppTheme.primary,
  ),
  'Sport': TaskCategoryConfig(
    icon: Icons.fitness_center,
    color: AppTheme.success,
  ),
  'Health': TaskCategoryConfig(
    icon: Icons.favorite_outline,
    color: AppTheme.error,
  ),
  'Personal': TaskCategoryConfig(
    icon: Icons.person_outline,
    color: AppTheme.warning,
  ),
  'Other': TaskCategoryConfig(icon: Icons.task_alt, color: AppTheme.textMuted),
};
