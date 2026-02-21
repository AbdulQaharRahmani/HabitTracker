import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:habit_tracker/screens/statisticScreen/data/models/chart_data_model.dart';
import '../data/providers/statistic_provider.dart';
import 'chart_mapper.dart';
import 'filter_enum.dart';

/// A card that displays the completion trend as a line chart.
/// It adapts the bottom axis labels based on the selected filter.
class CompletionTrendCard extends ConsumerWidget {
  final ChartData chartData;

  const CompletionTrendCard({super.key, required this.chartData});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filter = ref.watch(chartFilterProvider);

    // Generate FlSpot list for the chart using the mapper.
    final spots = ChartMapper.generateSpots(filter: filter, data: chartData);
    // Get the visible data for label generation.
    final visibleData = ChartMapper.getVisibleData(
      filter: filter,
      data: chartData,
    );


    final percentChange = _calculatePercentChange(filter, chartData);
    return _buildCompletionTrend(spots, visibleData, percentChange, filter);
  }


  /// Builds the main container with header and line chart.
  Widget _buildCompletionTrend(
    List<FlSpot> spots,
    List<DailyConsistency> visibleData,
    double percentChange,
    ChartFilter filter,
  ) {
    final now = DateTime.now();
    final todayDate = DateTime(now.year, now.month, now.day);

    final maxValue = chartData.daily.isNotEmpty
        ? chartData.daily.map((e) => e.completed).reduce((a, b) => a > b ? a : b)
        : 0;
    final maxY = maxValue > 0 ? maxValue.toDouble() : 5.0;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with title, subtitle and percent change badge.
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Completion Trend',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    _getSubtitle(filter),
                    style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                  ),
                ],
              ),
              // Percent change indicator.
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: AppTheme.success.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Icon(Icons.trending_up, color: AppTheme.success, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      '${percentChange >= 0 ? '+' : ''}${percentChange.toStringAsFixed(1)}%',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: percentChange >= 0
                            ? const Color(0xFF10B981)
                            : const Color(0xFFEF4444),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),


    // Line chart.
          SizedBox(
            height: 200,
            child: LineChart(

              LineChartData(
                minY: -0.2,
                maxY: maxY,
                gridData: const FlGridData(show: false),
                titlesData: FlTitlesData(
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, meta) {
                        final index = value.toInt();
                        if (index < 0 || index >= visibleData.length)
                          return const SizedBox();

                        final date = visibleData[index].date;
                        final isToday =
                            date.year == todayDate.year &&
                            date.month == todayDate.month &&
                            date.day == todayDate.day;

                        String labelText = '';
                        Color labelColor = Colors.grey[500]!;

                        switch (filter) {
                          case ChartFilter.week:
                            // Week: show abbreviated day names, replace current day with "Today".
                            labelText = isToday
                                ? 'Today'
                                : DateFormat.E().format(date);
                            labelColor = isToday
                                ? AppTheme.success
                                : Colors.grey[500]!;
                            break;

                          case ChartFilter.month:
                            // Month: always show "Today" if it's today, otherwise show first day of each week.
                            if (isToday) {
                              labelText = 'Today';
                              labelColor = AppTheme.success;
                            } else if (date.day == 1 || date.day % 7 == 1) {
                              labelText = DateFormat(
                                'MMM d',
                              ).format(date); // e.g., Nov 1
                              labelColor = Colors.grey[500]!;
                            } else {
                              return const SizedBox();
                            }
                          case ChartFilter.month:
                          // Month: show first day of each week (1,8,15,22,29) with month abbreviation.
                          // Highlight the week that contains today.
                            if (date.day == 1 || date.day % 7 == 1) {
                              labelText = DateFormat('MMM d').format(date); // e.g., Nov 1
                              // Determine if today falls within this week
                              final weekStart = DateTime(date.year, date.month, date.day);
                              final weekEnd = weekStart.add(const Duration(days: 6));
                              final isCurrentWeek = todayDate.isAfter(weekStart.subtract(const Duration(days: 1))) &&
                                  todayDate.isBefore(weekEnd.add(const Duration(days: 1)));
                              labelColor = isCurrentWeek ? AppTheme.success : Colors.grey[500]!;
                            } else {
                              return const SizedBox();
                            }
                            break;
                          case ChartFilter.lastMonth:
                            // Month: show first day of each week
                            if (date.day == 1 || date.day % 7 == 1) {
                              labelText = DateFormat(
                                'MMM d',
                              ).format(date); // e.g., Nov 1
                              labelColor = isToday
                                  ? AppTheme.success
                                  : Colors.grey[500]!;
                            } else {
                              return const SizedBox(); // don't show other days
                            }
                            break;

                          case ChartFilter.year:
                            // Year: show only month abbreviation
                            if (index == 0 ||
                                date.month !=
                                    visibleData[index - 1].date.month) {
                              labelText = DateFormat.MMM().format(
                                date,
                              ); // e.g., Nov
                              labelColor =
                                  date.month == todayDate.month &&
                                      date.year == todayDate.year
                                  ? AppTheme.success
                                  : Colors.grey[500]!;
                            } else {
                              return const SizedBox();
                            }
                            break;
                        }
                        return Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            labelText,
                            style: TextStyle(fontSize: 10, color: labelColor),
                          ),
                        );
                      },
                      interval: 1,
                    ),
                  ),
                  leftTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  topTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                  rightTitles: const AxisTitles(
                    sideTitles: SideTitles(showTitles: false),
                  ),
                ),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: spots,
                    isCurved: true,
                    curveSmoothness: 0.3,
                    isStrokeCapRound: true,
                    isStrokeJoinRound: true,
                    preventCurveOverShooting: true,
                    color: const Color(0xFF4F46E5),
                    barWidth: 2.8,
                    belowBarData: BarAreaData(
                      show: true,
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          const Color(0xFF4F46E5).withValues(alpha: 0.3),
                          const Color(0xFF4F46E5).withValues(alpha: 0.0),
                        ],
                      ),
                    ),
                    dotData: FlDotData(
                      show: true,
                      getDotPainter: (spot, percent, barData, index) {
                        // Only show a dot at the last point.
                        if (index == barData.spots.length - 1) {
                          return FlDotCirclePainter(
                            radius: 3,
                            color: const Color(0xFF4F46E5),
                            strokeWidth: 2,
                            strokeColor: const Color(0xFF4F46E5),
                          );
                        }
                        return FlDotCirclePainter(
                          radius: 0,
                          color: Colors.transparent,
                        );
                      },
                    ),
                  ),
                ],
                // Enable touch tooltips.
                lineTouchData: LineTouchData(
                  enabled: true,
                  touchTooltipData: LineTouchTooltipData(
                    tooltipBgColor: Colors.black,
                    tooltipRoundedRadius: 8,
                    tooltipPadding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 6,
                    ),
                    tooltipMargin: 12,
                      getTooltipItems: (touchedSpots) {
                        return touchedSpots.map((spot) {
                          return LineTooltipItem(
                            '${spot.y.toInt()} habits',
                            const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          );
                        }).toList();
                      },
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Returns a subtitle describing the current filter.
  String _getSubtitle(ChartFilter filter) {
    switch (filter) {
      case ChartFilter.week:
        return 'Consistency over last 7 days';
      case ChartFilter.month:
        return 'Consistency this month';
      case ChartFilter.year:
        return 'Consistency this year';
      case ChartFilter.lastMonth:
        return 'Consistency last month';
    }
  }

  /// Calculates the percentage change between the current period and the previous period
  /// based on the selected filter.
  double _calculatePercentChange(ChartFilter filter, ChartData data) {
    final allData = data.daily..sort((a, b) => a.date.compareTo(b.date));
    final now = DateTime.now();
    List<DailyConsistency> current = [];
    List<DailyConsistency> previous = [];

    switch (filter) {
      case ChartFilter.week:
        // Current: last 7 days, Previous: 7 days before that.
        current = allData
            .where(
              (d) =>
                  d.date.isAfter(now.subtract(const Duration(days: 7))) &&
                  !d.date.isAfter(now),
            )
            .toList();
        previous = allData
            .where(
              (d) =>
                  d.date.isAfter(now.subtract(const Duration(days: 14))) &&
                  d.date.isBefore(now.subtract(const Duration(days: 7))),
            )
            .toList();
        break;

      case ChartFilter.month:
        final firstDayThisMonth = DateTime(now.year, now.month, 1);
        final firstDayLastMonth = DateTime(now.year, now.month - 1, 1);

        // Current: from first day of this month until today.
        current = allData
            .where(
              (d) =>
                  d.date.isAfter(
                    firstDayThisMonth.subtract(const Duration(days: 1)),
                  ) &&
                  d.date.isBefore(now.add(const Duration(days: 1))),
            )
            .toList();
        // Previous: whole last month.
        previous = allData
            .where(
              (d) =>
                  d.date.isAfter(
                    firstDayLastMonth.subtract(const Duration(days: 1)),
                  ) &&
                  d.date.isBefore(firstDayThisMonth),
            )
            .toList();
        break;

      case ChartFilter.lastMonth:
        final firstDayThisMonth = DateTime(now.year, now.month, 1);
        final firstDayLastMonth = DateTime(now.year, now.month - 1, 1);
        final firstDayMonthBefore = DateTime(now.year, now.month - 2, 1);

        // Current: last month.
        current = allData
            .where(
              (d) =>
                  d.date.isAfter(
                    firstDayLastMonth.subtract(const Duration(days: 1)),
                  ) &&
                  d.date.isBefore(firstDayThisMonth),
            )
            .toList();
        // Previous: the month before last month.
        previous = allData
            .where(
              (d) =>
                  d.date.isAfter(
                    firstDayMonthBefore.subtract(const Duration(days: 1)),
                  ) &&
                  d.date.isBefore(firstDayLastMonth),
            )
            .toList();
        break;

      case ChartFilter.year:
        final firstDayThisYear = DateTime(now.year, 1, 1);
        final firstDayLastYear = DateTime(now.year - 1, 1, 1);

        // Current: from first day of this year until today.
        current = allData
            .where(
              (d) =>
                  d.date.isAfter(
                    firstDayThisYear.subtract(const Duration(days: 1)),
                  ) &&
                  d.date.isBefore(now.add(const Duration(days: 1))),
            )
            .toList();
        // Previous: whole last year.
        previous = allData
            .where(
              (d) =>
                  d.date.isAfter(
                    firstDayLastYear.subtract(const Duration(days: 1)),
                  ) &&
                  d.date.isBefore(firstDayThisYear),
            )
            .toList();
        break;
    }

    // Calculate average completion for current and previous periods.
    double currentAvg = current.isNotEmpty
        ? current.map((e) => e.completed).reduce((a, b) => a + b) /
              current.length
        : 0;
    double previousAvg = previous.isNotEmpty
        ? previous.map((e) => e.completed).reduce((a, b) => a + b) /
              previous.length
        : 0;

    if (previousAvg == 0) return 0;
    return ((currentAvg - previousAvg) / previousAvg) * 100;
  }
}
