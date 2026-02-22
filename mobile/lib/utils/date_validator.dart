import 'package:flutter/material.dart';

/// Date validation utility for task/habit completion
class DateValidator {
  /// Check if a date is within the allowed completion range
  /// Allowed: Today - 7 days → Today
  static bool isDateInAllowedRange(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final targetDate = DateTime(date.year, date.month, date.day);

    // Calculate difference in days
    final difference = today.difference(targetDate).inDays;

    // Allowed: 0 (today) to 7 days ago
    return difference >= 0 && difference <= 7;
  }

  /// Get a user-friendly error message for invalid dates
  static String getErrorMessage(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final targetDate = DateTime(date.year, date.month, date.day);

    final difference = today.difference(targetDate).inDays;

    if (difference < 0) {
      return 'You cannot complete tasks for future dates';
    } else if (difference > 7) {
      return 'You can only complete tasks from the last 7 days';
    }

    return 'Invalid date';
  }

  /// Show a snackbar with the error message
  static void showDateError(BuildContext context, DateTime date) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(getErrorMessage(date)),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 3),
        backgroundColor: Colors.redAccent,
      ),
    );
  }

  /// Get the earliest allowed date (7 days ago)
  static DateTime getEarliestAllowedDate() {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    return today.subtract(const Duration(days: 7));
  }

  /// Get the latest allowed date (today)
  static DateTime getLatestAllowedDate() {
    final now = DateTime.now();
    return DateTime(now.year, now.month, now.day);
  }
}
