import 'package:flutter/material.dart';

class CategoryModel {
  final String id;
  final String name;
  final String iconName;
  final Color backgroundColor;

  CategoryModel({
    required this.id,
    required this.name,
    required this.iconName,
    required this.backgroundColor,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      iconName: json['icon'] ?? 'circle',
      backgroundColor: _stringToColor(json['backgroundColor'] ?? 'grey'),
    );
  }

  static Color _stringToColor(String colorStr) {
    switch (colorStr.toLowerCase()) {
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
      case 'purple':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  IconData get icon {
    switch (iconName.toLowerCase()) {
      case 'sports':
        return Icons.sports;
      case 'work':
        return Icons.work;
      case 'study':
        return Icons.menu_book;
      default:
        return Icons.circle;
    }
  }
}