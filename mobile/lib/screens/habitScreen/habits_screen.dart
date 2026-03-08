import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:shimmer/shimmer.dart';

import '../../app/app_theme.dart';
import '../../providers/theme_provider.dart';
import '../../services/habit_cache_service.dart';
import '../../services/habit_reminder_service.dart';
import '../../utils/habits/habit.dart';
import '../../utils/habits/habit_card.dart';
import 'add_habit.dart';
import 'edit_habit_screen.dart';

class HabitsScreen extends StatefulWidget {
  const HabitsScreen({super.key});

  @override
  State<HabitsScreen> createState() => _HabitsScreenState();
}

class _HabitsScreenState extends State<HabitsScreen> {
  static const int _pageSize = 8;

  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();
  final ValueNotifier<DateTime> _clock = ValueNotifier<DateTime>(
    DateTime.now(),
  );

  final List<Habit> _allHabits = <Habit>[];
  List<Habit> _visibleHabits = <Habit>[];

  bool _isLoading = true;
  bool _isLoadMoreRunning = false;
  bool _hasNextPage = true;
  int _page = 1;
  String? _errorMessage;

  String _searchQuery = '';
  Timer? _searchDebounce;
  Timer? _clockTimer;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_loadMoreHabits);
    _searchController.addListener(_onSearchChanged);
    _clockTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      _clock.value = DateTime.now();
    });
    _bootstrap();
  }

  @override
  void dispose() {
    _searchDebounce?.cancel();
    _searchController
      ..removeListener(_onSearchChanged)
      ..dispose();
    _clockTimer?.cancel();
    _clock.dispose();
    _scrollController
      ..removeListener(_loadMoreHabits)
      ..dispose();
    super.dispose();
  }

  Future<void> _bootstrap() async {
    await HabitReminderService.instance.initialize();
    final cached = await HabitCacheService.instance.loadHabits();
    final cachedWithReminders = await HabitReminderService.instance
        .attachReminderData(cached);

    if (!mounted) return;
    if (cachedWithReminders.isNotEmpty) {
      setState(() {
        _allHabits
          ..clear()
          ..addAll(cachedWithReminders);
        _isLoading = false;
        _errorMessage = null;
        _applyFilter();
      });
    }

    await _fetchHabits(showLoading: cachedWithReminders.isEmpty);
  }

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  void _onSearchChanged() {
    _searchDebounce?.cancel();
    _searchDebounce = Timer(const Duration(milliseconds: 180), () {
      final query = _searchController.text.trim();
      if (query == _searchQuery) return;
      setState(() {
        _searchQuery = query;
        _applyFilter();
      });
    });
  }

  void _applyFilter() {
    if (_searchQuery.isEmpty) {
      _visibleHabits = List<Habit>.from(_allHabits);
      return;
    }

    final query = _searchQuery.toLowerCase();
    _visibleHabits = _allHabits.where((habit) {
      return habit.title.toLowerCase().contains(query) ||
          habit.description.toLowerCase().contains(query) ||
          habit.category.name.toLowerCase().contains(query);
    }).toList();
  }

  Future<void> _fetchHabits({bool showLoading = true}) async {
    setState(() {
      if (showLoading) {
        _isLoading = true;
      }
      _errorMessage = null;
      _page = 1;
      _hasNextPage = true;
    });

    try {
      final token = await _getToken();
      final response = await http
          .get(
            Uri.parse(
              'https://habit-tracker-17sr.onrender.com/api/habits?page=$_page&limit=$_pageSize',
            ),
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json',
            },
          )
          .timeout(const Duration(seconds: 30));

      if (response.statusCode != 200) {
        setState(() {
          _isLoading = false;
          _errorMessage = 'Failed to load habits (${response.statusCode})';
        });
        return;
      }

      final decodedData = jsonDecode(response.body) as Map<String, dynamic>;
      final habitsJson = decodedData['data'] as List<dynamic>;
      var loaded = habitsJson
          .map((item) => Habit.fromJson(item as Map<String, dynamic>))
          .toList()
          .reversed
          .toList();
      loaded = await HabitReminderService.instance.attachReminderData(loaded);
      await HabitReminderService.instance.syncWithHabits(loaded);
      await HabitCacheService.instance.saveHabits(loaded);

      setState(() {
        _allHabits
          ..clear()
          ..addAll(loaded);
        _hasNextPage = habitsJson.length >= _pageSize;
        _isLoading = false;
        _errorMessage = null;
        _applyFilter();
      });
    } catch (_) {
      if (!showLoading && _allHabits.isNotEmpty) {
        return;
      }
      setState(() {
        _isLoading = false;
        _errorMessage = 'Network error: make sure you are connected.';
      });
    }
  }

  Future<void> _loadMoreHabits() async {
    if (_isLoading || _isLoadMoreRunning || !_hasNextPage) return;
    if (_scrollController.position.extentAfter > 260) return;

    setState(() => _isLoadMoreRunning = true);
    _page += 1;

    try {
      final token = await _getToken();
      final response = await http
          .get(
            Uri.parse(
              'https://habit-tracker-17sr.onrender.com/api/habits?page=$_page&limit=$_pageSize',
            ),
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json',
            },
          )
          .timeout(const Duration(seconds: 30));

      if (response.statusCode != 200) {
        setState(() {
          _isLoadMoreRunning = false;
          _hasNextPage = false;
        });
        return;
      }

      final decodedData = jsonDecode(response.body) as Map<String, dynamic>;
      final habitsJson = decodedData['data'] as List<dynamic>;
      var loaded = habitsJson
          .map((item) => Habit.fromJson(item as Map<String, dynamic>))
          .toList()
          .reversed
          .toList();
      loaded = await HabitReminderService.instance.attachReminderData(loaded);

      setState(() {
        _allHabits.addAll(loaded);
        _hasNextPage = habitsJson.length >= _pageSize;
        _isLoadMoreRunning = false;
        _applyFilter();
      });
      await HabitCacheService.instance.saveHabits(_allHabits);
    } catch (_) {
      setState(() {
        _isLoadMoreRunning = false;
        _hasNextPage = false;
      });
    }
  }

  Future<void> _openAddHabit() async {
    await AddHabitDialog.show(
      context,
      onSubmit: (newHabit) async {
        if (newHabit != null) {
          setState(() {
            _allHabits.insert(0, newHabit);
            _applyFilter();
          });
          await HabitCacheService.instance.saveHabits(_allHabits);
          await HabitReminderService.instance.syncWithHabits(_allHabits);
          return;
        }
        await _fetchHabits(showLoading: _allHabits.isEmpty);
      },
    );
  }

  Future<void> _openEditHabit(Habit habit) async {
    final result = await Navigator.of(context).push<dynamic>(
      PageRouteBuilder<dynamic>(
        pageBuilder: (context, animation, secondaryAnimation) =>
            EditHabitPage(habit: habit),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          final curved = CurvedAnimation(
            parent: animation,
            curve: Curves.easeOutCubic,
          );
          return FadeTransition(
            opacity: curved,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0, 0.05),
                end: Offset.zero,
              ).animate(curved),
              child: child,
            ),
          );
        },
      ),
    );

    if (!mounted) return;

    if (result is Habit) {
      setState(() {
        final index = _allHabits.indexWhere((item) => item.id == result.id);
        if (index != -1) {
          _allHabits[index] = result;
          _applyFilter();
        }
      });
      await HabitCacheService.instance.saveHabits(_allHabits);
      await HabitReminderService.instance.syncWithHabits(_allHabits);
      return;
    }

    if (result == true) {
      await _fetchHabits(showLoading: _allHabits.isEmpty);
    }
  }

  Future<void> _deleteHabit(Habit habit) async {
    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppTheme.surface,
          title: const Text('Delete habit?'),
          content: Text('Remove "${habit.title}" permanently?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.error,
                foregroundColor: AppTheme.textWhite,
              ),
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );

    if (!mounted) return;
    if (shouldDelete != true) return;

    try {
      final token = await _getToken();
      final response = await http
          .delete(
            Uri.parse(
              'https://habit-tracker-17sr.onrender.com/api/habits/${habit.id}',
            ),
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json',
            },
          )
          .timeout(const Duration(seconds: 30));

      if (!mounted) return;

      if (response.statusCode == 200) {
        setState(() {
          _allHabits.removeWhere((item) => item.id == habit.id);
          _applyFilter();
        });
        await HabitReminderService.instance.removeReminderForHabit(habit.id);
        await HabitCacheService.instance.saveHabits(_allHabits);
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Habit deleted successfully.'),
            backgroundColor: AppTheme.success,
            behavior: SnackBarBehavior.floating,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to delete habit (${response.statusCode}).'),
            backgroundColor: AppTheme.error,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Network issue while deleting habit.'),
          backgroundColor: AppTheme.error,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  void _clearSearch() {
    _searchController.clear();
    setState(() {
      _searchQuery = '';
      _applyFilter();
    });
  }

  @override
  Widget build(BuildContext context) {
    context.watch<ThemeProvider>();

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(16.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Daily Rituals',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 28.sp,
                  color: AppTheme.textPrimary,
                ),
              ),
              SizedBox(height: 4.h),
              Text(
                'Build momentum with focused routines every day.',
                style: TextStyle(
                  color: AppTheme.textSecondary,
                  fontSize: 12.sp,
                ),
              ),
              SizedBox(height: 10.h),
              _SearchCreateBar(
                controller: _searchController,
                hasQuery: _searchQuery.isNotEmpty,
                onClear: _clearSearch,
                onCreate: _openAddHabit,
              ),
              SizedBox(height: 10.h),
              _ListHeader(total: _visibleHabits.length),
              SizedBox(height: 8.h),
              Expanded(
                child: RefreshIndicator(
                  color: AppTheme.primary,
                  onRefresh: _fetchHabits,
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 200),
                    child: _buildBodyState(),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBodyState() {
    if (_isLoading) {
      return const _HabitsShimmer(key: ValueKey<String>('loading'));
    }

    if (_errorMessage != null) {
      return _InfoState(
        key: const ValueKey<String>('error'),
        icon: Icons.wifi_off_rounded,
        message: _errorMessage!,
        buttonText: 'Try again',
        onPressed: _fetchHabits,
      );
    }

    if (_visibleHabits.isEmpty) {
      final text = _searchQuery.isNotEmpty
          ? 'No habits found for "$_searchQuery".'
          : 'No habits yet. Add one to start your routine.';

      return _InfoState(
        key: const ValueKey<String>('empty'),
        icon: Icons.inbox_outlined,
        message: text,
        buttonText: _searchQuery.isNotEmpty ? 'Clear search' : null,
        onPressed: _searchQuery.isNotEmpty ? _clearSearch : null,
      );
    }

    return ListView.builder(
      key: const ValueKey<String>('list'),
      controller: _scrollController,
      physics: const AlwaysScrollableScrollPhysics(),
      padding: EdgeInsets.only(bottom: 76.h),
      itemCount: _visibleHabits.length + (_isLoadMoreRunning ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == _visibleHabits.length) {
          return Padding(
            padding: EdgeInsets.symmetric(vertical: 20.h),
            child: Center(
              child: SizedBox(
                width: 18.w,
                height: 18.w,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AppTheme.primary,
                ),
              ),
            ),
          );
        }

        final habit = _visibleHabits[index];
        return Padding(
          padding: EdgeInsets.only(bottom: 10.h),
          child: HabitCard(
            key: ValueKey<String>('habit-${habit.id}'),
            habit: habit,
            onEdit: () => _openEditHabit(habit),
            onDelete: () => _deleteHabit(habit),
            clock: _clock,
          ),
        );
      },
    );
  }
}

