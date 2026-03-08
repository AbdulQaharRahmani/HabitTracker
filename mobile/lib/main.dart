import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/core/error/global_error_handler.dart';
import 'package:habit_tracker/core/theme/app_theme.dart' as core_theme;
import 'package:habit_tracker/providers/theme_provider.dart';
import 'package:habit_tracker/services/habit_reminder_service.dart';
import 'package:provider/provider.dart';
import 'features/routes.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  GlobalErrorHandler.initialize();
  await HabitReminderService.instance.initialize();
  await HabitReminderService.instance.reschedulePersistedReminders();
  runApp(
    ChangeNotifierProvider(
      create: (context) => ThemeProvider(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = context.watch<ThemeProvider>();
    return ScreenUtilInit(
      designSize: const Size(375, 812),
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return MaterialApp(
          theme: core_theme.AppTheme.light(),
          darkTheme: core_theme.AppTheme.dark(),
          themeMode: themeProvider.themeMode,
          initialRoute: AppRoutes.splash,
          routes: AppRoutes.routes,
          debugShowCheckedModeBanner: false,
        );
      },
    );
  }
}
