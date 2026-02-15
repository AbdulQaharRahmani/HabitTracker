import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import '../models/chart_data_model.dart';
import '../models/dashboard_summary_model.dart';
import '../repositories/statistics_repository.dart';

// ==============================
// Repository Provider
// ==============================
final statisticsRepositoryProvider = Provider<StatisticsRepository>((ref) {
  return StatisticsRepository(
    baseUrl: "https://habit-tracker-17sr.onrender.com/api",
  );
});

// ==============================
// Dashboard Summary Provider
// ==============================
final dashboardSummaryProvider = FutureProvider<DashboardSummaryModel>((ref) async {
  // Watch the repository provider
  final repo = ref.watch(statisticsRepositoryProvider);

  try {
    return await repo.getDashboardSummary();
  } catch (e) {
    throw Exception("Error fetching dashboard summary: $e");
  }
});
// ==============================
// Chart Filter StateProvider
// ==============================
enum ChartFilter { weekly, monthly, yearly }

final chartFilterProvider = StateProvider<ChartFilter>((ref) => ChartFilter.monthly);
// ==============================
// Chart Data Provider
// ==============================
final chartDataProvider = FutureProvider<ChartData>((ref) async {
  // Watch repository and filter
  final repo = ref.watch(statisticsRepositoryProvider);
  final filter = ref.watch(chartFilterProvider);

  final end = DateTime.now();

  // Determine start date based on filter
  final start = switch (filter) {
    ChartFilter.weekly => end.subtract(Duration(days: 6)),
    ChartFilter.monthly => DateTime(end.year, end.month, 1),
    ChartFilter.yearly => DateTime(end.year, 1, 1),

  };

  try {
    return await repo.getChartData(startDate: start, endDate: end);
  } catch (e) {
    throw Exception("Error fetching chart data: $e");
  }
});
