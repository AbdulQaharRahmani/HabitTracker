import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/completion_trend_card.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/consistency_heatmap.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/filter_tabs.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/header.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/summary_card.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/tasks_item.dart';

import 'data/providers/statistic_provider.dart';

class StatisticScreen extends ConsumerWidget {
  const StatisticScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ===== Watch Providers =====
    final dashboardAsync = ref.watch(dashboardSummaryProvider);
    final chartAsync = ref.watch(chartDataProvider);
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
              dashboardAsync.when(
                data: (summary) => SummaryCards(summary: summary),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (err, _) => Text('Error loading summary: $err'),
              ),
              const SizedBox(height: 32),

              //========== Completion Trend Chart ==========
            chartAsync.when(
              data: (chartData) => CompletionTrendCard(chartData: chartData),
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, _) => Text('Error loading chart: $err'),
            ),

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
