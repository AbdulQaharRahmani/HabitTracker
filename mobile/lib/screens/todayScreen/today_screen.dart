import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';

import '../../app/app_theme.dart';
import '../../providers/theme_provider.dart';
import '../../services/app_state.dart';
import '../../services/auth_service.dart';
import '../../utils/date_validator.dart';
import '../../utils/profile/profile_model.dart';
import '../../utils/today_progressBar/date_selector.dart';
import '../../utils/today_progressBar/habit_card.dart';
import '../../utils/today_progressBar/task_card.dart';
import '../../utils/today_progressBar/task_item.dart';
import '../../utils/today_progressBar/top_bar.dart';

enum _TodayTab { habits, tasks }

class TodayScreen extends StatefulWidget {
  const TodayScreen({super.key});

  @override
  State<TodayScreen> createState() => _TodayScreenState();
}

class _TodayScreenState extends State<TodayScreen> {
  final AuthService _api = AuthService();
  final AppState _appState = AppState();

  DateTime selectedDate = DateTime.now();
  late DateTime loginDate;
  late List<DateTime> dateRange;

  final ScrollController _dateScrollController = ScrollController();
  _TodayTab _activeTab = _TodayTab.habits;

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

    _loadAllData(selectedDate);
    _appState.preloadProfileData();
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
    offset = offset.clamp(0.0, _dateScrollController.position.maxScrollExtent);

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
      await _loadAllData(date);
    }
  }

  Future<void> _loadAllData(DateTime date) async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final results = await Future.wait([
        _api.fetchAllTasks(forDate: date),
        _api.fetchAllHabits(forDate: date),
        _api.fetchHabitsDashboard(),
      ]);

      final tasks = results[0] as List<TaskItem>;
      final habits = results[1] as List<TaskItem>;
      final _ = results[2] as Welcome;

      final itemsTasks = tasks.where((t) => t.appliesToDate(date)).toList();
      final itemsHabits = habits;

      final Map<String, List<TaskItem>> taskSections = {};
      for (final t in itemsTasks) {
        final key = t.category.toUpperCase();
        (taskSections[key] ??= []).add(t);
      }

      final Map<String, List<TaskItem>> habitSections = {};
      for (final h in itemsHabits) {
        final key = h.category.toUpperCase();
        (habitSections[key] ??= []).add(h);
      }

      setState(() {
        _taskSections = taskSections;
        _habitSections = habitSections;
      });
    } catch (e) {
      setState(() {
        _error = 'Error loading data: $e';
      });
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _toggleDone(TaskItem item) async {
    if (!DateValidator.isDateInAllowedRange(selectedDate)) {
      DateValidator.showDateError(context, selectedDate);
      return;
    }

    final previous = item.done;
    setState(() => item.done = !previous);

    final success = await _api.setItemCompletion(
      item: item,
      forDate: selectedDate,
    );

    if (!success && mounted) {
      setState(() => item.done = previous);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Error while updating'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  List<TaskItem> _flattenSections(Map<String, List<TaskItem>> sections) {
    final List<TaskItem> items = [];
    for (final list in sections.values) {
      items.addAll(list);
    }
    return items;
  }

  Widget _buildSectionList({
    required String title,
    required String subtitle,
    required List<TaskItem> items,
    required bool isHabitSection,
  }) {
    if (items.isEmpty) {
      return _buildEmptySection(
        title: title,
        subtitle: subtitle,
        isHabitSection: isHabitSection,
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionHeader(title: title, subtitle: subtitle),
        SizedBox(height: 8.h),
        Container(
          padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 10.h),
          decoration: BoxDecoration(
            color: AppTheme.surface,
            borderRadius: BorderRadius.circular(14.r),
            border: Border.all(color: AppTheme.border),
          ),
          child: Column(
            children: [
              ...items.asMap().entries.map((indexedItem) {
                final item = indexedItem.value;
                return TweenAnimationBuilder<double>(
                  duration: Duration(milliseconds: 180 + indexedItem.key * 45),
                  tween: Tween<double>(begin: 0, end: 1),
                  curve: Curves.easeOutCubic,
                  builder: (context, value, child) {
                    return Opacity(
                      opacity: value.clamp(0.0, 1.0).toDouble(),
                      child: Transform.translate(
                        offset: Offset(0, (1 - value) * 6),
                        child: child,
                      ),
                    );
                  },
                  child: Column(
                    children: [
                      isHabitSection
                          ? HabitCard(
                              item: item,
                              onToggleDone: (_) => _toggleDone(item),
                            )
                          : TaskCard(
                              item: item,
                              onToggleDone: (_) => _toggleDone(item),
                            ),
                      if (indexedItem.key != items.length - 1)
                        Divider(
                          height: 10.h,
                          color: AppTheme.border.withValues(alpha: 0.55),
                        ),
                    ],
                  ),
                );
              }),
            ],
          ),
        ),
        SizedBox(height: 12.h),
      ],
    );
  }

  Widget _buildSectionHeader({
    required String title,
    required String subtitle,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              title == 'Habits'
                  ? Icons.local_fire_department
                  : Icons.event_note,
              size: 16.sp,
              color: title == 'Habits' ? AppTheme.warning : AppTheme.primary,
            ),
            SizedBox(width: 6.w),
            Text(
              title,
              style: TextStyle(
                fontSize: 16.sp,
                fontWeight: FontWeight.w700,
                color: AppTheme.textPrimary,
              ),
            ),
          ],
        ),
        SizedBox(height: 2.h),
        Padding(
          padding: EdgeInsets.only(left: 22.w),
          child: Text(
            subtitle,
            style: TextStyle(fontSize: 11.sp, color: AppTheme.textSecondary),
          ),
        ),
      ],
    );
  }

  Widget _buildSegmentBar({required int habitsCount, required int tasksCount}) {
    final bool habitsSelected = _activeTab == _TodayTab.habits;

    return Container(
      padding: EdgeInsets.all(4.w),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppTheme.border),
      ),
      child: Row(
        children: [
          Expanded(
            child: _SegmentTab(
              selected: habitsSelected,
              icon: Icons.event_repeat,
              title: 'Habits',
              count: habitsCount,
              onTap: () => setState(() => _activeTab = _TodayTab.habits),
            ),
          ),
          SizedBox(width: 6.w),
          Expanded(
            child: _SegmentTab(
              selected: !habitsSelected,
              icon: Icons.task_alt_outlined,
              title: 'Tasks',
              count: tasksCount,
              onTap: () => setState(() => _activeTab = _TodayTab.tasks),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressHero({
    required String title,
    required int completed,
    required int total,
  }) {
    final progress = total == 0 ? 0.0 : completed / total;
    final remaining = (total - completed).clamp(0, 9999);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 220),
      width: double.infinity,
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16.r),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.primary.withValues(alpha: 0.84),
            const Color(0xFF95B8FF),
          ],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '${(progress * 100).round()}%',
            style: TextStyle(
              fontSize: 40.sp,
              fontWeight: FontWeight.w700,
              color: AppTheme.textWhite,
              height: 1,
            ),
          ),
          SizedBox(height: 8.h),
          Text(
            '$title: $completed of $total completed',
            style: TextStyle(
              fontSize: 14.sp,
              color: AppTheme.textWhite.withValues(alpha: 0.92),
            ),
          ),
          SizedBox(height: 10.h),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 5.h),
            decoration: BoxDecoration(
              color: AppTheme.textWhite.withValues(alpha: 0.22),
              borderRadius: BorderRadius.circular(999.r),
            ),
            child: Text(
              '$remaining left for this tab',
              style: TextStyle(
                fontSize: 12.sp,
                color: AppTheme.textWhite,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }


  Widget _buildEmptySection({
    required String title,
    required String subtitle,
    required bool isHabitSection,
  }) {
    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(14.r),
        border: Border.all(color: AppTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionHeader(title: title, subtitle: subtitle),
          SizedBox(height: 10.h),
          Row(
            children: [
              Icon(
                isHabitSection
                    ? Icons.emoji_events_outlined
                    : Icons.inbox_outlined,
                color: AppTheme.textMuted,
              ),
              SizedBox(width: 10.w),
              Expanded(
                child: Text(
                  isHabitSection
                      ? 'No habits planned. Add one to maintain your routine.'
                      : 'No tasks for this day. Plan one focused action.',
                  style: TextStyle(
                    fontSize: 12.sp,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _shimmerBox({
    double height = 16,
    double width = double.infinity,
    BorderRadius? borderRadius,
  }) {
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
            baseColor: AppTheme.shadow,
            highlightColor: AppTheme.textWhite,
            child: Container(
              width: 42.w,
              height: 42.w,
              decoration: BoxDecoration(
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
                _shimmerBox(
                  height: 14.h,
                  width: 0.5.sw,
                  borderRadius: BorderRadius.circular(6.r),
                ),
                SizedBox(height: 8.h),
                Row(
                  children: [
                    _shimmerBox(
                      height: 12.h,
                      width: 60.w,
                      borderRadius: BorderRadius.circular(6.r),
                    ),
                    SizedBox(width: 10.w),
                    _shimmerBox(
                      height: 12.h,
                      width: 80.w,
                      borderRadius: BorderRadius.circular(12.r),
                    ),
                  ],
                ),
              ],
            ),
          ),
          SizedBox(width: 10.w),
          Shimmer.fromColors(
            baseColor: AppTheme.shadow,
            highlightColor: AppTheme.textWhite,
            child: Container(
              width: 36.w,
              height: 36.w,
              decoration: BoxDecoration(
                color: AppTheme.textPrimary,
                shape: BoxShape.circle,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _shimmerSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _shimmerBox(
          height: 16.h,
          width: 120.w,
          borderRadius: BorderRadius.circular(6.r),
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
        _shimmerBox(
          height: 120.h,
          width: double.infinity,
          borderRadius: BorderRadius.circular(16.r),
        ),
        SizedBox(height: 12.h),
        _shimmerBox(
          height: 44.h,
          width: double.infinity,
          borderRadius: BorderRadius.circular(12.r),
        ),
        SizedBox(height: 14.h),
        _shimmerSection(),
        _shimmerSection(),
        SizedBox(height: 50.h),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);

    final habitItems = _flattenSections(_habitSections);
    final taskItems = _flattenSections(_taskSections);

    final int habitTotal = habitItems.length;
    final int habitCompleted = habitItems.where((e) => e.done).length;
    final int taskTotal = taskItems.length;
    final int taskCompleted = taskItems.where((e) => e.done).length;

    final bool habitsTab = _activeTab == _TodayTab.habits;
    final int activeTotal = habitsTab ? habitTotal : taskTotal;
    final int activeCompleted = habitsTab ? habitCompleted : taskCompleted;
    final int remaining = (activeTotal - activeCompleted).clamp(0, 9999);

    final List<TaskItem> activeItems = habitsTab ? habitItems : taskItems;
    final bool isHabitSection = habitsTab;
    final String sectionTitle = habitsTab ? 'Habits' : 'Today';
    final String sectionSubtitle = habitsTab
        ? '$habitTotal active habits'
        : '$taskTotal tasks to execute';

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
                  _loadAllData(date);
                },
              ),
              const SizedBox(height: 14),
              _buildProgressHero(
                title: habitsTab ? 'Habits progress' : 'Tasks progress',
                completed: activeCompleted,
                total: activeTotal,
              ),
              SizedBox(height: 10.h),
              _buildSegmentBar(habitsCount: habitTotal, tasksCount: taskTotal),
              SizedBox(height: 10.h),
              Expanded(
                child: _loading
                    ? _buildLoadingShimmer()
                    : _error != null
                    ? Center(child: Text(_error!))
                    : RefreshIndicator(
                        onRefresh: () => _loadAllData(selectedDate),
                        child: ListView(
                          padding: EdgeInsets.zero,
                          children: [
                            _buildSectionList(
                              title: sectionTitle,
                              subtitle: sectionSubtitle,
                              items: activeItems,
                              isHabitSection: isHabitSection,
                            ),
                            SizedBox(height: 70.h),
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

class _SegmentTab extends StatelessWidget {
  final bool selected;
  final IconData icon;
  final String title;
  final int count;
  final VoidCallback onTap;

  const _SegmentTab({
    required this.selected,
    required this.icon,
    required this.title,
    required this.count,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final Color fg = selected ? AppTheme.primary : AppTheme.textSecondary;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(9.r),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: EdgeInsets.symmetric(vertical: 8.h),
        decoration: BoxDecoration(
          color: selected
              ? AppTheme.primary.withValues(alpha: 0.08)
              : AppTheme.background,
          borderRadius: BorderRadius.circular(9.r),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 14.sp, color: fg),
            SizedBox(width: 6.w),
            Text(
              title,
              style: TextStyle(
                fontSize: 13.sp,
                fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
                color: fg,
              ),
            ),
            SizedBox(width: 6.w),
            Text(
              '$count',
              style: TextStyle(fontSize: 11.sp, color: fg),
            ),
          ],
        ),
      ),
    );
  }
}
