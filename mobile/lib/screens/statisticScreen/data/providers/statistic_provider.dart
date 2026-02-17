import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_riverpod/legacy.dart';
import '../../widgets/filter_enum.dart';
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


final summaryProvider =
AsyncNotifierProvider<SummaryNotifier, DashboardSummaryModel>(
    SummaryNotifier.new);

class SummaryNotifier extends AsyncNotifier<DashboardSummaryModel> {
  @override
  Future<DashboardSummaryModel> build() async {
    final repo = ref.watch(statisticsRepositoryProvider); // watch
    final range = ref.watch(dateRangeProvider); // watch
    return repo.getDashboardSummary(startDate: range.start, endDate: range.end);

  }

  // SummaryNotifier
  Future<void> reloadSummary() async {
    final repo = ref.read(statisticsRepositoryProvider);
    final range = ref.read(dateRangeProvider);
    state = await AsyncValue.guard(() => repo.getDashboardSummary(startDate: range.start, endDate: range.end));
  }

}

final chartProvider =
AsyncNotifierProvider<ChartNotifier, ChartData>(
    ChartNotifier.new);

class ChartNotifier extends AsyncNotifier<ChartData> {
  @override
  Future<ChartData> build() async {
    final repo = ref.watch(statisticsRepositoryProvider); // watch
    final range = ref.watch(dateRangeProvider); // watch
    return repo.getChartData(startDate: range.start, endDate: range.end);
  }



  Future<void> reloadChart() async {
    final repo = ref.read(statisticsRepositoryProvider);
    final range = ref.read(dateRangeProvider);

    state = await AsyncValue.guard(() async {
      return repo.getChartData(
        startDate: range.start,
        endDate: range.end,
      );
    });
  }
}







// ==============================
// Chart Filter StateProvider
// ==============================

final chartFilterProvider = StateProvider<ChartFilter>((ref) => ChartFilter.month);


class DateRange {
  final DateTime start;
  final DateTime end;

  DateRange(this.start, this.end);
}

final dateRangeProvider = Provider<DateRange>((ref) {
  final filter = ref.watch(chartFilterProvider);
  final now = DateTime.now();

  switch (filter) {
    case ChartFilter.week:
      return DateRange(
        now.subtract(const Duration(days: 6)),
        now,
      );

    case ChartFilter.month:
      return DateRange(
        DateTime(now.year, now.month, 1),
        now,
      );

    case ChartFilter.lastMonth:
      final lastMonth = DateTime(now.year, now.month - 1, 1);
      return DateRange(
        lastMonth,
        DateTime(now.year, now.month, 0),
      );

    case ChartFilter.year:
      return DateRange(
        DateTime(now.year, 1, 1),
        now,
      );
  }
});
