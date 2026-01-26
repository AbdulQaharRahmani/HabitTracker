class CreateCategoryModel {
  final String name;
  final String iconName;
  final String backgroundColor;

  CreateCategoryModel({
    required this.name,
    required this.iconName,
    required this.backgroundColor,
  });

  Map<String, dynamic> toJson() {
    return {
      "name": name,
      "icon": iconName,
      "backgroundColor": backgroundColor,
    };
  }
}
