class DashboardSummaryModel {
  final int totalHabits;
  final int currentStreak;
  final double completionRate;

  DashboardSummaryModel({
    required this.totalHabits,
    required this.currentStreak,
    required this.completionRate,
  });

  factory DashboardSummaryModel.fromJson(Map<String, dynamic> json) {
    return DashboardSummaryModel(
      totalHabits: json['totalHabits'],
      currentStreak: json['currentStreak'],
      completionRate: (json['completionRate'] as num).toDouble(),
    );
  }
}
