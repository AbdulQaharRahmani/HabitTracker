import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:shimmer/shimmer.dart';
import '../../app/app_theme.dart';
import '../../utils/today_progressBar/daily_grid.dart';
import '../../utils/today_progressBar/date_selector.dart';
import '../../utils/today_progressBar/header_section.dart';
import '../../utils/today_progressBar/task.dart';
import '../../utils/today_progressBar/top_bar.dart';
import '../../utils/today_progressBar/task_item.dart';
import '../../utils/today_progressBar/auth_service.dart';

class TodayScreen extends StatefulWidget {
  const TodayScreen({super.key});

  @override
  State<TodayScreen> createState() => _TodayScreenState();
}

class _TodayScreenState extends State<TodayScreen> {
  final ApiService _api = ApiService();

  DateTime selectedDate = DateTime.now();
  late DateTime loginDate;
  late List<DateTime> dateRange;

  final ScrollController _dateScrollController = ScrollController();

  Map<String, List<TaskItem>> _habitSections = {};
  Map<String, List<TaskItem>> _taskSections = {};

  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();

    loginDate = DateTime.now().subtract(const Duration(days: 5));

    selectedDate = DateTime.now();

    dateRange = _buildDateRange(loginDate);

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToToday();
    });
    _loadForDate(selectedDate);
  }

  List<DateTime> _buildDateRange(DateTime start) {
    return List.generate(
      31,
          (i) => DateTime(start.year, start.month, start.day + i),
    );
  }
  void _scrollToToday() {
    final todayIndex = dateRange.indexWhere(
          (d) => DateUtils.isSameDay(d, selectedDate),
    );

    if (todayIndex == -1 || !_dateScrollController.hasClients) return;

    final itemWidth = 72.w;
    final screenWidth = MediaQuery.of(context).size.width;

    double offset =
        (todayIndex * itemWidth) - (screenWidth / 2) + (itemWidth / 2);

    offset = offset.clamp(
      0.0,
      _dateScrollController.position.maxScrollExtent,
    );

    _dateScrollController.animateTo(
      offset,
      duration: const Duration(milliseconds: 400),
      curve: Curves.easeOut,
    );
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
      await _loadForDate(date);
    }
  }

  Future<void> _loadForDate(DateTime date) async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final tasks = await _api.fetchTasks(forDate: selectedDate);
      final habits = await _api.fetchHabits(forDate: selectedDate);

      final itemsTasks = tasks.where((t) => t.appliesToDate(date)).toList();
      final itemsHabits = habits.where((h) => h.appliesToDate(date)).toList();

      final Map<String, List<TaskItem>> taskSections = {};
      for (final t in itemsTasks) {
        final key = t.category.toUpperCase();
        taskSections.putIfAbsent(key, () => []);
        taskSections[key]!.add(t);
      }

      final Map<String, List<TaskItem>> habitSections = {};
      for (final h in itemsHabits) {
        final key = h.category.toUpperCase();
        habitSections.putIfAbsent(key, () => []);
        habitSections[key]!.add(h);
      }

      setState(() {
        _taskSections = taskSections;
        _habitSections = habitSections;
      });
    } catch (e) {
      setState(() {
        _error = ' Error while fetching data: $e';
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }
  Future<void> _toggleDone(TaskItem item) async {
    final previous = item.done;

    final success = await _api.setItemCompletion(
      item: item,
      forDate: selectedDate,
    );

    if (success) {
      setState(() {
        item.done = !previous;
      });
    } else {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Error while updating'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Widget _buildSectionList(String title, Map<String, List<TaskItem>> sections) {
    if (sections.isEmpty) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SectionHeader(title: title, icon: const Icon(Icons.list)),
          const SizedBox(height: 8),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 8.0),
            child: Text('No item is here'),
          ),
          const SizedBox(height: 16),
        ],
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHeader(title: title, icon: const Icon(Icons.list)),
        const SizedBox(height: 8),
        ...sections.entries.map((entry) {
          Icon sectionIcon;
          switch (entry.key) {
            case 'HEALTH':
              sectionIcon = const Icon(Icons.favorite, color: AppTheme.error);
              break;
            case 'STUDY':
              sectionIcon = const Icon(Icons.school, color: AppTheme.primary);
              break;
            case 'WORK':
              sectionIcon = const Icon(Icons.work, color: AppTheme.primary);
              break;
            default:
              sectionIcon = const Icon(Icons.task, color: AppTheme.success);
          }

          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  sectionIcon,
                  const SizedBox(width: 8),
                  Text(
                    entry.key,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              ...entry.value.map((item) {
                return TaskCard(
                  item: item,
                  onToggleDone: (_) {
                    _toggleDone(item);
                  },
                );
              }).toList(),
              const SizedBox(height: 12),
            ],
          );
        }).toList(),
        const SizedBox(height: 16),
      ],
    );
  }

  // ---------------- Shimmer placeholders ----------------
  Widget _shimmerBox(
      {double height = 16, double width = double.infinity, BorderRadius? borderRadius}) {
    return Shimmer.fromColors(
      baseColor: AppTheme.shadow,
      highlightColor: AppTheme.textWhite,
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: AppTheme.textPrimary,
          borderRadius: borderRadius ?? BorderRadius.circular(8.r),
        ),
      ),
    );
  }

  Widget _shimmerTaskItem() {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 6.h),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Shimmer.fromColors(
            baseColor:AppTheme.shadow,
            highlightColor: AppTheme.textWhite,
            child: Container(
              width: 42.w,
              height: 42.w,
              decoration: const BoxDecoration(
                color: AppTheme.textPrimary,
                shape: BoxShape.circle,
              ),
            ),
          ),
          SizedBox(width: 12.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _shimmerBox(height: 14.h, width: 0.5.sw, borderRadius: BorderRadius.circular(6.r)),
                SizedBox(height: 8.h),
                Row(
                  children: [
                    _shimmerBox(height: 12.h, width: 60.w, borderRadius: BorderRadius.circular(6.r)),
                    SizedBox(width: 10.w),
                    _shimmerBox(height: 12.h, width: 80.w, borderRadius: BorderRadius.circular(12.r)),
                  ],
                ),
              ],
            ),
          ),
          SizedBox(width: 10.w),
          Shimmer.fromColors(
            baseColor:AppTheme.shadow,
            highlightColor: AppTheme.textWhite,
            child: Container(
              width: 36.w,
              height: 36.w,
              decoration: const BoxDecoration(
                color: AppTheme.textPrimary,
                shape: BoxShape.circle,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _shimmerSection(String title) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            _shimmerBox(height: 16.h, width: 120.w, borderRadius: BorderRadius.circular(6.r)),
          ],
        ),
        SizedBox(height: 8.h),
        ...List.generate(3, (_) => _shimmerTaskItem()),
        SizedBox(height: 12.h),
      ],
    );
  }

  Widget _buildLoadingShimmer() {
    return ListView(
      padding: EdgeInsets.zero,
      children: [
        Padding(
          padding: EdgeInsets.only(bottom: 12.h),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _shimmerBox(height: 20.h, width: 0.4.sw, borderRadius: BorderRadius.circular(6.r)),
                    SizedBox(height: 6.h),
                    _shimmerBox(height: 12.h, width: 0.6.sw, borderRadius: BorderRadius.circular(6.r)),
                  ],
                ),
              ),
              SizedBox(width: 12.w),
              _shimmerBox(height: 40.h, width: 40.h, borderRadius: BorderRadius.circular(40.r)),
              SizedBox(width: 8.w),
              _shimmerBox(height: 40.h, width: 40.h, borderRadius: BorderRadius.circular(40.r)),
            ],
          ),
        ),

        SizedBox(
          height: 80.h,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.symmetric(vertical: 4.h),
            itemCount: 7,
            separatorBuilder: (_, __) => SizedBox(width: 8.w),
            itemBuilder: (context, index) {
              return _shimmerBox(height: 64.h, width: 64.w, borderRadius: BorderRadius.circular(12.r));
            },
          ),
        ),
        SizedBox(height: 16.h),
        _shimmerBox(height: 96.h, width: double.infinity, borderRadius: BorderRadius.circular(12.r)),
        SizedBox(height: 16.h),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _shimmerSection('Habits'),
              _shimmerSection('Tasks'),
              SizedBox(height: 40.h),
            ],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    int total = 0;
    int completed = 0;

    _taskSections.values.forEach((list) {
      total += list.length;
      completed += list.where((t) => t.done).length;
    });
    _habitSections.values.forEach((list) {
      total += list.length;
      completed += list.where((t) => t.done).length;
    });

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TopBar(onPickDate: pickDate, selectedDate: selectedDate),
              const SizedBox(height: 16),
              DateSelector(
                dates: dateRange,
                selectedDate: selectedDate,
                controller: _dateScrollController,
                onDateSelected: (date) {
                  setState(() => selectedDate = date);
                  _loadForDate(date);
                },
              ),
              const SizedBox(height: 16),
              dailyGoalCard(
                completed: completed,
                total: total,
                progress: total == 0 ? 0 : completed / total,
                streakDays: 12,
              ),
              const SizedBox(height: 16),
              Expanded(
                child: _loading
                    ? _buildLoadingShimmer()
                    : _error != null
                    ? Center(child: Text(_error!))
                    : RefreshIndicator(
                  onRefresh: () => _loadForDate(selectedDate),
                  child: ListView(
                    padding: EdgeInsets.zero,
                    children: [
                      _buildSectionList('Habits', _habitSections),
                      _buildSectionList('Tasks', _taskSections),
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
