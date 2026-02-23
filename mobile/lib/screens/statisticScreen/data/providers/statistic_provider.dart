import 'package:flutter/material.dart';
import '../../widgets/filter_enum.dart';
import '../models/chart_data_model.dart';
import '../models/dashboard_summary_model.dart';
import '../repositories/statistics_repository.dart';
import 'consistency_provider.dart';

class StatisticProvider extends ChangeNotifier {
  final StatisticsRepository _repository = StatisticsRepository(
    baseUrl: "https://habit-tracker-17sr.onrender.com/api",
  );

  ChartFilter _filter = ChartFilter.month;
  ChartData? _chartData;
  DashboardSummaryModel? _summary;
  bool _isLoading = false;
  String? _error;

  // Getters
  ChartFilter get filter => _filter;
  ChartData? get chartData => _chartData;
  DashboardSummaryModel? get summary => _summary;
  bool get isLoading => _isLoading;
  String? get error => _error;

  StatisticProvider() {
    fetchAllData();
  }

  void setFilter(ChartFilter newFilter) {
    if (_filter == newFilter) return;
    _filter = newFilter;
    notifyListeners();

    // Only reload Summary and Chart data, ignore Consistency
    fetchAllData();
  }

  DateRange get dateRange {
    final now = DateTime.now();
    switch (_filter) {
      case ChartFilter.week:
        return DateRange(now.subtract(const Duration(days: 6)), now);
      case ChartFilter.month:
        return DateRange(DateTime(now.year, now.month, 1), now);
      case ChartFilter.lastMonth:
        return DateRange(DateTime(now.year, now.month - 1, 1), DateTime(now.year, now.month, 0));
      case ChartFilter.year:
        return DateRange(DateTime(now.year, 1, 1), now);
    }
  }

  Future<void> fetchAllData() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final range = dateRange;

      // Concurrently fetch summary and chart data
      final results = await Future.wait([
        _repository.getDashboardSummary(startDate: range.start, endDate: range.end),
        _repository.getChartData(startDate: range.start, endDate: range.end),
      ]);

      _summary = results[0] as DashboardSummaryModel;
      _chartData = results[1] as ChartData;
    } catch (e) {
      // e.toString() here will contain the exact message thrown by repository
      _error = _parseBackendError(e);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Extracts the clean message from the backend exception
  String _parseBackendError(dynamic e) {
    String message = e.toString();
    // Remove 'Exception: ' prefix if present to show a clean message to the user
    if (message.startsWith('Exception:')) {
      message = message.replaceFirst('Exception:', '').trim();
    }

    // Handle common network issues
    if (message.toLowerCase().contains('socketexception')) {
      return "Network error: Please check your internet connection.";
    }

    return message;
  }

  Future<void> refreshAllScreenData(ConsistencyProvider consistencyProv) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
         await Future.wait([
        fetchAllData(),
        consistencyProv.fetchConsistency(),
      ]);
    } catch (e) {
      _error = _parseBackendError(e);
    } finally {
         _isLoading = false;
      notifyListeners();
    }
  }
}

class DateRange {
  final DateTime start;
  final DateTime end;
  DateRange(this.start, this.end);
}