class Habit {
  final String id;
  final String title;
  final String description;
  final String status;
  final String priority;
  final DateTime? dueDate;
  final String userId;
  final DateTime? deletedAt;
  final bool isDeleted;
  final bool isCompleted;
  final DateTime createdAt;
  final DateTime updatedAt;

  Habit({
    required this.id,
    required this.title,
    required this.description,
    required this.status,
    required this.priority,
    this.dueDate,
    required this.userId,
    this.deletedAt,
    required this.isDeleted,
    required this.isCompleted,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Habit.fromJson(Map<String, dynamic> json) {
    return Habit(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      status: json['status'] ?? '',
      priority: json['priority'] ?? '',
      dueDate: json['dueDate'] != null ? DateTime.parse(json['dueDate']) : null,
      userId: json['userId'] ?? '',
      deletedAt: json['deletedAt'] != null ? DateTime.parse(json['deletedAt']) : null,
      isDeleted: json['isDeleted'] ?? false,
      isCompleted: json['isCompleted'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'status': status,
      'priority': priority,
      'dueDate': dueDate?.toIso8601String(),
      'userId': userId,
      'isDeleted': isDeleted,
      'isCompleted': isCompleted,
    };
  }
}
