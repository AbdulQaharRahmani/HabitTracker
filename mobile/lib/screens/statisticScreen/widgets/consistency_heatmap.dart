import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';

class ConsistencyHeatmap extends StatelessWidget {
  const ConsistencyHeatmap({super.key});

  @override
  Widget build(BuildContext context) {
    return _buildConsistencyHeatmap();
  }

  Widget _buildConsistencyHeatmap() {
    final weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Consistency',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
        const SizedBox(height: 20),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.surface,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: AppTheme.shadow,
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Week Days Header
              Row(
                children: [
                  const SizedBox(width: 40),
                  ...weekDays
                      .map(
                        (day) => Expanded(
                      child: Center(
                        child: Text(
                          day,
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.textSecondary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  )
                      .toList(),
                ],
              ),
              const SizedBox(height: 12),

              // Heatmap Grid with Week Numbers
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Week Numbers Column
                  Column(
                    children: List.generate(4, (weekIndex) {
                      return Container(
                        height: 30,
                        width: 30,
                        margin: const EdgeInsets.only(bottom: 8),
                        alignment: Alignment.center,
                        child: Text(
                          'W${weekIndex + 1}',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.textSecondary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(width: 8),

                  // Heatmap Cells
                  Expanded(
                    child: GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      gridDelegate:
                      const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 7,
                        mainAxisSpacing: 8,
                        crossAxisSpacing: 8,
                        childAspectRatio: 1,
                      ),
                      itemCount: 28,
                      itemBuilder: (context, index) {
                        final week = index ~/ 7;
                        final day = index % 7;

                        int activityLevel = 0;
                        if (week == 0 && day < 3) activityLevel = 1;
                        if (week == 1 && day < 5) activityLevel = 2;
                        if (week == 2 && day < 6) activityLevel = 3;
                        if (week == 3 && day < 4) activityLevel = 4;

                        final isToday = (week == 3 && day == 6); // Last cell

                        return Container(
                          decoration: BoxDecoration(
                            color: _getActivityColor(activityLevel),
                            borderRadius: BorderRadius.circular(6),
                            border: isToday
                                ? Border.all(
                              color: AppTheme.primary,
                              width: 2,
                            )
                                : null,
                          ),
                          child: isToday
                              ? Center(
                            child: Container(
                              width: 6,
                              height: 6,
                              decoration:  BoxDecoration(
                                color: AppTheme.primary,
                                shape: BoxShape.circle,
                              ),
                            ),
                          )
                              : null,
                        );
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Legend
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Less',
                    style: TextStyle(fontSize: 10, color: AppTheme.textSecondary),
                  ),
                  const SizedBox(width: 8),
                  ...List.generate(5, (index) {
                    return Container(
                      margin: const EdgeInsets.symmetric(horizontal: 2),
                      width: 16,
                      height: 16,
                      decoration: BoxDecoration(
                        color: _getActivityColor(index),
                        borderRadius: BorderRadius.circular(4),
                      ),
                    );
                  }),
                  const SizedBox(width: 8),
                  Text(
                    'More',
                    style: TextStyle(fontSize: 10, color: AppTheme.textSecondary),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Color _getActivityColor(int level) {
    switch (level) {
      case 0:
        return AppTheme.heatEmpty;
      case 1:
        return AppTheme.heatLow;
      case 2:
        return AppTheme.heatMedium;
      case 3:
        return AppTheme.heatHigh;
      case 4:
        return AppTheme.primary;
      default:
        return AppTheme.primary;
    }
  }
}