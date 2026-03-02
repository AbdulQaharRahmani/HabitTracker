import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/core/widgets/app_empty_state.dart';
import 'package:habit_tracker/core/widgets/app_error_state.dart';
import 'package:habit_tracker/screens/taskScreen/add_task_screen.dart';
import 'package:provider/provider.dart';

import '../../app/app_theme.dart';
import '../../features/tasks/data/repositories/tasks_repository_impl.dart';
import '../../features/tasks/domain/usecases/fetch_task_categories_usecase.dart';
import '../../features/tasks/domain/usecases/fetch_tasks_usecase.dart';
import '../../features/tasks/domain/usecases/toggle_task_status_usecase.dart';
import '../../providers/theme_provider.dart';
import '../../services/token_storage.dart';
import '../../utils/category/category_model.dart';
import '../../utils/taskpage_components/task_shimer.dart';
import '../../utils/taskpage_components/tasks_card.dart';
import '../../utils/taskpage_components/tasks_model.dart';
import 'edit_task_page.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  final _tasksRepository = TasksRepositoryImpl();
  late final FetchTasksUseCase _fetchTasksUseCase;
  late final FetchTaskCategoriesUseCase _fetchTaskCategoriesUseCase;
  late final ToggleTaskStatusUseCase _toggleTaskStatusUseCase;

  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();

  final List<Task> _tasks = <Task>[];
  List<CategoryModel> _categories = <CategoryModel>[];

  String? _selectedCategoryId;
  String _searchTerm = '';
  String? _errorMessage;

  bool _isInitialLoading = true;
  bool _isLoadMoreRunning = false;
  bool _hasMore = true;
  int _page = 1;
  final int _limit = 12;

  Timer? _searchTimer;
  String? _token;

  final TextStyle _descriptionStyle = TextStyle(
    color: AppTheme.textSecondary,
    fontSize: 14,
  );

  @override
  void initState() {
    super.initState();
    _fetchTasksUseCase = FetchTasksUseCase(_tasksRepository);
    _fetchTaskCategoriesUseCase = FetchTaskCategoriesUseCase(_tasksRepository);
    _toggleTaskStatusUseCase = ToggleTaskStatusUseCase(_tasksRepository);
    _scrollController.addListener(_onScroll);
    _searchController.addListener(_onSearchChanged);
    _init();
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    _searchTimer?.cancel();
    super.dispose();
  }

  Future<void> _init() async {
    _token = await AuthManager.getToken();
    if (_token == null) {
      if (!mounted) return;
      setState(() {
        _isInitialLoading = false;
        _errorMessage = 'Session expired. Please login again.';
      });
      return;
    }

    await Future.wait(<Future<void>>[
      _loadCategories(),
      _fetchTasks(reset: true),
    ]);
  }

  Future<void> _loadCategories() async {
    final result = await _fetchTaskCategoriesUseCase();
    if (!mounted) return;

    setState(() {
      _categories = result.success ? (result.data ?? <CategoryModel>[]) : <CategoryModel>[];
    });
  }

  void _onSearchChanged() {
    _searchTimer?.cancel();
    _searchTimer = Timer(const Duration(milliseconds: 450), () {
      final value = _searchController.text.trim();
      if (value == _searchTerm) return;
      _searchTerm = value;
      _fetchTasks(reset: true);
    });
  }

  void _onScroll() {
    if (!_hasMore || _isLoadMoreRunning || _isInitialLoading) return;
    if (_scrollController.position.extentAfter < 300) {
      _fetchTasks();
    }
  }

  Future<void> _fetchTasks({bool reset = false}) async {
    if (_token == null) return;
    if (_isInitialLoading || _isLoadMoreRunning) {
      if (!reset) return;
    }
    if (!reset && !_hasMore) return;

    if (reset) {
      setState(() {
        _isInitialLoading = true;
        _errorMessage = null;
        _hasMore = true;
        _page = 1;
      });
    } else {
      setState(() => _isLoadMoreRunning = true);
    }

    try {
      final result = await _fetchTasksUseCase(
        page: _page,
        limit: _limit,
        searchTerm: _searchTerm.isNotEmpty ? _searchTerm : null,
        categoryId: _selectedCategoryId,
      );

      if (!mounted) return;

      if (!result.success) {
        setState(() {
          _errorMessage = result.message ?? 'Failed to load tasks';
        });
        return;
      }

      final List<Task> data = result.data ?? <Task>[];

      setState(() {
        if (reset) {
          _tasks.clear();
        }
        for (final task in data) {
          if (_tasks.any((t) => t.id == task.id)) continue;
          _tasks.add(task);
        }
        _hasMore = data.length == _limit;
        _page += 1;
        _errorMessage = null;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _errorMessage = 'Failed to load tasks');
    } finally {
      if (mounted) {
        setState(() {
          _isInitialLoading = false;
          _isLoadMoreRunning = false;
        });
      }
    }
  }

  Future<void> _refreshTasks() async {
    _searchTimer?.cancel();
    _searchController.clear();
    _searchTerm = '';
    _selectedCategoryId = null;
    await Future.wait(<Future<void>>[
      _loadCategories(),
      _fetchTasks(reset: true),
    ]);
  }

  Future<void> _toggleTaskStatus(Task task) async {
    final index = _tasks.indexWhere((t) => t.id == task.id);
    if (index == -1) return;

    final oldStatus = _tasks[index].status;
    final newStatus = oldStatus == 'done' ? 'todo' : 'done';

    setState(() {
      _tasks[index] = _tasks[index].copyWith(status: newStatus);
    });

    try {
      final result = await _toggleTaskStatusUseCase(
        taskId: task.id,
        currentStatus: oldStatus,
      );
      if (!result.success) {
        throw Exception(result.message);
      }
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _tasks[index] = _tasks[index].copyWith(status: oldStatus);
      });
    }
  }

  Future<void> _editTask(Task task) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => EditTaskPage(task: task)),
    );
    if (result != null) {
      await _fetchTasks(reset: true);
    }
  }

  void _sortByDueDate(List<Task> tasks) {
    tasks.sort((a, b) {
      if (a.dueDate == null && b.dueDate == null) return 0;
      if (a.dueDate == null) return 1;
      if (b.dueDate == null) return -1;
      return a.dueDate!.compareTo(b.dueDate!);
    });
  }

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);
    final List<Task> todoTasks = _tasks.where((task) => task.status != 'done').toList();
    final List<Task> completedTasks = _tasks.where((task) => task.status == 'done').toList();
    _sortByDueDate(todoTasks);
    _sortByDueDate(completedTasks);

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 16.h),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'My Tasks',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 30.sp,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  SizedBox(height: 8.h),
                  Text(
                    'Stay focused with prioritized tasks and clear progress.',
                    style: _descriptionStyle,
                  ),
                ],
              ),
            ),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20.w),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 48.h,
                      decoration: BoxDecoration(
                        color: AppTheme.inputBackground,
                        borderRadius: BorderRadius.circular(15.r),
                        border: Border.all(color: AppTheme.border),
                      ),
                      padding: EdgeInsets.only(left: 12.w, right: 6.w),
                      child: Row(
                        children: [
                          Icon(Icons.search, color: AppTheme.textMuted),
                          SizedBox(width: 8.w),
                          Expanded(
                            child: TextField(
                              controller: _searchController,
                              decoration: InputDecoration(
                                hintText: 'Search tasks...',
                                isDense: true,
                                filled: false,
                                fillColor: Colors.transparent,
                                contentPadding: EdgeInsets.zero,
                                border: InputBorder.none,
                                enabledBorder: InputBorder.none,
                                focusedBorder: InputBorder.none,
                                disabledBorder: InputBorder.none,
                                errorBorder: InputBorder.none,
                                focusedErrorBorder: InputBorder.none,
                                hintStyle: TextStyle(color: AppTheme.textMuted),
                                suffixIcon: _searchController.text.isNotEmpty
                                    ? IconButton(
                                        onPressed: () {
                                          _searchTimer?.cancel();
                                          _searchController.clear();
                                          _searchTerm = '';
                                          _fetchTasks(reset: true);
                                        },
                                        icon: Icon(Icons.close, color: AppTheme.textMuted),
                                      )
                                    : null,
                              ),
                              textInputAction: TextInputAction.search,
                              onChanged: (_) => setState(() {}),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(width: 12.w),
                  SizedBox(
                    height: 48.h,
                    child: ElevatedButton.icon(
                      onPressed: () async {
                        final newTask = await Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => NewTaskPage(defaultCategoryId: _selectedCategoryId),
                          ),
                        );
                        if (newTask != null) {
                          await _fetchTasks(reset: true);
                          if (!mounted) return;
                          ScaffoldMessenger.of(this.context).showSnackBar(
                            SnackBar(
                              content: const Text('Task created successfully!'),
                              backgroundColor: AppTheme.success,
                            ),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12.r),
                        ),
                      ),
                      icon: const Icon(Icons.add, size: 20, color: Colors.white),
                      label: const Text(
                        'New',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 10.h),
            _buildCategoryFilters(),
            SizedBox(height: 8.h),
            Expanded(
              child: RefreshIndicator(
                onRefresh: _refreshTasks,
                color: AppTheme.primary,
                child: _buildTasksContent(todoTasks, completedTasks),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTasksContent(List<Task> todoTasks, List<Task> completedTasks) {
    if (_isInitialLoading && _tasks.isEmpty) {
      return ListView.builder(
        physics: const AlwaysScrollableScrollPhysics(),
        itemCount: 4,
        itemBuilder: (_, _) => const TasksCardShimmer(),
      );
    }

    if (_errorMessage != null && _tasks.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          SizedBox(height: 220.h),
          AppErrorState(
            message: _errorMessage!,
            onRetry: () => _fetchTasks(reset: true),
          ),
        ],
      );
    }

    if (todoTasks.isEmpty && completedTasks.isEmpty) {
      return ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        children: [
          SizedBox(height: 120.h),
          AppEmptyState(
            title: _selectedCategoryId == null && _searchTerm.isEmpty
                ? 'No tasks found'
                : 'No tasks match this filter',
          ),
        ],
      );
    }

    return CustomScrollView(
      controller: _scrollController,
      physics: const AlwaysScrollableScrollPhysics(),
      slivers: [
        if (todoTasks.isNotEmpty) _buildTaskList('TO DO', todoTasks),
        if (completedTasks.isNotEmpty) _buildTaskList('Completed', completedTasks),
        SliverToBoxAdapter(
          child: Padding(
            padding: EdgeInsets.symmetric(vertical: 14.h),
            child: Center(
              child: _isLoadMoreRunning
                  ? const CircularProgressIndicator()
                  : (!_hasMore && _tasks.length >= _limit)
                      ? Text(
                          'You reached the end',
                          style: TextStyle(color: AppTheme.textMuted, fontSize: 12.sp),
                        )
                      : const SizedBox.shrink(),
            ),
          ),
        ),
        const SliverToBoxAdapter(child: SizedBox(height: 20)),
      ],
    );
  }

  SliverList _buildTaskList(String title, List<Task> tasks) {
    return SliverList(
      delegate: SliverChildBuilderDelegate(
        (context, index) {
          if (index == 0) {
            return Padding(
              padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 8.h),
              child: Text(
                '$title (${tasks.length})',
                style: TextStyle(
                  fontSize: 18.sp,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.textPrimary,
                ),
              ),
            );
          }

          final task = tasks[index - 1];
          return TasksScreenCard(
            task: task,
            onStatusChanged: _toggleTaskStatus,
            onEdit: _editTask,
          );
        },
        childCount: tasks.length + 1,
      ),
    );
  }

  Widget _buildCategoryFilters() {
    return SizedBox(
      height: 44.h,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.symmetric(horizontal: 16.w),
        itemCount: _categories.length + 1,
        itemBuilder: (context, index) {
          final bool isAll = index == 0;
          final CategoryModel? category = isAll ? null : _categories[index - 1];
          final bool isSelected = _selectedCategoryId == category?.id;
          final bool showSelectedForAll = isAll && _selectedCategoryId == null;
          final bool selected = isSelected || showSelectedForAll;

          return Padding(
            padding: EdgeInsets.symmetric(horizontal: 5.w),
            child: FilterChip(
              showCheckmark: false,
              label: Text(
                isAll ? 'All' : category!.name,
                style: TextStyle(color: selected ? AppTheme.textWhite : AppTheme.textPrimary),
              ),
              selected: selected,
              onSelected: (_) {
                setState(() => _selectedCategoryId = category?.id);
                _fetchTasks(reset: true);
              },
              selectedColor: AppTheme.primary,
              backgroundColor: selected ? AppTheme.primary : AppTheme.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20.r),
                side: BorderSide(color: selected ? AppTheme.primary : AppTheme.border),
              ),
            ),
          );
        },
      ),
    );
  }
}
