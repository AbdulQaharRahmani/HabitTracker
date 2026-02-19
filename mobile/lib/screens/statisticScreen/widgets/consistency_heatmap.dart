import 'package:flutter/material.dart';
import '../data/models/daily_consistency.dart';

class ProfessionalHeatmap extends StatefulWidget {
  final List<HabitDay> data;

  const ProfessionalHeatmap({super.key, required this.data});

  @override
  State<ProfessionalHeatmap> createState() => _ProfessionalHeatmapState();
}

class _ProfessionalHeatmapState extends State<ProfessionalHeatmap> {
  late PageController _pageController;
  // LateInitializationError
  late final DateTime now = DateTime.now();

  static const double cellSize = 24;
  static const double cellSpacing = 5;

  late List<int> months;

  @override
  void initState() {
    super.initState();

    months = List.generate(now.month, (index) => index + 1);

    _pageController = PageController(
      initialPage: months.length - 1,
      viewportFraction: 0.85,
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 280,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Row for static Column
          Padding(
            padding: const EdgeInsets.only(top: 30),
            child: _buildWeekDays(),
          ),
          const SizedBox(width: 12),
          // PageView for month
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              itemCount: months.length,
              itemBuilder: (context, index) {
                final month = months[index];
                final monthDays = _generateMonth(now.year, month);
                final weeks = _groupByWeek(monthDays);

                return Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Center(
                        child: Text(
                          "${_monthName(month)} ${now.year}",
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      Expanded(
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: weeks.map((week) {
                            return Padding(
                              padding: const EdgeInsets.only(right: cellSpacing+10),
                              child: Column(
                                children: week.map((day) => _buildCell(day)).toList(),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ],
                  ),
                );

              },
            ),
          ),
        ],
      ),
    );
  }

  List<HabitDay> _generateMonth(int year, int month) {
    final daysInMonth = DateTime(year, month + 1, 0).day;
    List<HabitDay> fullDays = [];

    for (int day = 1; day <= daysInMonth; day++) {
      final date = DateTime(year, month, day);
      final existing = widget.data.firstWhere(
            (d) =>
        d.date.year == date.year &&
            d.date.month == date.month &&
            d.date.day == date.day,
        orElse: () => HabitDay(date: date, completed: 0),
      );
      fullDays.add(existing);
    }
    return fullDays;
  }

  List<List<HabitDay>> _groupByWeek(List<HabitDay> monthDays) {
    List<List<HabitDay>> weeks = [];
    List<HabitDay> currentWeek = [];

    // early month empty days
    int emptyDays = monthDays.first.date.weekday % 7;
    for (int i = 0; i < emptyDays; i++) {
      currentWeek.add(HabitDay(
          date: monthDays.first.date.subtract(Duration(days: emptyDays - i)),
          completed: -1));
    }

    for (var day in monthDays) {
      currentWeek.add(day);
      if (currentWeek.length == 7) {
        weeks.add(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.isNotEmpty) {
      //filling empty days
      while (currentWeek.length < 7) {
        currentWeek.add(HabitDay(
            date: currentWeek.last.date.add(const Duration(days: 1)),
            completed: -1));
      }
      weeks.add(currentWeek);
    }

    return weeks;
  }

  Widget _buildCell(HabitDay day) {
    final isToday = day.date.year == now.year &&
        day.date.month == now.month &&
        day.date.day == now.day;

    return Tooltip(
      message: day.completed >= 0
          ? "${day.date.day}/${day.date.month}/${day.date.year} - Completed: ${day.completed}"
          : "",
      child: Container(
        width: cellSize,
        height: cellSize,
        margin: const EdgeInsets.only(bottom: cellSpacing),
        decoration: BoxDecoration(
          color: _colorScale(day.completed),
          borderRadius: BorderRadius.circular(5),
          border: isToday ? Border.all(color: Colors.black26, width: 1.5) : null,
        ),
      ),
    );
  }

  Widget _buildWeekDays() {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Column(
      children: days
          .map(
            (d) => SizedBox(
          height: cellSize + cellSpacing,
          child: Align(
            alignment: Alignment.centerRight,
            child: Text(
              d,
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ),
        ),
      )
          .toList(),
    );
  }

  Color _colorScale(int value) {
    if (value == -1) return Colors.transparent;
    if (value == 0) return Colors.grey.shade200;
    if (value == 1) return Colors.orange.shade200;
    if (value == 2) return Colors.lightGreen;
    if (value == 3) return Colors.green;
    return Colors.green.shade700;
  }

  String _monthName(int month) {
    const months = [
      '',
      'Jan', 'Feb', 'Mar', 'Apr', 'May',
      'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month];
  }
}
