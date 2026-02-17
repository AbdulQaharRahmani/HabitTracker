import 'package:fl_chart/fl_chart.dart';
import '../data/models/chart_data_model.dart';
import 'filter_enum.dart';

class ChartMapper {
  // Convert data to chart points
  static List<FlSpot> generateSpots({
    required ChartFilter filter,
    required ChartData data,
  }) {
    final source = _getFilteredData(filter, data);
    return _mapToSpots(source);
  }

  // Get visible data (for labels)
  static List<DailyCompletion> getVisibleData({
    required ChartFilter filter,
    required ChartData data,
  }) {
    return _getFilteredData(filter, data);
  }

  // Helper method to apply filter based on date
  static List<DailyCompletion> _getFilteredData(
      ChartFilter filter, ChartData data) {
    // Ensure data is sorted
    final sorted = List<DailyCompletion>.from(data.daily)
      ..sort((a, b) => a.date.compareTo(b.date));

    switch (filter) {
      case ChartFilter.week:
      // Provider already returns 7-day range, just return all
        return sorted;

      case ChartFilter.month:
      // Provider returns from the first day of current month to today
        return sorted;

      case ChartFilter.year:
      // Provider returns from the first day of current year to today
        return sorted;

      case ChartFilter.lastMonth:
        final now = DateTime.now();
        final firstDayThisMonth = DateTime(now.year, now.month, 1);
        final firstDayLastMonth = DateTime(now.year, now.month - 1, 1);
        return sorted.where((d) =>
        d.date.isAfter(firstDayLastMonth.subtract(const Duration(days: 1))) &&
            d.date.isBefore(firstDayThisMonth)
        ).toList();
    }
  }

  static List<FlSpot> _mapToSpots(List<DailyCompletion> list) {
    return List.generate(list.length, (index) {
      return FlSpot(
        index.toDouble(),
        list[index].completed.toDouble(),
      );
    });
  }
}
