import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';

class TasksItem extends StatelessWidget {
  const TasksItem({super.key});

  @override
  Widget build(BuildContext context) {
    return _buildTopPerforming();
  }
}

Widget _buildTopPerforming() {
  final habits = [
    {
      'name': 'Morning Jog',
      'category': 'HEALTH',
      'percentage': 95,
      'color': AppTheme.success,
      'icon': Icons.directions_run,
    },
    {
      'name': 'Read 10 pages',
      'category': 'LEARNING',
      'percentage': 80,
      'color': AppTheme.primary,
      'icon': Icons.menu_book,
    },
    {
      'name': 'Drink Water',
      'category': 'HEALTH',
      'percentage': 75,
      'color': AppTheme.productivityText,
      'icon': Icons.water_drop,
    },
  ];

  return Column(
    children: habits
        .map(
          (habit) => Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: _buildHabitItem(
          name: habit['name'] as String,
          category: habit['category'] as String,
          percentage: habit['percentage'] as int,
          color: habit['color'] as Color,
          icon: habit['icon'] as IconData,
        ),
      ),
    )
        .toList(),
  );
}

Widget _buildHabitItem({
  required String name,
  required String category,
  required int percentage,
  required Color color,
  required IconData icon,
}) {
  return Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: AppTheme.surface,
      borderRadius: BorderRadius.circular(16),
      boxShadow: [
        BoxShadow(
          color: AppTheme.shadow,
          blurRadius: 10,
          offset: const Offset(0, 4),
        ),
      ],
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        /// --- Top Row (Icon + Text + Percentage) ---
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color),
            ),
            const SizedBox(width: 16),

            // Name & Category
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      category,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: color,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Percentage
            Text(
              '$percentage%',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
          ],
        ),

        const SizedBox(height: 12),

        /// --- Progress Bar (Bottom) ---
        Container(
          height: 6,
          decoration: BoxDecoration(
            color: AppTheme.progressTrack,
            borderRadius: BorderRadius.circular(3),
          ),
          child: FractionallySizedBox(
            alignment: Alignment.centerLeft,
            widthFactor: percentage / 100,
            child: Container(
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(3),
              ),
            ),
          ),
        ),
      ],
    ),
  );
}