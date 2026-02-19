import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:habit_tracker/screens/statisticScreen/data/models/chart_data_model.dart';

class ConsistencyHeatmap extends StatelessWidget {
  const ConsistencyHeatmap({super.key, required List<DailyConsistency> data});

  // sample dataset (date-only keys)
  Map<DateTime, int> _sampleDatasets() {
    DateTime now = DateTime.now();
    DateTime d(int days) => DateTime(now.year, now.month, now.day)
        .subtract(Duration(days: days));

    return {
      d(1): 3,
      d(2): 2,
      d(3): 4,
      d(4): 1,
      d(5): 3,
      d(6): 2,
      // add more values as needed...
    };
  }

  bool _isSameDay(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;

  Color _colorForValue(int? value) {
    if (value == null || value <= 0) return AppTheme.heatEmpty;
    if (value == 1) return AppTheme.heatLow;
    if (value == 2) return AppTheme.heatMedium;
    return AppTheme.heatHigh; // 3 or more
  }

  @override
  Widget build(BuildContext context) {
    final outerPadding = 16.w;
    final cardRadius = 20.r;

    // date range - last 30 days
    final endDate = DateTime.now();
    final startDate = DateTime(
      endDate.year,
      endDate.month,
      endDate.day,
    ).subtract(const Duration(days: 30));

    final datasets = <DateTime, int>{};
    _sampleDatasets().forEach((k, v) {
      final key = DateTime(k.year, k.month, k.day);
      datasets[key] = v;
    });

    // build list of dates between start and end (inclusive)
    final totalDays = endDate.difference(startDate).inDays + 1;
    final List<DateTime> days = List.generate(
      totalDays,
          (i) => DateTime(startDate.year, startDate.month, startDate.day)
          .add(Duration(days: i)),
    );

    // align to Monday-first columns (M T W T F S S)
    final padLeading = startDate.weekday - 1; // 0 if Monday, 6 if Sunday
    final totalCells =
        ((padLeading + days.length + 6) / 7).floor() * 7; // round up to weeks

    final weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return  Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title
          Text(
            'Consistency',
            style: TextStyle(
              fontSize: 20.sp,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
            ),
          ),

          SizedBox(height: 8.h),

          // Inner white card (rounded) like the design
          ClipRRect(
            borderRadius: BorderRadius.circular(18.r),
            child: Container(
              width: double.infinity,
              padding: EdgeInsets.symmetric(
                horizontal: 18.w,
                vertical: 14.h,
              ),
              color: Colors.white,
              child: LayoutBuilder(builder: (context, constraints) {
                // Determine available width inside the inner white card
                final availableWidth = constraints.maxWidth;

                // spacing between cells
                final spacing = 10.w;

                // desired minimum cell size (responsive)
                final minCell = 34.w;

                // compute required width to show 7 columns without scrolling
                final requiredWidthNoScroll =
                    (minCell * 7) + (spacing * 6); // 7 cells + 6 gaps

                final bool needsScroll = availableWidth < requiredWidthNoScroll;

                // cellWidth we'll use for rendering columns
                final cellWidth = needsScroll
                    ? minCell
                    : (availableWidth - (spacing * 6)) / 7;

                // width of the grid: either available (fits) or requiredWidthNoScroll (scrollable)
                final gridTotalWidth =
                needsScroll ? requiredWidthNoScroll : availableWidth;

                // helper to build weekday labels sized to cellWidth
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

                // build the grid (wrapped in SizedBox to control width when scrollable)
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
                        final bool isEmptyCell =
                            (cellDateIndex < 0) || (cellDateIndex >= days.length);

                        if (isEmptyCell) {
                          // placeholder/empty cell
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
                        final normalizedDate =
                        DateTime(date.year, date.month, date.day);
                        final value = datasets[normalizedDate];
                        final color = _colorForValue(value);

                        final today = DateTime.now();
                        final isToday = _isSameDay(normalizedDate, today);

                        if (isToday) {
                          // selected/today cell with white ring + accent stroke + shadow
                          return Center(
                            child: Stack(
                              alignment: Alignment.center,
                              children: [
                                // outer white ring + shadow
                                Container(
                                  width: cellWidth + 12.w,
                                  height: cellWidth + 12.w,
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(
                                        (cellWidth + 12.w) / 2),
                                    boxShadow: [
                                      BoxShadow(
                                        color: AppTheme.shadow.withOpacity(0.15),
                                        blurRadius: 18.r,
                                        offset: Offset(0, 8.h),
                                      ),
                                    ],
                                  ),
                                ),

                                // inner accent stroke ring
                                Container(
                                  width: cellWidth + 6.w,
                                  height: cellWidth + 6.w,
                                  decoration: BoxDecoration(
                                    color: Colors.transparent,
                                    borderRadius: BorderRadius.circular(
                                        (cellWidth + 6.w) / 2),
                                    border: Border.all(
                                      color: AppTheme.heatHigh,
                                      width: 2.5.w,
                                    ),
                                  ),
                                ),

                                // actual colored square
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

                        // Normal day cell
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

                // If we need horizontal scrolling, wrap labels + grid in SingleChildScrollView
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

                // otherwise render labels + grid normally (no horizontal scrolling)
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

          // Legend row (Less ... More)
          Row(
            children: [
              Text(
                'Less',
                style: TextStyle(
                  fontSize: 12.sp,
                  color: AppTheme.textSecondary,
                ),
              ),
              SizedBox(width: 8.w),
              _legendItem(AppTheme.heatLow),
              _legendItem(AppTheme.heatMedium),
              _legendItem(AppTheme.heatHigh),
              SizedBox(width: 8.w),
              Text(
                'More',
                style: TextStyle(
                  fontSize: 12.sp,
                  color: AppTheme.textSecondary,
                ),
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