class _SearchCreateBar extends StatefulWidget {
  const _SearchCreateBar({
    required this.controller,
    required this.hasQuery,
    required this.onClear,
    required this.onCreate,
  });

  final TextEditingController controller;
  final bool hasQuery;
  final VoidCallback onClear;
  final VoidCallback onCreate;

  @override
  State<_SearchCreateBar> createState() => _SearchCreateBarState();
}

class _SearchCreateBarState extends State<_SearchCreateBar> {
  late final FocusNode _focusNode;
  bool _isFocused = false;

  @override
  void initState() {
    super.initState();
    _focusNode = FocusNode()
      ..addListener(() {
        if (!mounted) return;
        setState(() => _isFocused = _focusNode.hasFocus);
      });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppTheme.surface,
      elevation: 0,
      borderRadius: BorderRadius.circular(12.r),
      child: Container(
        height: 48.h,
        padding: EdgeInsets.symmetric(horizontal: 10.w),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12.r),
          border: Border.all(
            color: _isFocused
                ? AppTheme.primary.withValues(alpha: 0.38)
                : AppTheme.border,
          ),
          boxShadow: _isFocused
              ? [
                  BoxShadow(
                    color: AppTheme.primary.withValues(alpha: 0.08),
                    blurRadius: 10,
                    offset: const Offset(0, 3),
                  ),
                ]
              : null,
        ),
        alignment: Alignment.center,
        child: Row(
          children: [
            Icon(Icons.search, size: 18.sp, color: AppTheme.textMuted),
            SizedBox(width: 8.w),
            Expanded(
              child: TextField(
                controller: widget.controller,
                focusNode: _focusNode,
                decoration: InputDecoration(
                  hintText: 'Search habits...',
                  isDense: true,
                  border: InputBorder.none,
                  hintStyle: TextStyle(
                    color: AppTheme.textMuted,
                    fontSize: 13.sp,
                  ),
                ),
                style: TextStyle(fontSize: 13.sp, color: AppTheme.textPrimary),
              ),
            ),
            if (widget.hasQuery)
              IconButton(
                onPressed: widget.onClear,
                visualDensity: VisualDensity.compact,
                icon: Icon(Icons.close, size: 18.sp, color: AppTheme.textMuted),
              ),
            SizedBox(width: 4.w),
            InkWell(
              borderRadius: BorderRadius.circular(9.r),
              onTap: widget.onCreate,
              child: Container(
                height: 36.h,
                padding: EdgeInsets.symmetric(horizontal: 12.w),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(9.r),
                ),
                child: Row(
                  children: [
                    Icon(Icons.add, size: 16.sp, color: AppTheme.primary),
                    SizedBox(width: 5.w),
                    Text(
                      'New',
                      style: TextStyle(
                        color: AppTheme.primary,
                        fontSize: 13.sp,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ListHeader extends StatelessWidget {
  const _ListHeader({required this.total});

  final int total;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(Icons.event_repeat, size: 16.sp, color: AppTheme.warning),
        SizedBox(width: 6.w),
        Text(
          'Habits',
          style: TextStyle(
            fontSize: 16.sp,
            fontWeight: FontWeight.w700,
            color: AppTheme.textPrimary,
          ),
        ),
        const Spacer(),
        Container(
          padding: EdgeInsets.symmetric(horizontal: 10.w, vertical: 4.h),
          decoration: BoxDecoration(
            color: AppTheme.primary.withValues(alpha: 0.08),
            borderRadius: BorderRadius.circular(999.r),
          ),
          child: Text(
            '$total',
            style: TextStyle(
              color: AppTheme.primary,
              fontSize: 11.sp,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }
}

class _HabitsShimmer extends StatelessWidget {
  const _HabitsShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      physics: const AlwaysScrollableScrollPhysics(),
      itemCount: 5,
      itemBuilder: (context, index) {
        return Padding(
          padding: EdgeInsets.only(bottom: 10.h),
          child: Shimmer.fromColors(
            baseColor: AppTheme.border.withValues(alpha: 0.4),
            highlightColor: AppTheme.surface,
            child: Container(
              height: 102.h,
              decoration: BoxDecoration(
                color: AppTheme.surface,
                borderRadius: BorderRadius.circular(14.r),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _InfoState extends StatelessWidget {
  const _InfoState({
    super.key,
    required this.icon,
    required this.message,
    this.buttonText,
    this.onPressed,
  });

  final IconData icon;
  final String message;
  final String? buttonText;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return ListView(
      physics: const AlwaysScrollableScrollPhysics(),
      children: [
        SizedBox(height: 80.h),
        Container(
          padding: EdgeInsets.all(14.w),
          decoration: BoxDecoration(
            color: AppTheme.surface,
            borderRadius: BorderRadius.circular(14.r),
            border: Border.all(color: AppTheme.border),
          ),
          child: Column(
            children: [
              Icon(icon, size: 30.sp, color: AppTheme.textMuted),
              SizedBox(height: 10.h),
              Text(
                message,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: AppTheme.textSecondary,
                  fontSize: 12.sp,
                ),
              ),
              if (buttonText != null && onPressed != null) ...[
                SizedBox(height: 12.h),
                ElevatedButton(onPressed: onPressed, child: Text(buttonText!)),
              ],
            ],
          ),
        ),
      ],
    );
  }
}
