import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:provider/provider.dart';

import '../../providers/theme_provider.dart';

class CompletionChart extends StatelessWidget {
  final List<double> values;
  final List<String> labels;

  const CompletionChart({
    super.key,
    required this.values,
    required this.labels,
  });

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);
    if (values.isEmpty || labels.isEmpty) {
      return const SizedBox.shrink();
    }

    final double growth = ((values.last - values.first).toDouble());
    final bool isPositive = growth >= 0;

    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(20.r),
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadow,
            blurRadius: 12.r,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// ===== Header =====
          Row(
            children: [
              Text(
                'Completion Trend',
                style: TextStyle(
                  fontSize: 14.sp,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
              const Spacer(),

              /// Growth badge
              Container(
                padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 4.h),
                decoration: BoxDecoration(
                  color: isPositive ? AppTheme.successBackground : AppTheme.error,
                  borderRadius: BorderRadius.circular(20.r),
                ),
                child: Text(
                  '${isPositive ? '+' : ''}${growth.toStringAsFixed(1)}%',
                  style: TextStyle(
                    color: isPositive ? AppTheme.success : AppTheme.textWhite,
                    fontSize: 12.sp,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),

          SizedBox(height: 4.h),

          Text(
            'User activity over last 30 days',
            style: TextStyle(
              fontSize: 12.sp,
              color: AppTheme.textMuted,
            ),
          ),

          SizedBox(height: 20.h),

          /// ===== Chart =====
          SizedBox(
            height: 180.h,
            child: LineChart(
              LineChartData(
                minY: 0,
                maxY: 100,
                minX: 0,
                maxX: values.length - 1,

                gridData: FlGridData(show: false),
                borderData: FlBorderData(show: false),

                titlesData: FlTitlesData(
                  leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      interval: 1,
                      getTitlesWidget: (value, _) {
                        final index = value.toInt();
                        if (index < 0 || index >= labels.length) {
                          return const SizedBox.shrink();
                        }
                        final bool isToday = index == labels.length - 1;
                        return Padding(
                          padding: EdgeInsets.only(top: 8.h),
                          child: Text(
                            labels[index],
                            style: TextStyle(
                              fontSize: 11.sp,
                              fontWeight: isToday ? FontWeight.w600 : null,
                              color: isToday ? AppTheme.chartLine : AppTheme.textMuted,
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),

                lineBarsData: [
                  LineChartBarData(
                    isCurved: true,
                    barWidth: 3,
                    color: AppTheme.chartLine,
                    dotData: FlDotData(show: false),
                    belowBarData: BarAreaData(
                      show: true,
                      gradient: LinearGradient(
                        colors: [AppTheme.chartFillTop, AppTheme.chartFillBottom],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                    ),
                    spots: List.generate(
                      values.length,
                          (i) => FlSpot(i.toDouble(), values[i]),
                    ),
                  ),
                ],

                lineTouchData: LineTouchData(
                  handleBuiltInTouches: true,
                  touchTooltipData: LineTouchTooltipData(
                    tooltipBgColor: AppTheme.chartTooltipBackground,
                    tooltipRoundedRadius: 8.r,
                    getTooltipItems: (spots) {
                      return spots.map((spot) {
                        return LineTooltipItem(
                          '${spot.y.toInt()}%',
                          TextStyle(
                            color: AppTheme.textWhite,
                            fontSize: 12.sp,
                            fontWeight: FontWeight.w600,
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
}