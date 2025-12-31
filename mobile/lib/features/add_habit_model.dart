class HabitData {
  final String title;
  final String description;
  final String frequency;
  final String category;

  const HabitData({
    required this.title,
    required this.description,
    required this.frequency,
    required this.category,
  });

  // Create object from API JSON
  factory HabitData.fromJson(Map<String, dynamic> json) {
    return HabitData(
      title: json['title'] as String,
      description: json['description'] as String,
      frequency: json['frequency'] as String,
      category: json['category'] as String,
    );
  }

  // Convert object to JSON for API requests
  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'frequency': frequency,
      'category': category,
    };
  }

  // Create a modified copy of this object
  HabitData copyWith({
    String? title,
    String? description,
    String? frequency,
    String? category,
  }) {
    return HabitData(
      title: title ?? this.title,
      description: description ?? this.description,
      frequency: frequency ?? this.frequency,
      category: category ?? this.category,
    );
  }
}
