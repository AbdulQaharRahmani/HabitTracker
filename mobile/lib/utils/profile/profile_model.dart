import 'dart:convert';

import 'package:flutter/material.dart';

import '../../app/app_theme.dart';
import '../today_progressBar/task_item.dart';

Welcome welcomeFromJson(String str) =>
    Welcome.fromJson(json.decode(str));

String welcomeToJson(Welcome data) =>
    json.encode(data.toJson());

/// ─────────────────────────────────────────────
/// ROOT RESPONSE
/// ─────────────────────────────────────────────
class Welcome {
  final bool success;
  final HabitsData? habitsData;
  final UserData? userData;

  Welcome({
    required this.success,
    this.habitsData,
    this.userData,
  });

  factory Welcome.fromJson(Map<String, dynamic> json) => Welcome(
    success: json["success"] ?? false,

    /// dashboard → /api/habits/dashboard
    habitsData: json["data"] != null &&
        json["data"] is Map &&
        json["data"].containsKey("totalHabits")
        ? HabitsData.fromJson(json["data"])
        : null,

    /// preference → /api/users/preference
    userData: json["data"] != null &&
        json["data"] is Map &&
        json["data"].containsKey("userId")
        ? UserData.fromJson(json["data"])
        : json["user"] != null
        ? UserData.fromJson(json["user"])
        : null,
  );

  Map<String, dynamic> toJson() => {
    "success": success,
    "data": habitsData?.toJson() ?? userData?.toJson(),
  };
}

/// ─────────────────────────────────────────────
/// HABITS DASHBOARD MODEL
/// ─────────────────────────────────────────────
class HabitsData {
  final int totalHabits;
  final int currentStreak;
  final int completionRate;

  HabitsData({
    required this.totalHabits,
    required this.currentStreak,
    required this.completionRate,
  });

  factory HabitsData.fromJson(Map<String, dynamic> json) => HabitsData(
    totalHabits: json["totalHabits"] ?? 0,
    currentStreak: json["currentStreak"] ?? 0,
    completionRate: json["completionRate"] ?? 0,
  );

  Map<String, dynamic> toJson() => {
    "totalHabits": totalHabits,
    "currentStreak": currentStreak,
    "completionRate": completionRate,
  };
}

/// ─────────────────────────────────────────────
/// USER PREFERENCE MODEL (+ profile image)
/// ─────────────────────────────────────────────
class UserData {
  final String userId;
  final String weekStartDay;
  final String dailyReminderTime;
  final bool dailyReminderEnabled;
  final String timezone;
  final String theme;
  final bool streakAlertEnabled;
  final bool weeklySummaryEmailEnabled;
  final String id;

  final String? profileImage;

  final DateTime createdAt;
  final DateTime updatedAt;
  final int version;

  UserData({
    required this.userId,
    required this.weekStartDay,
    required this.dailyReminderTime,
    required this.dailyReminderEnabled,
    required this.timezone,
    required this.theme,
    required this.streakAlertEnabled,
    required this.weeklySummaryEmailEnabled,
    required this.id,
    required this.createdAt,
    required this.updatedAt,
    required this.version,
    this.profileImage,
  });

  factory UserData.fromJson(Map<String, dynamic> json) => UserData(
    userId: json["userId"] ?? "",
    weekStartDay: json["weekStartDay"] ?? "monday",
    dailyReminderTime: json["dailyReminderTime"] ?? "08:00",
    dailyReminderEnabled: json["dailyReminderEnabled"] ?? false,
    timezone: json["timezone"] ?? "UTC",
    theme: json["theme"] ?? "light",
    streakAlertEnabled: json["streakAlertEnabled"] ?? false,
    weeklySummaryEmailEnabled:
    json["weeklySummaryEmailEnabled"] ?? false,
    id: json["_id"] ?? "",

    /// 👇 backend field
    profileImage: json["profileImage"],

    createdAt:
    DateTime.tryParse(json["createdAt"] ?? "") ?? DateTime.now(),
    updatedAt:
    DateTime.tryParse(json["updatedAt"] ?? "") ?? DateTime.now(),
    version: json["__v"] ?? 0,
  );

  Map<String, dynamic> toJson() => {
    "userId": userId,
    "weekStartDay": weekStartDay,
    "dailyReminderTime": dailyReminderTime,
    "dailyReminderEnabled": dailyReminderEnabled,
    "timezone": timezone,
    "theme": theme,
    "streakAlertEnabled": streakAlertEnabled,
    "weeklySummaryEmailEnabled": weeklySummaryEmailEnabled,
    "_id": id,
    "profileImage": profileImage,
    "createdAt": createdAt.toIso8601String(),
    "updatedAt": updatedAt.toIso8601String(),
    "__v": version,
  };
}

final Map<String, TaskCategoryUI> taskCategoryMapByName = {
  'study':  TaskCategoryUI(icon: Icons.school_outlined, color: AppTheme.primary),
  'sport':  TaskCategoryUI(icon: Icons.fitness_center, color: AppTheme.success),
  'work':  TaskCategoryUI(icon: Icons.work_outline, color: AppTheme.warning),
  'health':  TaskCategoryUI(icon: Icons.favorite_outline, color: AppTheme.error),
  'personal': TaskCategoryUI(icon: Icons.task_alt, color: AppTheme.primary),
};
