import 'package:flutter/material.dart';
import '../../app/app_theme.dart';

/// ---------------- Category UI Config ----------------
class TaskCategoryUI {
  final IconData icon;
  final Color color;

  const TaskCategoryUI({
    required this.icon,
    required this.color,
  });
}

/// ---------------- Category Maps ----------------
final Map<String, TaskCategoryUI> taskCategoryMapByName = {
  'study': const TaskCategoryUI(icon: Icons.school_outlined, color: AppTheme.primary),
  'sport': const TaskCategoryUI(icon: Icons.fitness_center, color: AppTheme.success),
  'work': const TaskCategoryUI(icon: Icons.work_outline, color: AppTheme.warning),
  'health': const TaskCategoryUI(icon: Icons.favorite_outline, color: AppTheme.error),
  'personal': const TaskCategoryUI(icon: Icons.task_alt, color: AppTheme.primary),
};

/// Default fallback
const TaskCategoryUI defaultCategoryUI = TaskCategoryUI(
  icon: Icons.task_alt,
  color: AppTheme.primary,
);

/// ---------------- Task / Habit Unified UI Model ----------------
class TaskItem {
  final String id;
  final String title;
  final String description;
  final String category;
  final IconData icon;
  final Color color;
  final String sourceType; // 'task' | 'habit'
  final DateTime createdAt;
  bool done;
  final String? frequency; // Optional: daily, every-other-day etc.
  final DateTime? dueDate;

  TaskItem({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.icon,
    required this.color,
    required this.sourceType,
    required this.createdAt,
    this.done = false,
    this.frequency,
    this.dueDate,
  });

  /// ----------------- FACTORY: Task from API -----------------
  factory TaskItem.fromApiJson(Map<String, dynamic> json, DateTime forDate) {
    final categoryJson = json['category'] ?? json['categoryId'] ?? {};
    final categoryName = (categoryJson['name'] ?? 'task').toString().toLowerCase();
    final ui = taskCategoryMapByName[categoryName] ?? defaultCategoryUI;
    bool isDone = false;

    if (json['completed'] == true || json['isCompleted'] == true || json['done'] == true || json['completedToday'] == true) {
      isDone = true;
    } else if (json['completedDates'] is List) {
      isDone = (json['completedDates'] as List).any((d) {
        final dt = DateTime.tryParse(d.toString());
        return dt != null && DateUtils.isSameDay(dt, forDate);
      });
    } else if (json['completion'] is List) {
      isDone = (json['completion'] as List).any((c) {
        final dt = DateTime.tryParse(c['date'] ?? '');
        return dt != null && DateUtils.isSameDay(dt, forDate) && (c['done'] == true || c['completed'] == true);
      });
    } else {
      // fallback: if status == done or completed
      isDone = json['status'] == 'done' || json['status'] == 'completed';
    }
    final taskDue = json['dueDate'] != null
        ? DateTime.tryParse(json['dueDate'])
        : null;

    return TaskItem(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: categoryName,
      icon: TaskItem.resolveIcon(apiIconName: categoryJson['icon']?.toString(), categoryName: categoryName),
      color: TaskItem.resolveColor(apiHexColor: categoryJson['backgroundColor']?.toString(), categoryName: categoryName),
      sourceType: 'task',
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      done: isDone,
      dueDate: taskDue,
      frequency: null,
    );
  }

  /// ----------------- FACTORY: Habit from API -----------------
  factory TaskItem.fromHabitJson(Map<String, dynamic> json, DateTime forDate) {
    final categoryJson = json['category'] ?? json['categoryId'] ?? {};
    final categoryName = (categoryJson['name'] ?? 'habit').toString().toLowerCase();
    final ui = taskCategoryMapByName[categoryName] ?? defaultCategoryUI;

    // ✅ Check if habit is done for this date
    bool isDone = false;

    if (json['completed'] == true || json['isCompleted'] == true || json['done'] == true || json['completedToday'] == true) {
      isDone = true;
    } else if (json['completedDates'] is List) {
      isDone = (json['completedDates'] as List).any((d) {
        final dt = DateTime.tryParse(d.toString());
        return dt != null && DateUtils.isSameDay(dt, forDate);
      });
    } else if (json['completion'] is List) {
      isDone = (json['completion'] as List).any((c) {
        final dt = DateTime.tryParse(c['date'] ?? '');
        return dt != null && DateUtils.isSameDay(dt, forDate) && (c['done'] == true || c['completed'] == true);
      });
    } else {
      // fallback: if status == done or completed
      isDone = json['status'] == 'done' || json['status'] == 'completed';
    }

    return TaskItem(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: categoryName,
      icon: TaskItem.resolveIcon(apiIconName: categoryJson['icon']?.toString(), categoryName: categoryName),
      color: TaskItem.resolveColor(apiHexColor: categoryJson['backgroundColor']?.toString(), categoryName: categoryName),
      sourceType: 'habit',
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      done: isDone,
      frequency: json['frequency']?.toString(),
      dueDate: null,
    );
  }

  /// ----------------- Helper: Applies to a given date -----------------
  bool appliesToDate(DateTime date) {
    final target = DateTime(date.year, date.month, date.day);
    final start = DateTime(createdAt.year, createdAt.month, createdAt.day);

    // If dueDate exists, check
    if (dueDate != null) {
      final due = DateTime(dueDate!.year, dueDate!.month, dueDate!.day);
      if (target.isAfter(due)) return false;
    }

    // Frequency rules for habits
    if (frequency != null) {
      final diff = target.difference(start).inDays;
      switch (frequency) {
        case 'daily':
          return diff >= 0;
        case 'every-other-day':
          return diff >= 0 && diff % 2 == 0;
        case 'weekly':
          return diff >= 0 && diff % 7 == 0;
        case 'biweekly':
          return diff >= 0 && diff % 14 == 0;
        default:
          return true;
      }
    }

    // Default: always apply
    return true;
  }

  void toggle() => done = !done;

  /// ----------------- STATIC HELPERS -----------------
  static IconData resolveIcon({String? apiIconName, String? categoryName}) {
    if (apiIconName != null && apiIconName.isNotEmpty) {
      switch (apiIconName.toLowerCase()) {
        case 'study':
          return Icons.school;
        case 'sport':
          return Icons.fitness_center;
        case 'work':
          return Icons.work;
        case 'health':
          return Icons.favorite;
      }
    }
    final key = categoryName?.toLowerCase();
    return taskCategoryMapByName[key]?.icon ?? defaultCategoryUI.icon;
  }

  static Color resolveColor({String? apiHexColor, String? categoryName}) {
    if (apiHexColor != null && apiHexColor.startsWith('#')) {
      final hex = apiHexColor.replaceAll('#', '');
      if (hex.length == 6) return Color(int.parse('FF$hex', radix: 16));
    }
    final key = categoryName?.toLowerCase();
    return taskCategoryMapByName[key]?.color ?? defaultCategoryUI.color;
  }
}
