import 'package:flutter/material.dart';

class Habit {
  final String title;
  final String description;
  final String category;
  final int timeInMinutes;
  final Color color;
  final IconData icon;
  final String frequency;
  final String placeholder;


  Habit({
    required this.title,
    required this.description,
    required this.category,
    required this.timeInMinutes,
    required this.color,
    required this.icon,
    required this.frequency,
    this.placeholder = '',
  }) ;
}
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
