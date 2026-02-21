class HabitDay {
  final DateTime date;
  final int completed;

  HabitDay({
    required this.date,
    required this.completed,
  });

  factory HabitDay.fromJson(Map<String, dynamic> json) {
    return HabitDay(
      date: DateTime.parse(json['date']),
      completed: json['completed'],
    );
  }
  bool get isToday {
    final now = DateTime.now();
    return date.year == now.year &&
        date.month == now.month &&
        date.day == now.day;
  }
}

class ChartData {
  final List<HabitDay> daily;

  ChartData({required this.daily});

  factory ChartData.fromJson(Map<String, dynamic> json) {
    final dailyList = (json['daily'] as List)
        .map((e) => HabitDay.fromJson(e))
        .toList();

    return ChartData(daily: dailyList);
  }


}
