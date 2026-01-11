import 'package:flutter/material.dart';
import 'habit.dart';

class TasksCard extends StatelessWidget {
  final List<Habit> habits;

  const TasksCard({super.key, required this.habits});

  @override
  Widget build(BuildContext context) {
    final activeHabits = habits.where((h) => !h.isCompleted).toList();
    final completedHabits = habits.where((h) => h.isCompleted).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Active Tasks
        ListView.builder(
          itemCount: activeHabits.length,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemBuilder: (context, index) {
            return _buildHabitCard(activeHabits[index]);
          },
        ),

        // Completed Tasks
        if (completedHabits.isNotEmpty)
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Text(
                  "Completed Tasks",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,
                  ),
                ),
              ),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: completedHabits.length,
                itemBuilder: (context, index) {
                  return _buildHabitCard(
                    completedHabits[index],
                    isCompleted: true,
                  );
                },
              ),
            ],
          ),
      ],
    );
  }
}

Widget _buildHabitCard(Habit habit, {bool isCompleted = false}) {
  return Card(
    color: isCompleted ? Colors.grey.shade200 : Colors.white,
    elevation: 0,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(25),
    ),
    margin: const EdgeInsets.fromLTRB(21, 0, 21, 10),
    child: Padding(
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          const Icon(Icons.task_alt, color: Colors.blue),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  habit.title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: isCompleted ? Colors.grey : Colors.black,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  habit.description,
                  style: TextStyle(
                    fontSize: 14,
                    color: isCompleted ? Colors.grey : Colors.black87,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ),
  );
}
