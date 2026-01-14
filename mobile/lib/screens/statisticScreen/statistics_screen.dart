import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/completion_trend_card.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/consistency_heatmap.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/filter_tabs.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/header.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/summary_card.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/tasks_item.dart';

class StatisticScreen extends StatelessWidget {
  const StatisticScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ========== Header Section ==========
              StatisticsHeader(),
              const SizedBox(height: 24),
              // ========== Filter Section ==========
              FilterTabs(),

              const SizedBox(height: 24),
              // ========== Progress Overview Cards ==========
              SummaryCards(),
              const SizedBox(height: 32),

              //========== Completion Trend Chart ==========
              CompletionTrendCard(),

              const SizedBox(height: 24),
              // Consistency Heatmap
              ConsistencyHeatmap(),
              const SizedBox(height: 32),
              const Text(
                'Top Performing',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),

              // ========== Top Performing Tasks ==========
              TasksItem(),
            ],
          ),
        ),
      ),
    );
  }
}
