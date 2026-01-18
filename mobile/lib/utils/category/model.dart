import 'package:flutter/material.dart';

class CategoryModel {
  final String id;
  final String name;
  final IconData icon;
  final Color backgroundColor;

  CategoryModel({
    required this.id,
    required this.name,
    required this.icon,
    required this.backgroundColor,
  });

  // ===== Factory constructor from JSON =====
  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      icon: stringToIcon(json['icon'] ?? 'widgets'),
      backgroundColor: stringToColor(json['backgroundColor'] ?? 'grey'),
    );
  }
}

// ===== Helper to convert string to IconData =====
IconData stringToIcon(String iconName) {
  switch (iconName) {
    case 'fitness_center':
      return Icons.fitness_center;
    case 'school':
      return Icons.school;
    case 'work':
      return Icons.work;
    case 'widgets':
      return Icons.widgets;
    default:
      return Icons.category;
  }
}

// ===== Helper to convert string to Color =====
Color stringToColor(String colorName) {
  switch (colorName.toLowerCase()) {
    case 'red':
      return Colors.red;
    case 'blue':
      return Colors.blue;
    case 'green':
      return Colors.green;
    case 'yellow':
      return Colors.yellow;
    case 'orange':
      return Colors.orange;
    default:
      return Colors.grey;
  }
}
