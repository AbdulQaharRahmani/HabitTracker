import 'package:flutter/cupertino.dart';

class CategoryModel {
  final String title;
  final int entries;
  final IconData icon;
  final Color color;

  CategoryModel({
    required this.title,
    required this.entries,
    required this.icon,
    required this.color,
  });
}
