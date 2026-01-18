import 'package:flutter/material.dart';

class MockData {
  static Map<String, dynamic> getSummaryData(String filter) {
    switch (filter) {
      case 'Last Month':
        return {
          'thisMonth': 8,
          'lastMonth': 12,
          'allTimeRate': 82.0,
          'trendPercentage': -5.0,
          'consistencyScore': 85.0,
        };
      case 'All Time':
        return {
          'thisMonth': 15,
          'lastMonth': 12,
          'allTimeRate': 91.0,
          'trendPercentage': 8.0,
          'consistencyScore': 96.0,
        };
      default: // 'This Month'
        return {
          'thisMonth': 12,
          'lastMonth': 5,
          'allTimeRate': 87.0,
          'trendPercentage': 12.0,
          'consistencyScore': 93.0,
        };
    }
  }

  static List<Map<String, dynamic>> getCompletionData(String filter) {
    switch (filter) {
      case 'Last Month':
        return [
          {'week': 'Week 1', 'value': 60},
          {'week': 'Week 2', 'value': 65},
          {'week': 'Week 3', 'value': 70},
          {'week': 'Week 4', 'value': 75},
          {'week': 'Now', 'value': 72},
        ];
      case 'All Time':
        return [
          {'week': 'Jan', 'value': 70},
          {'week': 'Feb', 'value': 75},
          {'week': 'Mar', 'value': 80},
          {'week': 'Apr', 'value': 85},
          {'week': 'Now', 'value': 91},
        ];
      default: // 'This Month'
        return [
          {'week': 'NOV 1', 'value': 65},
          {'week': 'NOV 8', 'value': 75},
          {'week': 'NOV 15', 'value': 85},
          {'week': 'NOV 22', 'value': 92},
          {'week': 'TODAY', 'value': 95},
        ];
    }
  }

  static List<List<int>> getConsistencyData(String filter) {
    switch (filter) {
      case 'Last Month':
        return [
          [2, 3, 4, 5, 3, 2, 4],
          [3, 4, 5, 6, 4, 3, 5],
          [4, 5, 6, 7, 5, 4, 6],
          [5, 6, 7, 8, 6, 5, 7],
        ];
      case 'All Time':
        return [
          [7, 8, 9, 8, 7, 6, 8],
          [8, 9, 9, 8, 7, 7, 8],
          [9, 9, 9, 9, 8, 8, 9],
          [9, 9, 9, 9, 9, 9, 9],
        ];
      default: // 'This Month'
        return [
          [2, 4, 6, 8, 5, 3, 7],
          [5, 7, 9, 6, 8, 4, 3],
          [8, 6, 9, 7, 5, 4, 6],
          [7, 8, 9, 6, 5, 4, 3],
        ];
    }
  }

  static List<Map<String, dynamic>> getTopHabits(String filter) {
    switch (filter) {
      case 'Last Month':
        return [
          {
            'name': 'Meditation',
            'category': 'WELLNESS',
            'percentage': 85,
            'icon': Icons.self_improvement,
          },
          {
            'name': 'Morning Jog',
            'category': 'HEALTH',
            'percentage': 80,
            'icon': Icons.directions_run,
          },
          {
            'name': 'Read 10 pages',
            'category': 'LEARNING',
            'percentage': 70,
            'icon': Icons.menu_book,
          },
        ];
      case 'All Time':
        return [
          {
            'name': 'Drink Water',
            'category': 'HEALTH',
            'percentage': 98,
            'icon': Icons.local_drink,
          },
          {
            'name': 'Morning Jog',
            'category': 'HEALTH',
            'percentage': 96,
            'icon': Icons.directions_run,
          },
          {
            'name': 'Read 10 pages',
            'category': 'LEARNING',
            'percentage': 94,
            'icon': Icons.menu_book,
          },
        ];
      default: // 'This Month'
        return [
          {
            'name': 'Morning Jog',
            'category': 'HEALTH',
            'percentage': 95,
            'icon': Icons.directions_run,
          },
          {
            'name': 'Read 10 pages',
            'category': 'LEARNING',
            'percentage': 80,
            'icon': Icons.menu_book,
          },
          {
            'name': 'Drink Water',
            'category': 'HEALTH',
            'percentage': 75,
            'icon': Icons.local_drink,
          },
        ];
    }
  }
}
