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
    Provider.of<ThemeProvider>(context);

    final statisticProv = Provider.of<StatisticProvider>(context);
    final consistencyProv = Provider.of<ConsistencyProvider>(context);

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () => statisticProv.refreshAllScreenData(consistencyProv),
          child: ListView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            children: [
              _buildHeroHeader(),
              const SizedBox(height: 14),
              const StatisticsHeader(),
              const SizedBox(height: 16),

              _buildSectionCard(
                title: 'Overview',
                subtitle: 'Your habit performance at a glance',
                icon: Icons.insights_outlined,
                child: statisticProv.isLoading
                    ? const ShimmerSummaryCards()
                    : statisticProv.error != null
                    ? ErrorView(
                        errorMessage: statisticProv.error!,
                        onRetry: () => statisticProv.fetchAllData(),
                      )
                    : statisticProv.summary != null
                    ? SummaryCards(summary: statisticProv.summary!)
                    : const SizedBox.shrink(),
              ),

              const SizedBox(height: 14),

              _buildSectionCard(
                title: 'Trend',
                subtitle: 'Completion changes over time',
                icon: Icons.show_chart_rounded,
                child: statisticProv.isLoading
                    ? const ShimmerChart()
                    : statisticProv.error == null && statisticProv.chartData != null
                    ? CompletionTrendCard(chartData: statisticProv.chartData!)
                    : const SizedBox.shrink(),
              ),

              const SizedBox(height: 14),

              _buildSectionCard(
                title: 'Consistency',
                subtitle: 'Your activity map by day',
                icon: Icons.grid_view_rounded,
                child: consistencyProv.isLoading
                    ? const ShimmerHeatmap()
                    : consistencyProv.error != null
                    ? ErrorView(
                        errorMessage: consistencyProv.error!,
                        onRetry: () => consistencyProv.fetchConsistency(),
                      )
                    : consistencyProv.data != null
                    ? ProfessionalHeatmap(data: consistencyProv.data!)
                    : const SizedBox.shrink(),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeroHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.primary.withValues(alpha: 0.9),
            AppTheme.primary.withValues(alpha: 0.7),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: AppTheme.primary.withValues(alpha: 0.18),
            blurRadius: 14,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.analytics_outlined, color: Colors.white),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Statistics Dashboard',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 17,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'Track streaks, completion trends and consistency',
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.9),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Widget child,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.border),
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
          Row(
            children: [
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: AppTheme.primary, size: 18),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        color: AppTheme.textPrimary,
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: TextStyle(
                        color: AppTheme.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}
