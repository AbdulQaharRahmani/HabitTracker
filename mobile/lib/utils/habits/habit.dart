import 'package:flutter/material.dart';
class CategoryModel {
  final String id;
  final String name;

  CategoryModel({required this.id, required this.name});

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
    );
  }
}
// فایل: habit.dart
class Habit {
  final String id;
  final String title;
  final String description;
  final CategoryModel category;
  final String frequency;
  final int order;
  final DateTime createdAt;

  Habit({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.frequency,
    required this.order,
    required this.createdAt,
  });

  factory Habit.fromJson(Map<String, dynamic> json) {
    return Habit(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: CategoryModel.fromJson(json['categoryId']),
      frequency: json['frequency'] ?? '',
      order: json['order'] ?? 0,
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  // متد برای گرفتن رنگ بر اساس category
  Color getColor() {
    switch (category.name.toLowerCase()) {
      case 'study':
        return Colors.blue;
      case 'health':
        return Colors.green;
      case 'work':
        return Colors.orange;
      case 'sport':
        return Colors.red;
      default:
        return Colors.purple;
    }
  }

  // متد برای گرفتن آیکون بر اساس category
  IconData getIcon() {
    switch (category.name.toLowerCase()) {
      case 'study':
        return Icons.menu_book;
      case 'health':
        return Icons.directions_run;
      case 'work':
        return Icons.work;
      case 'sport':
        return Icons.sports_soccer;
      default:
        return Icons.category;
    }
  }

  // متد برای فرمت frequency
  String formatFrequency() {
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'every-other-day':
        return 'Every other day';
      case 'biweekly':
        return 'Biweekly';
      default:
        return frequency;
    }
  }
}
