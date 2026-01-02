import 'package:flutter/cupertino.dart';

class Habit {
  late final String title;
  late final String description;
  late final int timeInMin;
  late final IconData taskIcon;
  late final Color iconColor;
  bool isCompleted;
  late final String category;

  Habit({
    required this.taskIcon,
    required this.iconColor,
    required this.timeInMin,
    required this.description,
    required this.title,
   this.isCompleted = false,
    required this.category
  });
}
