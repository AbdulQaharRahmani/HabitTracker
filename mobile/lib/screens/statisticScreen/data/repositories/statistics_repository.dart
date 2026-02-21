import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../services/token_storage.dart';
import '../models/dashboard_summary_model.dart';
import '../models/chart_data_model.dart';

class StatisticsRepository {
  final String baseUrl;

  StatisticsRepository({required this.baseUrl});

  // ==========================
  // Get Dashboard Summary
  // ==========================
  Future<DashboardSummaryModel> getDashboardSummary({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final token = await AuthManager.getToken();

    final uri = Uri.parse(
      '$baseUrl/habits/dashboard'
          '?startDate=${startDate.toIso8601String().split("T").first}'
          '&endDate=${endDate.toIso8601String().split("T").first}',
    );

    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      return DashboardSummaryModel.fromJson(decoded['data']);
    } else {
      throw Exception('Failed to load dashboard summary');
    }
  }


  // ==========================
  // Get Chart Data
  // ==========================
  Future<ChartData> getChartData({
    required DateTime startDate,
    required DateTime endDate,
  }) async {
    final token = await AuthManager.getToken();

    final uri = Uri.parse(
      '$baseUrl/habits/dashboard/chart-data'
          '?startDate=${startDate.toIso8601String().split("T").first}'
          '&endDate=${endDate.toIso8601String().split("T").first}',
    );

    final response = await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final decoded = jsonDecode(response.body);
      return ChartData.fromJson(decoded['data']);
    } else {
      throw Exception('Failed to load chart data');
    }
  }
}
