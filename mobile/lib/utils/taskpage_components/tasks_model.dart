import '../category/category_model.dart';

class Task{
  final String id;
  final String title;
  final String? description;
  final String status;
  final String priority;
  final DateTime? dueDate;
  final String userId;
  final bool isDeleted;
  final DateTime createdAt;
  final DateTime updatedAt;
  final CategoryModel? category;
  final String? categoryId;
  Task({
    required this.id,
    required this.title,
     this.description,
    required this.status,
    required this.priority,
    this.dueDate,
    required this.userId,
    required this.isDeleted,
    required this.createdAt,
    required this.updatedAt,
    this.category,
    this.categoryId,
  });

  // ==============================
  //   copyWith
  // ==============================
  Task copyWith({
    String? status,
    String? title,
    String? description,
    String? priority,
    String? categoryId,
    DateTime? dueDate,
    CategoryModel? category,
  }) {
    return Task(
      id: id,
      title: title ?? this.title,
      description: description ?? this.description,
      status: status ?? this.status,
      priority: priority ?? this.priority,
      categoryId: categoryId ?? this.categoryId,
      dueDate: dueDate ?? this.dueDate,
      userId: userId,
      isDeleted: isDeleted,
      createdAt: createdAt,
      updatedAt: updatedAt,
      category: category ?? this.category,
    );
  }



  factory Task.fromJson(Map<String, dynamic> json) {
    CategoryModel? category;
    String? categoryId;

    if (json['categoryId'] != null) {
      if (json['categoryId'] is Map<String, dynamic>) {
        category = CategoryModel.fromJson(json['categoryId']);
        categoryId = category.id;
      } else if (json['categoryId'] is String) {
        categoryId = json['categoryId'] as String;
      }
    }

    return Task(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      status: json['status'] ?? 'todo',
      priority: json['priority'] ?? 'medium',
      dueDate: json['dueDate'] != null
          ? DateTime.tryParse(json['dueDate'])
          : null,
      userId: json['userId'] ?? '',
      isDeleted: json['isDeleted'] ?? false,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'])
          : DateTime.now(),
      category: category,
      categoryId: categoryId,
    );
  }




  bool get isDone => status == 'done';
}
