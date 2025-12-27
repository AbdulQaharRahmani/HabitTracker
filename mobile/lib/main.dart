import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/screans/add_habit.dart';
import 'app/app_theme.dart';
import 'features/add_habit_model.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // Initialize ScreenUtil for responsive sizing.
  // Use a designSize that matches your UI design (example: iPhone 12/13 size).
  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(390, 844),
      minTextAdapt: true,
      builder: (context, child) {
        return MaterialApp(
          title: 'Habit Tracker',
          debugShowCheckedModeBanner: false,
          theme: AppTheme.lightTheme,
          home: const Home(),
        );
      },
    );
  }
}

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  void _openAddHabitDialog() {
    AddHabitDialog.show(
      context,
      onSubmit: (HabitData data) {
        // handle saved habit (persist, update state, etc.)
        debugPrint('Saved habit: ${data.title} • ${data.frequency} • ${data.category}');
        // Example: show a snackbar
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Saved: "${data.title}"'),
            backgroundColor: AppTheme.successBackground,
            behavior: SnackBarBehavior.floating,
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        title: const Text('Habits'),
      ),
      body: const Center(
        child: Text('Tap + to add a new habit'),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppTheme.fabBackground,
        foregroundColor: AppTheme.fabIcon,
        onPressed: _openAddHabitDialog,
        child: const Icon(Icons.add),
      ),
    );
  }
}