import 'dart:async';

import 'package:flutter/material.dart';
import 'package:habit_tracker/screens/taskScreen/add_task_screen.dart';
import '../../app/app_theme.dart';
import '../../services/taskpage_api/category_api.dart';
import '../../services/taskpage_api/tasks_api.dart';
import '../../utils/category/category_model.dart';
import '../../utils/taskpage_components/task_shimer.dart';
import '../../utils/taskpage_components/tasks_model.dart';
import '../../services/token_storage.dart';
import 'edit_task_page.dart';
import '../../utils/taskpage_components/tasks_card.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  final TaskApiService _apiService = TaskApiService();
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();

  /// UI filter state
  String? selectedCategoryId;

  /// Backend filter params
  String _searchTerm = '';

  final List<Task> _tasks = [];
  bool _isLoading = false;
  bool _hasMore = true;
  String? _errorMessage;

  int _page = 1;
  final int _limit = 20;
  String? _token;
  Timer? _searchTimer;

  final CategoryApiService _categoryApi = CategoryApiService();
  List<CategoryModel> _categories = [];

  @override
  void initState() {
    super.initState();
    _init();
    _scrollController.addListener(_onScroll);
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    _scrollController.dispose();
    _searchTimer?.cancel();
    super.dispose();
  }

  void _onSearchChanged() {
    _searchTimer?.cancel();
    _searchTimer = Timer(const Duration(milliseconds: 500), () {
      if (_searchController.text != _searchTerm) {
        _searchTerm = _searchController.text;
        _applyFilters(reset: true);
      }
    });
  }

  Future<void> _init() async {
    _token = await AuthManager.getToken();
    if (_token == null) return;

    await Future.wait([_loadCategories(), _fetchTasks(reset: true)]);
  }

  Future<void> _loadCategories() async {
    final categories = await _categoryApi.fetchCategories(token: _token!);
    setState(() => _categories = categories);
  }

  Future<void> _fetchTasks({bool reset = false}) async {
    if (_isLoading || (!_hasMore && !reset)) return;

    if (reset) {
      _page = 1;
      _tasks.clear();
      _hasMore = true;
      _errorMessage = null;
    }

    setState(() => _isLoading = true);

    try {
      final data = await _apiService.fetchTasks(
        token: _token!,
        page: _page,
        limit: _limit,
        searchTerm: _searchTerm.isNotEmpty ? _searchTerm : null,
        categoryId: selectedCategoryId,
      );

      final newTasks = data
          .where((t) => !_tasks.any((old) => old.id == t.id))
          .toList();

      setState(() {
        _tasks.addAll(newTasks);
        if (data.length < _limit) _hasMore = false;
        _page++;
      });
    } catch (e) {
      setState(() => _errorMessage = 'Failed to load tasks');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      _fetchTasks();
    }
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
      await _apiService.toggleTaskStatus(
        taskId: task.id,
        currentStatus: oldStatus,
        token: _token!,
      );
    } catch (_) {
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
    if (result != null) _applyFilters(reset: true);
  }

  Future<void> _refreshTasks() async {
    _searchController.clear();
    _searchTerm = '';
    selectedCategoryId = null;

    await Future.wait([_loadCategories(), _fetchTasks(reset: true)]);
  }

  void _sortByDueDate(List<Task> tasks) {
    tasks.sort((a, b) {
      if (a.dueDate == null && b.dueDate == null) return 0;
      if (a.dueDate == null) return 1;
      if (b.dueDate == null) return -1;
      return a.dueDate!.compareTo(b.dueDate!);
    });
  }

  Future<void> _applyFilters({bool reset = false}) async {
    if (_token == null) return;

    final showLoading = reset && _tasks.isEmpty;

    if (showLoading) setState(() => _isLoading = true);

    try {
      final data = await _apiService.fetchTasks(
        token: _token!,
        page: reset ? 1 : _page,
        limit: _limit,
        searchTerm: _searchTerm.isNotEmpty ? _searchTerm : null,
        categoryId: selectedCategoryId,
      );

      setState(() {
        if (reset) {
          _tasks.clear();
          _page = 1;
          _hasMore = true;
        }
        _tasks.addAll(data);
        if (data.length < _limit) _hasMore = false;
        if (!reset) _page++;
      });
    } finally {
      if (showLoading) setState(() => _isLoading = false);
    }
  }

  List<Task> get _filteredTasks {
    return _tasks.where((task) {
      final matchCategory =
          selectedCategoryId == null || task.categoryId == selectedCategoryId;
      final matchSearch =
          _searchTerm.isEmpty ||
          task.title.toLowerCase().contains(_searchTerm.toLowerCase()) ||
          (task.description?.toLowerCase().contains(
                _searchTerm.toLowerCase(),
              ) ??
              false);
      return matchCategory && matchSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final todoTasks = _filteredTasks
        .where((task) => task.status != 'done')
        .toList();
    final completedTasks = _filteredTasks
        .where((task) => task.status == 'done')
        .toList();

    _sortByDueDate(todoTasks);
    _sortByDueDate(completedTasks);
    return SafeArea(
      child: Scaffold(
        backgroundColor: AppTheme.background,
        body: RefreshIndicator(
          onRefresh: _refreshTasks,
          child: CustomScrollView(
            controller: _scrollController,
            slivers: [
              /// HEADER
              SliverToBoxAdapter(
                child: Container(
                  color: AppTheme.background,
                  child: Column(
                    children: [
                      const SizedBox(height: 20),

                      // HEADER ROW
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            // SEARCH FIELD
                            Expanded(
                              flex: 5,
                              child: Container(
                                height: 44,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 15,
                                ),
                                child: Row(
                                  children: [
                                    const Icon(
                                      Icons.search,
                                      color: Colors.grey,
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: TextField(
                                        controller: _searchController,
                                        decoration: const InputDecoration(
                                          hintText: 'Search tasks .....',
                                          border: InputBorder.none,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              flex: 3,
                              child: ElevatedButton(
                                style: ButtonStyle(
                                  padding: const WidgetStatePropertyAll(
                                    EdgeInsets.only(right: 0, left: 6),
                                  ),
                                  fixedSize: const WidgetStatePropertyAll(
                                    Size(105, 30),
                                  ),
                                  backgroundColor: const WidgetStatePropertyAll(
                                    AppTheme.primary,
                                  ),
                                  elevation: const WidgetStatePropertyAll(0),
                                  shape: WidgetStatePropertyAll(
                                    RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                ),
                                onPressed: () async {
                                  final newTask = await Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => NewTaskPage(defaultCategoryId:selectedCategoryId,),

                                    ),
                                  );
                                  if (newTask != null) {
                                    await _refreshTasks();
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text(
                                          'Task created successfully!',
                                        ),
                                        backgroundColor: Colors.green,
                                      ),
                                    );
                                  }
                                },
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10,
                                    vertical: 6,
                                  ),
                                  child: const Row(
                                    children: [
                                      Icon(Icons.add, color: Colors.white),
                                      SizedBox(width: 5),
                                      Text(
                                        'New Task',
                                        style: TextStyle(color: Colors.white),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 10),
                      _buildCategoryFilters(),
                    ],
                  ),
                ),
              ),

              if (_isLoading && _tasks.isEmpty)
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (_, __) => const TasksCardShimmer(),
                    childCount: 3,
                  ),
                ),

              if (!_isLoading && todoTasks.isEmpty && completedTasks.isEmpty)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 60),
                    child: Center(
                      child: Text(
                        selectedCategoryId == null
                            ? 'No tasks found'
                            : 'No tasks found for this category',
                        style: const TextStyle(color: Colors.grey),
                      ),
                    ),
                  ),
                ),

              if (todoTasks.isNotEmpty) _buildTaskList('TO DO', todoTasks),

              if (completedTasks.isNotEmpty)
                _buildTaskList('Completed', completedTasks),

              if (_isLoading && _tasks.isNotEmpty)
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (_, __) =>
                        const TasksCardShimmer(),
                    childCount: 1,
                  ),
                ),

              const SliverToBoxAdapter(child: SizedBox(height: 30)),
            ],
          ),
        ),
      ),
    );
  }

  SliverList _buildTaskList(String title, List<Task> tasks) {
    return SliverList(
      delegate: SliverChildBuilderDelegate((context, index) {
        if (index == 0) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 10),
            child: Text(
              '$title (${tasks.length})',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
          );
        }

        final task = tasks[index - 1];
        return TasksScreenCard(
            task: task,
            onStatusChanged: _toggleTaskStatus,
            onEdit: _editTask,
            );
      }, childCount: tasks.length + 1),
    );
  }

  Widget _buildCategoryFilters() {
    return SizedBox(
      height: 50,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 15),
        itemCount: _categories.length + 1,
        itemBuilder: (context, index) {
          final bool isAll = index == 0;
          final category = isAll ? null : _categories[index - 1];
          final bool isSelected = selectedCategoryId == (category?.id);

          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            child: FilterChip(
              showCheckmark: false,
              label: Text(isAll ? 'All' : category!.name),
              selected: isSelected,
              onSelected: (_) {
                setState(() => selectedCategoryId = category?.id);
                _applyFilters(reset: true);
              },
              selectedColor: const Color(0xFF5D5FEF),
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : Colors.black,
              ),
            ),
          );
        },
      ),
    );
  }
}
