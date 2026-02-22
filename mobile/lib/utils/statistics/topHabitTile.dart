import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:provider/provider.dart';

import '../../providers/theme_provider.dart';

class TopHabitTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final double percent;
  final Color bg;
  final Color textColor;

  const TopHabitTile({
    super.key,
    required this.icon,
    required this.title,
    required this.percent,
    required this.bg,
    required this.textColor,
  });

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(18),
        boxShadow:  [
          BoxShadow(color: AppTheme.shadow, blurRadius: 10),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                backgroundColor: bg,
                child: Icon(icon, color: textColor),
              ),
              const SizedBox(width: 12),
              Expanded(child: Text(title)),
              Text('${(percent * 100).round()}%'),
            ],
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: percent,
            backgroundColor: AppTheme.progressTrack,
            color: AppTheme.progressFill,
            minHeight: 6,
            borderRadius: BorderRadius.circular(10),
          ),
        ],
      ),
    );
  }
}
