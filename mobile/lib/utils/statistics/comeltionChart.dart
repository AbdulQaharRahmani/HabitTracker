import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';

class CompletionChart extends StatelessWidget {
  const CompletionChart({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(color: AppTheme.shadow, blurRadius: 12),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text(
                'Completion Trend',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const Spacer(),
              Container(
                padding:
                const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.successBackground,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  '+12%',
                  style: TextStyle(color: AppTheme.success),
                ),
              )
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            'Consistency over last 30 days',
            style: TextStyle(fontSize: 12),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 180,
            child: LineChart(
              LineChartData(
                gridData: FlGridData(show: false),
                borderData: FlBorderData(show: false),
                titlesData: FlTitlesData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    isCurved: true,
                    barWidth: 4,
                    color: AppTheme.chartLine,
                    belowBarData: BarAreaData(
                      show: true,
                      gradient: const LinearGradient(
                        colors: [
                          AppTheme.chartFillTop,
                          AppTheme.chartFillBottom,
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                    spots: const [
                      FlSpot(0, 40),
                      FlSpot(1, 60),
                      FlSpot(2, 55),
                      FlSpot(3, 75),
                      FlSpot(4, 65),
                      FlSpot(5, 85),
                      FlSpot(6, 98),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
