import '../../utils/category/category_model.dart';



class Habit {
  final String id;
  final String title;
  final String description;
  final CategoryModel category;
  final String frequency;
  final int order;
  final DateTime createdAt;
  final int currentStreak;

  Habit({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.frequency,
    required this.order,
    required this.createdAt,
    required this.currentStreak,
  });

  factory Habit.fromJson(Map<String, dynamic> json) {
    return Habit(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: CategoryModel.fromJson(json['category'] ?? json['categoryId'] ?? {}),
      frequency: json['frequency'] ?? 'daily',
      order: json['order'] ?? 0,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
      currentStreak: json['currentStreak'] ?? json['streak'] ?? 0,
    );
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