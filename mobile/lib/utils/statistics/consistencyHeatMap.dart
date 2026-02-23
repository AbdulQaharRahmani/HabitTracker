import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:provider/provider.dart';

import '../../providers/theme_provider.dart';

class ConsistencyHeatmap extends StatelessWidget {
  const ConsistencyHeatmap({super.key});

  Map<DateTime, int> _sampleDatasets() {
    DateTime now = DateTime.now();
    DateTime d(int days) => DateTime(now.year, now.month, now.day).subtract(Duration(days: days));

    return {
      d(1): 3,
      d(2): 2,
      d(3): 4,
      d(4): 1,
      d(5): 3,
      d(6): 2,
    };
  }

  bool _isSameDay(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;

  Color _colorForValue(int? value) {
    if (value == null || value <= 0) return AppTheme.heatEmpty;
    if (value == 1) return AppTheme.heatLow;
    if (value == 2) return AppTheme.heatMedium;
    return AppTheme.heatHigh;
  }

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);

    final outerPadding = 16.w;
    final cardRadius = 20.r;

    final endDate = DateTime.now();
    final startDate = DateTime(endDate.year, endDate.month, endDate.day).subtract(const Duration(days: 30));

    final datasets = <DateTime, int>{};
    _sampleDatasets().forEach((k, v) {
      final key = DateTime(k.year, k.month, k.day);
      datasets[key] = v;
    });

    final totalDays = endDate.difference(startDate).inDays + 1;
    final List<DateTime> days = List.generate(
      totalDays,
          (i) => DateTime(startDate.year, startDate.month, startDate.day).add(Duration(days: i)),
    );

    final padLeading = startDate.weekday - 1;
    final totalCells = ((padLeading + days.length + 6) / 7).floor() * 7;

    final weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Consistency',
          style: TextStyle(
            fontSize: 20.sp,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),

        SizedBox(height: 8.h),

        ClipRRect(
          borderRadius: BorderRadius.circular(18.r),
          child: Container(
            width: double.infinity,
            padding: EdgeInsets.symmetric(horizontal: 18.w, vertical: 14.h),
            color: AppTheme.surface,
            child: LayoutBuilder(builder: (context, constraints) {
              final availableWidth = constraints.maxWidth;
              final spacing = 10.w;
              final minCell = 34.w;
              final requiredWidthNoScroll = (minCell * 7) + (spacing * 6);
              final bool needsScroll = availableWidth < requiredWidthNoScroll;
              final cellWidth = needsScroll ? minCell : (availableWidth - (spacing * 6)) / 7;
              final gridTotalWidth = needsScroll ? requiredWidthNoScroll : availableWidth;

              Widget buildWeekdayLabels() {
                return Row(
                  children: List.generate(7, (i) {
                    return SizedBox(
                      width: cellWidth,
                      child: Center(
                        child: Text(
                          weekdayLabels[i],
                          style: TextStyle(
                            fontSize: 12.sp,
                            color: AppTheme.textSecondary.withOpacity(0.6),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    );
                  }),
                );
              }

              Widget buildGrid() {
                return SizedBox(
                  width: gridTotalWidth,
                  child: GridView.builder(
                    padding: EdgeInsets.zero,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: totalCells,
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 7,
                      crossAxisSpacing: spacing,
                      mainAxisSpacing: spacing,
                      childAspectRatio: 1,
                    ),
                    itemBuilder: (context, index) {
                      final cellDateIndex = index - padLeading;
                      final bool isEmptyCell = (cellDateIndex < 0) || (cellDateIndex >= days.length);

                      if (isEmptyCell) {
                        return Container(
                          width: cellWidth,
                          height: cellWidth,
                          decoration: BoxDecoration(
                            color: AppTheme.heatEmpty,
                            borderRadius: BorderRadius.circular(10.r),
                          ),
                        );
                      }

                      final date = days[cellDateIndex];
                      final normalizedDate = DateTime(date.year, date.month, date.day);
                      final value = datasets[normalizedDate];
                      final color = _colorForValue(value);
                      final today = DateTime.now();
                      final isToday = _isSameDay(normalizedDate, today);

                      if (isToday) {
                        return Center(
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              Container(
                                width: cellWidth + 12.w,
                                height: cellWidth + 12.w,
                                decoration: BoxDecoration(
                                  color: AppTheme.surface,
                                  borderRadius: BorderRadius.circular((cellWidth + 12.w) / 2),
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppTheme.shadow.withOpacity(0.15),
                                      blurRadius: 18.r,
                                      offset: Offset(0, 8.h),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                width: cellWidth + 6.w,
                                height: cellWidth + 6.w,
                                decoration: BoxDecoration(
                                  color: Colors.transparent,
                                  borderRadius: BorderRadius.circular((cellWidth + 6.w) / 2),
                                  border: Border.all(color: AppTheme.heatHigh, width: 2.5.w),
                                ),
                              ),
                              Container(
                                width: cellWidth,
                                height: cellWidth,
                                decoration: BoxDecoration(
                                  color: color,
                                  borderRadius: BorderRadius.circular(10.r),
                                ),
                              ),
                            ],
                          ),
                        );
                      }

                      return Container(
                        width: cellWidth,
                        height: cellWidth,
                        decoration: BoxDecoration(
                          color: color,
                          borderRadius: BorderRadius.circular(10.r),
                        ),
                      );
                    },
                  ),
                );
              }

              if (needsScroll) {
                return Column(
                  children: [
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      child: Padding(
                        padding: EdgeInsets.only(right: 8.w),
                        child: buildWeekdayLabels(),
                      ),
                    ),
                    SizedBox(height: 12.h),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      child: Padding(
                        padding: EdgeInsets.only(right: 8.w),
                        child: buildGrid(),
                      ),
                    ),
                  ],
                );
              }

              return Column(
                children: [
                  buildWeekdayLabels(),
                  SizedBox(height: 12.h),
                  buildGrid(),
                ],
              );
            }),
          ),
        ),

        SizedBox(height: 16.h),

        Row(
          children: [
            Text(
              'Less',
              style: TextStyle(fontSize: 12.sp, color: AppTheme.textSecondary),
            ),
            SizedBox(width: 8.w),
            _legendItem(AppTheme.heatLow),
            _legendItem(AppTheme.heatMedium),
            _legendItem(AppTheme.heatHigh),
            SizedBox(width: 8.w),
            Text(
              'More',
              style: TextStyle(fontSize: 12.sp, color: AppTheme.textSecondary),
            ),
          ],
        ),
      ],
    );
  }

  Widget _legendItem(Color color) {
    return Container(
      margin: EdgeInsets.symmetric(horizontal: 3.w),
      width: 14.w,
      height: 14.w,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(4.r),
      ),
    );
  }
}