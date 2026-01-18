class Task {
  final String id;
  final String title;
  final String description;
  final String status;
  final String priority;
  final DateTime? dueDate;
  final String userId;
  final bool isDeleted;
  final DateTime createdAt;
  final DateTime updatedAt;

  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.status,
    required this.priority,
    this.dueDate,
    required this.userId,
    required this.isDeleted,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      status: json['status'] ?? 'todo',
      priority: json['priority'] ?? 'medium',
      dueDate: json['dueDate'] != null ? DateTime.tryParse(json['dueDate']) : null,
      userId: json['userId'] ?? '',
      isDeleted: json['isDeleted'] ?? false,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson({String? categoryId}) {
    final map = {
      'title': title,
      'description': description,
      'status': status,
      'priority': priority,
      if (categoryId != null) 'categoryId': categoryId,
      if (dueDate != null) 'dueDate': dueDate!.toIso8601String(),
    };
    return map;
  }
}