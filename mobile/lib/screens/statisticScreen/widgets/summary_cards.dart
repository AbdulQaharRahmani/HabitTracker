import 'package:flutter/material.dart';
import '../data/models/dashboard_summary_model.dart';
import 'summary_card.dart';

class SummaryCards extends StatelessWidget {
  final DashboardSummaryModel summary;

  const SummaryCards({super.key, required this.summary});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        SummaryCard(
          title: 'Habits',
          value: summary.totalHabits.toString(),
          icon: Icons.checklist_outlined,
          iconColor: Colors.brown,
        ),
        SummaryCard(
          title: 'Streak',
          value: summary.currentStreak.toString(),
          icon: Icons.local_fire_department,
          iconColor: Colors.red,
        ),
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





// class SummaryCards extends ConsumerWidget {
//   const SummaryCards({super.key});
//
//   @override
//   Widget build(BuildContext context, WidgetRef ref) {
//     final dashboardAsync = ref.watch(dashboardSummaryProvider);
//
//     return dashboardAsync.when(
//       data: (summary) {
//         return Row(
//           mainAxisAlignment: MainAxisAlignment.spaceBetween,
//           children: [
//             SummaryCard(
//               title: 'Habits',
//               value: summary.totalHabits.toString(),
//               icon: Icons.checklist_outlined,
//               iconColor: Colors.brown,
//             ),
//             SummaryCard(
//               title: 'Streak',
//               value: summary.currentStreak.toString(),
//               icon: Icons.local_fire_department,
//               iconColor: Colors.red,
//             ),
//             SummaryCard(
//               title: 'Rate',
//               value: "${summary.completionRate.toStringAsFixed(0)}%",
//               icon: Icons.percent,
//               iconColor: Colors.deepPurple,
//             ),
//           ],
//         );
//       },
//       loading: () => const Center(child: CircularProgressIndicator()),
//       error: (err, _) => Text('Error loading summary: $err'),
//     );
//   }
// }
