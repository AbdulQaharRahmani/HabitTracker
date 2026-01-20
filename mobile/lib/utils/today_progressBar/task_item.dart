import 'package:flutter/material.dart';
import '../../app/app_theme.dart';

/// ---------------- Task Category Configuration ----------------
class TaskCategoryConfig {
  final String name;
  final IconData icon;
  final Color color;

  const TaskCategoryConfig({
    required this.name,
    required this.icon,
    required this.color,
  });
}

/// Map categoryId -> TaskCategoryConfig
const Map<String, TaskCategoryConfig> taskCategoryMapById = {
  '696e1bb23a4cf5a7398b8405': TaskCategoryConfig(
    name: 'Study',
    icon: Icons.school_outlined,
    color: AppTheme.primary,
  ),
  '696e1bb23a4cf5a7398b8406': TaskCategoryConfig(
    name: 'Sport',
    icon: Icons.fitness_center,
    color: AppTheme.success,
  ),
  '696e1bb23a4cf5a7398b8407': TaskCategoryConfig(
    name: 'Personal',
    icon: Icons.task_alt,
    color: AppTheme.warning,
  ),
  '696e1bb23a4cf5a7398b8408': TaskCategoryConfig(
    name: 'Work',
    icon: Icons.work_outline,
    color: AppTheme.primary,
  ),
};

/// ---------------- Task / Habit Model ----------------
class TaskItem {
  final String id;
  final String title;
  final String description;
  final String frequency;
  final String category;
  final IconData icon;
  final Color color;
  final String sourceType;
  bool done;
  final DateTime createdAt;

  TaskItem({
    required this.id,
    required this.title,
    required this.description,
    required this.frequency,
    required this.category,
    required this.icon,
    required this.color,
    required this.sourceType,
    required this.createdAt,
    this.done = false,
  });

  // ---------------- FACTORIES ----------------

  /// Creates TaskItem from API task JSON
  factory TaskItem.fromApiJson(Map<String, dynamic> json) {
    final categoryId = json['categoryId']?.toString() ?? '';
    final config = taskCategoryMapById[categoryId] ??
        const TaskCategoryConfig(
          name: 'Other',
          icon: Icons.task_alt,
          color: AppTheme.primary,
        );

    return TaskItem(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      frequency: 'daily',
      category: config.name,
      icon: config.icon,
      color: config.color,
      sourceType: 'task',
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      done: json['status'] == 'done',
    );
  }

  /// Creates TaskItem from API habit JSON
  factory TaskItem.fromHabitApiJson(Map<String, dynamic> json) {
    final categoryJson = json['categoryId'] ?? {};
    final categoryName = (categoryJson['name'] ?? 'Other').toString();
    final icon = TaskItem.mapIcon(categoryJson['icon']?.toString());
    final color = TaskItem.hexToColor(categoryJson['backgroundColor']?.toString());

    return TaskItem(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      frequency: json['frequency'] ?? 'daily',
      category: categoryName,
      icon: icon,
      color: color,
      sourceType: 'habit',
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      done: false,
    );
  }

  // ---------------- STATIC HELPERS ----------------

  /// Convert hex string to Color safely
  static Color hexToColor(String? hex) {
    if (hex == null || hex.isEmpty) return AppTheme.primary;

    final cleanedHex = hex.replaceAll('#', '');
    if (cleanedHex.length != 6) return AppTheme.primary;

    return Color(int.parse('FF$cleanedHex', radix: 16));
  }

  /// Map simple string to icon
  static IconData mapIcon(String? name) {
    switch (name?.toLowerCase()) {
      case 'study':
        return Icons.school;
      case 'health':
        return Icons.favorite;
      case 'sport':
        return Icons.sports_soccer;
      case 'work':
        return Icons.work;
      default:
        return Icons.task;
    }
  }

  // ---------------- LOGIC ----------------

  /// Determines if task/habit applies to the given date
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
}
