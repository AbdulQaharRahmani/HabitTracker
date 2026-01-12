import 'package:flutter/material.dart';
import 'package:habit_tracker/screens/settingScreen/setting_screen.dart';
import 'package:habit_tracker/screens/statisticScreen/statistics_screen.dart';
import 'package:habit_tracker/screens/taskScreen/tasks_screen.dart';
import 'package:habit_tracker/screens/todayScreen/today_screen.dart';
import 'package:persistent_bottom_nav_bar/persistent_bottom_nav_bar.dart';
import '../../app/app_theme.dart';
import '../habitScreen/habits_screen.dart';
import 'package:iconsax/iconsax.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late PersistentTabController _controller;

  @override
  void initState() {
    super.initState();
    _controller = PersistentTabController(initialIndex: 0);
  }

  List<Widget> _buildScreens() {
    return const [
      TodayScreen(),
      HabitsScreen(),
      TasksScreen(
        token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NWJmNzdlYjEzZjMwNjgyMDg1OGI5NCIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE3NjgxMTgwMzUsImV4cCI6MTc2ODIwNDQzNX0.5wFURarfZvj-pw7eBq3FOdxeedL8fUmhzaI6qCVIxwQ",
      ),
      StatisticsScreen(),
      SettingScreen(),
    ];
  }

  List<PersistentBottomNavBarItem> _navBarsItems() {
    return [
      PersistentBottomNavBarItem(
        icon: Icon(Iconsax.calendar_1),
        title: "Today",
        activeColorPrimary: AppTheme.primary,
        inactiveColorPrimary: AppTheme.textMuted,
      ),
      PersistentBottomNavBarItem(
        icon: Icon(Iconsax.add_square),
        title: "Habits",
        activeColorPrimary: AppTheme.primary,
        inactiveColorPrimary: AppTheme.textMuted,
      ),
      PersistentBottomNavBarItem(
        icon: Icon(Iconsax.task_square),
        title: "Tasks",
        activeColorPrimary: AppTheme.primary,
        inactiveColorPrimary: AppTheme.textMuted,
      ),
      PersistentBottomNavBarItem(
        icon: Icon(Iconsax.chart_2),
        title: "Statistics",
        activeColorPrimary: AppTheme.primary,
        inactiveColorPrimary: AppTheme.textMuted,
      ),
      PersistentBottomNavBarItem(
        icon: Icon(Iconsax.setting_2),
        title: "Setting",
        activeColorPrimary: AppTheme.primary,
        inactiveColorPrimary: AppTheme.textMuted,
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return PersistentTabView(
      padding: EdgeInsets.only(top: 8, bottom: 4),
      context,
      controller: _controller,
      screens: _buildScreens(),
      items: _navBarsItems(),
      navBarStyle: NavBarStyle.style6,
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: true,
      handleAndroidBackButtonPress: true,
      stateManagement: true,

      decoration: NavBarDecoration(borderRadius: BorderRadius.circular(0)),
    );
  }
}
