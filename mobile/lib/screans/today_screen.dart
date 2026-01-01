import 'package:flutter/material.dart';
import '../app/app_theme.dart';
import '../utils/today_progressBar/categories.dart';
import '../utils/today_progressBar/date_selector.dart';
import '../utils/today_progressBar/daily_grid.dart';
import '../utils/today_progressBar/header_section.dart';
import '../utils/today_progressBar/task.dart';
import '../utils/today_progressBar/task_item.dart';
import '../utils/today_progressBar/top_bar.dart';

class TodayScreen extends StatefulWidget {
  const TodayScreen({super.key});

  @override
  State<TodayScreen> createState() => _TodayScreenState();
}

class _TodayScreenState extends State<TodayScreen> {
  DateTime selectedDate = DateTime.now();

  List<DateTime> get weekDates {
    final start = selectedDate.subtract(
      Duration(days: selectedDate.weekday - 1),
    );
    return List.generate(7, (i) => start.add(Duration(days: i)));
  }

  Future<void> pickDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );

    if (date != null) {
      setState(() => selectedDate = date);
    }
  }

  // ------------------- Sample Tasks -------------------
  final List<TaskItem> morningTasks = [
    TaskItem(
      title: 'Drink Water',
      time: '7:00 AM',
      category: 'Health',
      done: true,
    ),
    TaskItem(
      title: 'Meditation',
      time: '8:00 AM',
      category: 'Health',
      done: false,
    ),
  ];

  final List<TaskItem> workTasks = [
    TaskItem(
      title: 'Finish Report',
      time: '10:30 AM',
      category: 'Work',
      done: false,
    ),
    TaskItem(
      title: 'Email Follow-up',
      time: '2:00 PM',
      category: 'Work',
      done: false,
    ),
  ];

  final List<TaskItem> eveningTasks = [
    TaskItem(
      title: 'Read 20 pages',
      time: '9:00 PM',
      category: 'Study',
      done: false,
    ),
  ];

  late Map<String, List<TaskItem>> dailySections;

  @override
  void initState() {
    super.initState();
    dailySections = {
      'MORNING ROUTINE': morningTasks,
      'WORK & FOCUS': workTasks,
      'EVENING WIND DOWN': eveningTasks,
    };
  }

  @override
  Widget build(BuildContext context) {
    // Calculate completed and total tasks
    int totalTasks = dailySections.values.fold(
      0,
      (sum, list) => sum + list.length,
    );
    int completedTasks = dailySections.values.fold(
      0,
      (sum, list) => sum + list.where((t) => t.done).length,
    );

    return Scaffold(
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppTheme.primary,

        onPressed: () {
          //  add new habit/task.
        },
        child: const Icon(Icons.add, color: AppTheme.textWhite),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TopBar(onPickDate: pickDate, selectedDate: selectedDate),
              const SizedBox(height: 16),
              DateSelector(
                weekDates: weekDates,
                selectedDate: selectedDate,
                onDateSelected: (date) {
                  setState(() => selectedDate = date);
                },
              ),
              // const SizedBox(height: 12),
              // if we need categories we can add
              // categories(),
              const SizedBox(height: 16),
              dailyGoalCard(
                completed: completedTasks,
                total: totalTasks,
                progress: totalTasks == 0 ? 0 : completedTasks / totalTasks,
                streakDays: 12,
                //  Replace with backend value
              ),
              const SizedBox(height: 16),
              Expanded(
                child: ListView(
                  children: dailySections.entries.map((entry) {
                    Icon sectionIcon;
                    // Assign icons based on section
                    switch (entry.key) {
                      case 'MORNING ROUTINE':
                        sectionIcon =  Icon(Icons.sunny,color: AppTheme.warning,);
                        break;
                      case 'WORK & FOCUS':
                        sectionIcon =  Icon(Icons.work,color: AppTheme.primary);
                        break;
                      case 'EVENING WIND DOWN':
                        sectionIcon =  Icon(Icons.nightlight_round,color: AppTheme.warning);
                        break;
                      default:
                        sectionIcon =  Icon(Icons.task,color: AppTheme.success);
                    }
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SectionHeader(
                          title: entry.key,
                          icon: sectionIcon,
                        ),
                        const SizedBox(height: 8),
                        ...entry.value.map((task) {
                          return TaskCard(
                            item: task,
                            onToggleDone: (done) {
                              setState(() {
                                task.done = done;
                                // send update to backend
                              });
                            },
                          );
                        }).toList(),
                        const SizedBox(height: 16),
                      ],
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
