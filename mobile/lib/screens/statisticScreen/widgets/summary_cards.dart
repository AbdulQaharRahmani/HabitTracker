import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/theme_provider.dart'; // Adjust the import path based on your project structure
import '../data/models/dashboard_summary_model.dart';
import 'summary_card.dart';

class SummaryCards extends StatelessWidget {
  final DashboardSummaryModel summary;

  const SummaryCards({super.key, required this.summary});

  @override
  Widget build(BuildContext context) {
    // Access the current theme from ThemeProvider to ensure reactivity
    final themeProv = Provider.of<ThemeProvider>(context);
    final theme = themeProv.currentTheme;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Total Habits Card
        SummaryCard(
          title: 'Habits',
          value: summary.totalHabits.toString(),
          icon: Icons.checklist_outlined,
          iconColor: Colors.brown,
        ),
        // Current Streak Card
        SummaryCard(
          title: 'Streak',
          value: summary.currentStreak.toString(),
          icon: Icons.local_fire_department,
          iconColor: Colors.red,
        ),
        // Completion Rate Card
        SummaryCard(
          title: 'Rate',
          value: "${summary.completionRate.toStringAsFixed(0)}%",
          icon: Icons.percent,
          iconColor: Colors.deepPurple,
        ),
      ],
    );
  }
}