import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/completion_trend_card.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/consistency_heatmap.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/header.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/shemer_summary_cards.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/shimmer_chart.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/summary_cards.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/tasks_item.dart';
import 'data/providers/consistency_provider.dart';
import 'data/providers/statistic_provider.dart';

class StatisticScreen extends ConsumerWidget {
  const StatisticScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final summaryAsync = ref.watch(summaryProvider);
    final chartAsync = ref.watch(chartProvider);
    final consistencyAsync = ref.watch(consistencyDataProvider);

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(summaryProvider);
            ref.read(chartProvider.notifier).reloadChart();
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                StatisticsHeader(),
                // const SizedBox(height: 24),
                // FilterTabs(),
                const SizedBox(height: 20),

                // Summary
                summaryAsync.when(
                  data: (summary) => SummaryCards(summary: summary),
                  loading: () => const ShimmerSummaryCards(),
                  error: (err, _) => Text("Error: $err"),
                ),

                const SizedBox(height: 15),

                // Chart
                chartAsync.when(
                  data: (chartData) =>
                      CompletionTrendCard(chartData: chartData),
                  loading: () => const ShimmerChart(),
                  error: (err, _) => Text("Error: $err"),
                ),

                const SizedBox(height: 20),

                consistencyAsync.when(
                  data: (data) => ProfessionalHeatmap(data: data),
                  loading: () => const CircularProgressIndicator(),
                  error: (err, _) => Text("Error: $err"),
                ),

                const SizedBox(height: 20),

                const Text(
                  'Top Performing',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),

                const SizedBox(height: 16),

                TasksItem(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
