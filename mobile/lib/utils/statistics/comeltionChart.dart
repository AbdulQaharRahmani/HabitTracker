import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/app/app_theme.dart';

class CompletionChart extends StatelessWidget {
  const CompletionChart({super.key});

  @override
  Widget build(BuildContext context) {
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
                  fontWeight: FontWeight.bold,
                  fontSize: 14.sp,
                ),
              ),
              const Spacer(),

              /// +12% badge
              Container(
                padding: EdgeInsets.symmetric(
                  horizontal: 10.w,
                  vertical: 4.h,
                ),
                decoration: BoxDecoration(
                  color: AppTheme.successBackground,
                  borderRadius: BorderRadius.circular(20.r),
                ),
                child: Text(
                  '+12%',
                  style: TextStyle(
                    color: AppTheme.success,
                    fontWeight: FontWeight.w600,
                    fontSize: 12.sp,
                  ),
                ),
              ),
            ],
          ),

          SizedBox(height: 4.h),
          Text(
            'Consistency over last 30 days',
            style: TextStyle(
              fontSize: 12.sp,
              color: Colors.black54,
            ),
          ),

          SizedBox(height: 16.h),

          /// ===== 98% Badge =====
          Align(
            alignment: Alignment.centerRight,
            child: Container(
              padding: EdgeInsets.symmetric(
                horizontal: 8.w,
                vertical: 4.h,
              ),
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.circular(8.r),
              ),
              child: Text(
                '98%',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 12.sp,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),

          SizedBox(height: 8.h),

          /// ===== Chart =====
          SizedBox(
            height: 180.h,
            child: LineChart(
              LineChartData(
                minY: 0,
                maxY: 100,

                gridData: FlGridData(show: false),
                borderData: FlBorderData(show: false),

                /// ===== Bottom labels =====
                titlesData: FlTitlesData(
                  leftTitles:
                  AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  topTitles:
                  AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  rightTitles:
                  AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      interval: 1,
                      getTitlesWidget: (value, _) {
                        switch (value.toInt()) {
                          case 0:
                            return _bottomText('Nov 1');
                          case 1:
                            return _bottomText('Nov 8');
                          case 2:
                            return _bottomText('Nov 15');
                          case 3:
                            return _bottomText('Nov 22');
                          case 6:
                            return _bottomText(
                              'TODAY',
                              color: AppTheme.chartLine,
                              isBold: true,
                            );
                          default:
                            return const SizedBox.shrink();
                        }
                      },
                    ),
                  ),
                ),

                /// ===== Touch / Tooltip =====
                lineTouchData: LineTouchData(
                  handleBuiltInTouches: true,
                  touchTooltipData: LineTouchTooltipData(
                    tooltipBgColor: Colors.grey.shade900,
                    tooltipRoundedRadius: 8.r,
                    getTooltipItems: (spots) {
                      return spots.map((spot) {
                        return LineTooltipItem(
                          '${spot.y.toInt()}%',
                          TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                            fontSize: 12.sp,
                          ),
                        );
                      }).toList();
                    },
                  ),
                ),

                lineBarsData: [
                  LineChartBarData(
                    isCurved: true,
                    barWidth: 4.w,
                    color: AppTheme.chartLine,

                    /// last dot
                    dotData: FlDotData(
                      show: true,
                      checkToShowDot: (spot, _) => spot.x == 6,
                      getDotPainter: (spot, percent, bar, index) =>
                          FlDotCirclePainter(
                            radius: 5.r,
                            color: AppTheme.chartLine,
                            strokeWidth: 2.w,
                            strokeColor: Colors.white,
                          ),
                    ),

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

  Widget _bottomText(
      String text, {
        Color color = AppTheme.textPrimary,
        bool isBold = false,
      }) {
    return Padding(
      padding: EdgeInsets.only(top: 8.h),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 11.sp,
          color: color,
          fontWeight: isBold ? FontWeight.w600 : FontWeight.normal,
        ),
      ),
    );
  }
}
