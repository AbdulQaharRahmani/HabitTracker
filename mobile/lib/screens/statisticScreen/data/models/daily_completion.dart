class DailyCompletion {
  final DateTime date;
  final int completed;

  DailyCompletion({
    required this.date,
    required this.completed,
  });

  factory DailyCompletion.fromJson(Map<String, dynamic> json) {
    return DailyCompletion(
      date: DateTime.parse(json['date']),
      completed: json['completed'],
    );
  }
}

class ChartData {
  final List<DailyCompletion> daily;

  ChartData({required this.daily});

  factory ChartData.fromJson(Map<String, dynamic> json) {
    final dailyList = (json['daily'] as List)
        .map((e) => DailyCompletion.fromJson(e))
        .toList();

    return ChartData(daily: dailyList);
  }
}
