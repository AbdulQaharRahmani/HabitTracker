import 'package:flutter/material.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/error_veiw.dart';
import 'package:provider/provider.dart';
import 'package:habit_tracker/app/app_theme.dart';
import '../../../providers/theme_provider.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/completion_trend_card.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/consistency_heatmap.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/header.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/shemer_heatmap.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/shemer_summary_cards.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/shimmer_chart.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/summary_cards.dart';
import 'data/providers/consistency_provider.dart';
import 'data/providers/statistic_provider.dart';

class StatisticScreen extends StatelessWidget {
  const StatisticScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProv = Provider.of<ThemeProvider>(context);
    final theme = themeProv.currentTheme;

    final statisticProv = Provider.of<StatisticProvider>(context);
    final consistencyProv = Provider.of<ConsistencyProvider>(context);

    final bool isGlobalLoading = statisticProv.isLoading ||
        consistencyProv.isLoading;

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () => statisticProv.refreshAllScreenData(consistencyProv),
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const StatisticsHeader(),
                const SizedBox(height: 20),

                //  Dashboard Summary Section
                if (isGlobalLoading)
                  const ShimmerSummaryCards()
                else
                  if (statisticProv.error != null)
                    ErrorView(
                      errorMessage: statisticProv.error!,
                      onRetry: () =>
                          statisticProv.refreshAllScreenData(consistencyProv),
                    )
                  else
                    if (statisticProv.summary != null)
                      SummaryCards(summary: statisticProv.summary!)
                    else
                      const Center(child: Text("No summary data available")),

                const SizedBox(height: 15),

                //  Chart Section
                if (isGlobalLoading)
                  const ShimmerChart()
                else
                  if (statisticProv.error == null &&
                      statisticProv.chartData != null)
                    CompletionTrendCard(chartData: statisticProv.chartData!)
                  else
                    const SizedBox.shrink(),

                const SizedBox(height: 25),

                //  Consistency Section
                Text(
                  'Consistency',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: theme.textTheme.bodyLarge?.color,
                  ),
                ),
                const SizedBox(height: 15),

                if (isGlobalLoading)
                  const ShimmerHeatmap()
                else
                  if (consistencyProv.error != null)
                    ErrorView(
                      errorMessage: consistencyProv.error!,
                      onRetry: () =>
                          statisticProv.refreshAllScreenData(consistencyProv),
                    )
                  else
                    if (consistencyProv.data != null)
                      ProfessionalHeatmap(data: consistencyProv.data!)
                    else
                      const Center(child: Text("No consistency data found")),
              ],
            ),
          ),
        ),
      ),
    );
  }
}