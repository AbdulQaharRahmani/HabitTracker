// TODO: implement later
import 'package:flutter/material.dart';
import 'package:habit_tracker/screans/habitPage/habits_screen.dart';
import 'package:habit_tracker/screans/settingPage/setting_screen.dart';
import 'package:habit_tracker/screans/statisticPage/statistics_screen.dart';
import 'package:habit_tracker/screans/taskPage/tasks_screen.dart';
import 'package:habit_tracker/screans/todayPage/today_screen.dart';
import 'package:persistent_bottom_nav_bar/persistent_bottom_nav_bar.dart';

const Color kPrimaryColor=Color(0xff6366f1);
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
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
      TasksScreen(),
      StatisticsScreen(),
      SettingScreen()
    ];
  }

  List<PersistentBottomNavBarItem> _navBarsItems() {
    return [
      PersistentBottomNavBarItem(
        icon: Icon(Icons.calendar_today_outlined),
        title: "Today",
        activeColorPrimary: kPrimaryColor,
        inactiveColorPrimary: Colors.grey,
      ),
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.list),
        title: "Habits",
        activeColorPrimary:kPrimaryColor,
        inactiveColorPrimary: Colors.grey,
      ),
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.task_sharp),
        title: "Tasks",
        activeColorPrimary:kPrimaryColor,
        inactiveColorPrimary: Colors.grey,
      ),
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.analytics_outlined),
        title: "Statistics",
        activeColorPrimary:kPrimaryColor,
        inactiveColorPrimary: Colors.grey,
      ),
      PersistentBottomNavBarItem(
        icon: const Icon(Icons.settings),
        title: "Setting",
        activeColorPrimary:kPrimaryColor,
        inactiveColorPrimary: Colors.grey,
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return PersistentTabView(padding: EdgeInsets.only(top: 8),
      context,
      controller: _controller,
      screens: _buildScreens(),
      items: _navBarsItems(),
      navBarStyle: NavBarStyle.style6,
      backgroundColor: Colors.white,
      resizeToAvoidBottomInset: true,
      handleAndroidBackButtonPress: true,
      stateManagement: true,

      decoration: NavBarDecoration(
        borderRadius: BorderRadius.circular(0),
      ),
    );
  }
}

class SimpleScreen extends StatelessWidget {
  final String title;
  final Color color;

  const SimpleScreen({super.key, required this.title, required this.color});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: color,
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Text(
          title,
          style: const TextStyle(fontSize: 28, color: Colors.white),
        ),
      ),
    );
  }
}
