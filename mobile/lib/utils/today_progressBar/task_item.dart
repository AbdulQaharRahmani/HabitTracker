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

/// By category name (fallback-safe)
final Map<String, TaskCategoryUI> taskCategoryMapByName = {
  'study': const TaskCategoryUI(
    icon: Icons.school_outlined,
    color: AppTheme.primary,
  ),
  'sport': const TaskCategoryUI(
    icon: Icons.fitness_center,
    color: AppTheme.success,
  ),
  'work': const TaskCategoryUI(
    icon: Icons.work_outline,
    color: AppTheme.warning,
  ),
  'health': const TaskCategoryUI(
    icon: Icons.favorite_outline,
    color: AppTheme.error,
  ),
  'personal': TaskCategoryUI(
    icon: Icons.task_alt,
    color: AppTheme.primary,
  ),
};

/// Default fallback
const TaskCategoryUI defaultCategoryUI = TaskCategoryUI(
  icon: Icons.task_alt,
  color: AppTheme.primary,
);

/// ---------------- Task / Habit Unified UI Model ----------------
class TaskItem {
  /// Common
  final String id;
  final String title;
  final String description;
  final String? frequency;
  final String category;
  final IconData icon;
  final Color color;
  final String sourceType; // 'task' | 'habit'
  final DateTime createdAt;

  /// UI State
  bool done;

  TaskItem({
    required this.id,
    required this.title,
    required this.description,
     this.frequency,
    required this.category,
    required this.icon,
    required this.color,
    required this.sourceType,
    required this.createdAt,
    this.done = false,
  });

  // ---------------------------------------------------------------------------
  // FACTORY
  // ---------------------------------------------------------------------------

  factory TaskItem.fromApiJson(Map<String, dynamic> json, DateTime forDate) {
    final categoryName =
    (json['category']?['name'] ?? 'task').toString().toLowerCase();

    final ui =
        taskCategoryMapByName[categoryName] ?? defaultCategoryUI;

    return TaskItem(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      frequency: json['frequency'] ?? 'daily',
      category: categoryName,
      icon: ui.icon,
      color: ui.color,
      sourceType: 'task',
      createdAt:
      DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      done: json['status'] == 'done',
    );
  }
// In task.dart (your TaskItem file)
  factory TaskItem.fromHabitJson(Map<String, dynamic> json, DateTime forDate) {
    final categoryName = (json['category']?['name'] ?? 'habit').toString().toLowerCase();

    // Assume API has 'completedDates' array or 'isCompleted' for the date
    bool isDone = false;
    if (json['completedDates'] != null) {
      // Check if forDate is in completedDates (array of ISO strings or timestamps)
      isDone = (json['completedDates'] as List).any((d) {
        final completedDate = DateTime.tryParse(d) ?? DateTime(1970);
        return DateUtils.isSameDay(completedDate, forDate);
      });
    } else if (json['isCompleted'] != null) {
      isDone = json['isCompleted'] == true;  // Or json['status'] == 'completed'
    } // Adjust this based on your API docs/response

    return TaskItem(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      frequency: json['frequency'] ?? 'daily',
      category: categoryName,
      icon: TaskItem.resolveIcon(apiIconName: json['icon'], categoryName: categoryName),
      color: TaskItem.resolveColor(apiHexColor: json['color'], categoryName: categoryName),
      sourceType: 'habit',
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      done: isDone,  // Key fix: Set based on API data for the date
    );
  }
  // ---------------------------------------------------------------------------
  // LOGIC
  // ---------------------------------------------------------------------------

  bool appliesToDate(DateTime date) {
    final start = DateTime(createdAt.year, createdAt.month, createdAt.day);
    final target = DateTime(date.year, date.month, date.day);
    final diffDays = target.difference(start).inDays;

    switch (frequency) {
      case 'daily':
        return diffDays >= 0;
      case 'weekly':
        return diffDays >= 0 && diffDays % 7 == 0;
      case 'biweekly':
        return diffDays >= 0 && diffDays % 14 == 0;
      case 'every-other-day':
        return diffDays >= 0 && diffDays % 2 == 0;
      default:
        return false;
    }
  }

  void toggle() {
    done = !done;
  }

  // ---------------------------------------------------------------------------
  // STATIC HELPERS (Used by HabitMapper)
  // ---------------------------------------------------------------------------

  static IconData resolveIcon({
    String? apiIconName,
    String? categoryName,
  }) {
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
    return taskCategoryMapByName[key]?.icon ??
        defaultCategoryUI.icon;
  }

  static Color resolveColor({
    String? apiHexColor,
    String? categoryName,
  }) {
    if (apiHexColor != null && apiHexColor.startsWith('#')) {
      final hex = apiHexColor.replaceAll('#', '');
      if (hex.length == 6) {
        return Color(int.parse('FF$hex', radix: 16));
      }
    }

    final key = categoryName?.toLowerCase();
    return taskCategoryMapByName[key]?.color ??
        defaultCategoryUI.color;
  }
}
