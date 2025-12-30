class TaskItem {
  String title;
  String time;
  String category;
  bool done;

  TaskItem({
    required this.title,
    required this.time,
    required this.category,
    this.done = false,
  });
}
