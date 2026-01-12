import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CompletionTrend extends StatelessWidget {
  const CompletionTrend({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 280.h,
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20.r),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Completion Trend',
            style: TextStyle(
              fontSize: 18.sp,
              fontWeight: FontWeight.w700,
            ),
          ),
          SizedBox(height: 6.h),
          Text(
            'Task consistency over time',
            style: TextStyle(
              fontSize: 12.sp,
              color: Colors.grey.shade600,
            ),
          ),
          SizedBox(height: 20.h),
          Expanded(child: TrendChart()),
        ],
      ),
    );
  }
}

class TrendChart extends StatelessWidget {
  TrendChart({super.key});

  /// X = روز واقعی ماه
  final List<FlSpot> spots = const [
    FlSpot(1, 25),
    FlSpot(5, 45),
    FlSpot(10, 40),
    FlSpot(15, 60),
    FlSpot(18, 55),
    FlSpot(20, 75),
    FlSpot(23, 80),
    FlSpot(25, 70),
    FlSpot(27, 90),
    FlSpot(30, 100),
  ];

  /// لیبل فقط برای روزهای مهم
  final Map<int, String> dayLabels = const {
    1: 'Nov 1',
    5: 'Nov 5',
    10: 'Nov 10',
    15: 'Nov 15',
    18: 'Nov 18',
    20: 'Nov 20',
    23: 'Nov 23',
    25: 'Nov 25',
    27: 'Nov 27',
    30: 'Today',
  };

  @override
  Widget build(BuildContext context) {
    return LineChart(

      // LineChartData(
      //   /// محدوده واقعی روزهای ماه
      //   minX: 1,
      //   maxX: 30,
      //   minY: 0,
      //   maxY: 100,
      //   clipData: FlClipData.all(),
      //
      //   /// GRID
      //   gridData: FlGridData(
      //     show: true,
      //     drawVerticalLine: false,
      //     horizontalInterval: 25,
      //     getDrawingHorizontalLine: (value) => FlLine(
      //       color: Colors.grey.withOpacity(0.25),
      //       strokeWidth: 1,
      //     ),
      //   ),
      //
      //   /// AXES
      //   titlesData: FlTitlesData(
      //     leftTitles: AxisTitles(
      //       sideTitles: SideTitles(showTitles: false),
      //     ),
      //     rightTitles: AxisTitles(
      //       sideTitles: SideTitles(showTitles: false),
      //     ),
      //     topTitles: AxisTitles(
      //       sideTitles: SideTitles(showTitles: false),
      //     ),
      //     bottomTitles: AxisTitles(
      //       sideTitles: SideTitles(
      //         showTitles: true,
      //         interval: 1, // واحد = روز
      //         reservedSize: 36,
      //         getTitlesWidget: (value, meta) {
      //           final day = value.toInt();
      //
      //           if (!dayLabels.containsKey(day)) {
      //             return const SizedBox.shrink();
      //           }
      //
      //           return SideTitleWidget(
      //             axisSide: meta.axisSide,
      //             space: 10,
      //             child: Text(
      //               dayLabels[day]!,
      //               style: const TextStyle(
      //                 fontSize: 12,
      //                 color: Colors.black54,
      //                 fontWeight: FontWeight.w500,
      //               ),
      //             ),
      //           );
      //         },
      //       ),
      //     ),
      //   ),
      //
      //   borderData: FlBorderData(show: false),
      //
      //   /// LINE
      //   lineBarsData: [
      //     LineChartBarData(
      //       spots: spots,
      //       isCurved: true,
      //       color: Colors.blue,
      //       barWidth: 3,
      //       isStrokeCapRound: true,
      //       dotData: FlDotData(show: false),
      //
      //       /// GRADIENT AREA
      //       belowBarData: BarAreaData(
      //         show: true,
      //         gradient: LinearGradient(
      //           begin: Alignment.topCenter,
      //           end: Alignment.bottomCenter,
      //           colors: [
      //             Colors.blue.withOpacity(0.35),
      //             Colors.blue.withOpacity(0.05),
      //           ],
      //         ),
      //       ),
      //     ),
      //   ],

      //   lineTouchData: LineTouchData(enabled: false),
      // ),
    );
  }
}