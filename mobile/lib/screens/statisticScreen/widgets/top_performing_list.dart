import 'package:flutter/material.dart';

class TopPerformingList extends StatelessWidget {
  const TopPerformingList({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: const [
        Text(
          "Top Performing",
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        SizedBox(height: 12),
        _HabitTile("Morning Jog", "HEALTH", 0.95, Colors.green),
        _HabitTile("Read 10 pages", "LEARNING", 0.80, Colors.blue),
        _HabitTile("Drink Water", "HEALTH", 0.75, Colors.purple),
      ],
    );
  }
}

class _HabitTile extends StatelessWidget {
  final String title;
  final String tag;
  final double progress;
  final Color color;

  const _HabitTile(this.title, this.tag, this.progress, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// -------- Title + Category ----------
          Row(
            children: [
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 15,
                  ),
                ),
              ),
              _CategoryChip(tag, color),
            ],
          ),

          const SizedBox(height: 12),

          /// -------- Progress ----------
          LinearProgressIndicator(
            value: progress,
            minHeight: 6,
            color: color,
            backgroundColor: color.withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(6),
          ),
        ],
      ),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  final String text;
  final Color color;

  const _CategoryChip(this.text, this.color);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        // borderRadius: BorderRadius.circular(10),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }
}
