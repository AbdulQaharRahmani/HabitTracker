import '../../utils/category/category_model.dart';
import 'package:flutter/material.dart';

class Habit {
  final String id;
  final String title;
  final String description;
  final CategoryModel category;
  final String frequency;
  final int order;
  final DateTime createdAt;
  final int currentStreak;
  final bool reminderEnabled;
  final String? reminderTime;

  Habit({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.frequency,
    required this.order,
    required this.createdAt,
    required this.currentStreak,
    required this.reminderEnabled,
    required this.reminderTime,
  });

  factory Habit.fromJson(Map<String, dynamic> json) {
    final parsedReminderTime = _normalizeReminderTime(
      json['reminderTime']?.toString(),
    );
    return Habit(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: CategoryModel.fromJson(
        json['category'] ?? json['categoryId'] ?? {},
      ),
      frequency: json['frequency'] ?? 'daily',
      order: json['order'] ?? 0,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
      currentStreak: json['currentStreak'] ?? json['streak'] ?? 0,
      reminderEnabled:
          json['reminderEnabled'] == true && parsedReminderTime != null,
      reminderTime: parsedReminderTime,
    );
  }

  Habit copyWith({
    String? id,
    String? title,
    String? description,
    CategoryModel? category,
    String? frequency,
    int? order,
    DateTime? createdAt,
    int? currentStreak,
    bool? reminderEnabled,
    String? reminderTime,
  }) {
    final normalizedReminder = _normalizeReminderTime(reminderTime);
    final nextEnabled = reminderEnabled ?? this.reminderEnabled;
    final nextReminder = normalizedReminder ?? this.reminderTime;

    return Habit(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      category: category ?? this.category,
      frequency: frequency ?? this.frequency,
      order: order ?? this.order,
      createdAt: createdAt ?? this.createdAt,
      currentStreak: currentStreak ?? this.currentStreak,
      reminderEnabled: nextEnabled && nextReminder != null,
      reminderTime: nextEnabled ? nextReminder : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'description': description,
      'category': {
        '_id': category.id,
        'name': category.name,
        'icon': category.iconName,
        'backgroundColor': category.backgroundColorString,
      },
      'frequency': frequency,
      'order': order,
      'createdAt': createdAt.toIso8601String(),
      'currentStreak': currentStreak,
      'reminderEnabled': reminderEnabled,
      'reminderTime': reminderTime,
    };
  }

  TimeOfDay? get reminderTimeOfDay {
    if (reminderTime == null) return null;
    return _parseReminderTime(reminderTime!);
  }

  DateTime? nextReminderDateTime({DateTime? now}) {
    if (!reminderEnabled || reminderTime == null) return null;
    final parsed = _parseReminderTime(reminderTime!);
    if (parsed == null) return null;

    final current = now ?? DateTime.now();
    var candidate = DateTime(
      current.year,
      current.month,
      current.day,
      parsed.hour,
      parsed.minute,
    );

    if (candidate.isBefore(current)) {
      candidate = candidate.add(const Duration(days: 1));
    }
    return candidate;
  }

  static String? normalizeReminderTime(String? value) {
    return _normalizeReminderTime(value);
  }

  static String? _normalizeReminderTime(String? value) {
    if (value == null || value.trim().isEmpty) return null;
    final parts = value.trim().split(':');
    if (parts.length < 2) return null;
    final hour = int.tryParse(parts[0]);
    final minute = int.tryParse(parts[1]);
    if (hour == null || minute == null) return null;
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    final hh = hour.toString().padLeft(2, '0');
    final mm = minute.toString().padLeft(2, '0');
    return '$hh:$mm';
  }

  static TimeOfDay? _parseReminderTime(String value) {
    final normalized = _normalizeReminderTime(value);
    if (normalized == null) return null;
    final parts = normalized.split(':');
    final hour = int.parse(parts[0]);
    final minute = int.parse(parts[1]);
    return TimeOfDay(hour: hour, minute: minute);
  }

  String formatFrequency() {
    switch (frequency.toLowerCase()) {
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
