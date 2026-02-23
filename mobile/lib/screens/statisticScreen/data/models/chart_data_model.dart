class DailyConsistency {
  final DateTime date;
  final int completed;

  DailyConsistency({
    required this.date,
    required this.completed,
  });

  factory DailyConsistency.fromJson(Map<String, dynamic> json) {
    return DailyConsistency(
      date: DateTime.parse(json['date']),
      completed: json['completed'],
    );
  }
}

class ChartData {
  final List<DailyConsistency> daily;

  ChartData({required this.daily});

  factory ChartData.fromJson(Map<String, dynamic> json) {
    final dailyList = (json['daily'] as List)
        .map((e) => DailyConsistency.fromJson(e))
        .toList();

    return ChartData(daily: dailyList);
  }
}
