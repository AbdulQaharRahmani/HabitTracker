import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/completion_chart.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/consistency_grid.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/filter_tabs.dart';
import 'package:habit_tracker/screens/statisticScreen/widgets/top_performing_card.dart';

import 'widgets/header.dart';
import 'widgets/summary_card.dart';

class StatisticsScreen extends StatelessWidget {
  const StatisticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(20.w),
          child: const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              StatisticsHeader(),
              SizedBox(height: 20),
              FilterTabs(),
              SizedBox(height: 20),
              SummaryCards(),
              SizedBox(height: 20),
              CompletionTrend(),
              SizedBox(height: 24),
              ConsistencySection(),
              SizedBox(height: 24),
              TopPerformingSection(),
            ],
          ),
        ),
      ),
    );
  }
}
