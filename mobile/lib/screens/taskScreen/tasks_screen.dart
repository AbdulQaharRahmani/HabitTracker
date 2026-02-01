import 'package:flutter/material.dart';
import 'package:habit_tracker/screens/taskScreen/add_task_screen.dart';
import '../../app/app_theme.dart';
import '../../services/taskpage_api/tasks_api.dart';
import '../../utils/taskpage_components/tasks_model.dart';
import '../../utils/taskpage_components/token_storage.dart';
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

  final List<Task> _tasks = [];
  bool _isLoading = true;
  bool _hasMore = true;

  int _page = 1;
  final int _limit = 8;
  String? _token;

  @override
  void initState() {
    super.initState();
    _init();
    _scrollController.addListener(_onScroll);
  }

  Future<void> _init() async {
    _token = await TokenStorage.getToken();
    if (_token == null) return;
    await _fetchTasks(reset: true);
  }

  Future<void> _fetchTasks({bool reset = false}) async {
    if (reset) {
      _page = 1;
      _tasks.clear();
      _hasMore = true;
    }

    setState(() {
      if (reset) _isLoading = true;
    });

    try {
      final data = await _apiService.fetchTasks(
        token: _token!,
        page: _page,
        limit: _limit,
      );

      if (data.length < _limit) _hasMore = false;

      // ✅ تسک جدید میاد اول لیست، UI بدون تغییر
      _tasks.addAll(data.reversed);

      _page++;
    } catch (_) {
      // ignore
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _onScroll() {
    if (!_hasMore) return;

    if (_scrollController.position.pixels >
        _scrollController.position.maxScrollExtent - 200) {
      _fetchTasks();
    }
  }

  /// Optimistic UI toggle
  Future<void> _toggleTaskStatus(Task task) async {
    final oldStatus = task.status;
    final index = _tasks.indexWhere((t) => t.id == task.id);
    if (index == -1) return;

    setState(() {
      _tasks[index] = _tasks[index].copyWith(
        status: oldStatus == 'done' ? 'todo' : 'done',
      );
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
    if (result != null) await _fetchTasks(reset: true);
  }

  Future<void> _refreshTasks() async => await _fetchTasks(reset: true);

  @override
  Widget build(BuildContext context) {
    final filteredTasks = _tasks
        .where((t) =>
        t.title.toLowerCase().contains(
          _searchController.text.toLowerCase(),
        ))
        .toList();

    final activeTasks =
    filteredTasks.where((t) => t.status != 'done').toList();
    final completedTasks =
    filteredTasks.where((t) => t.status == 'done').toList();

    return SafeArea(
      child: Scaffold(
        backgroundColor: const Color(0xFFEFF2F6),
        body: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : RefreshIndicator(
          onRefresh: () => _fetchTasks(reset: true),
          child: CustomScrollView(
            controller: _scrollController,
            slivers: [
              /// ===== Header =====
              SliverToBoxAdapter(
                child: Column(
                  children: [
                    const SizedBox(height: 20),
                    Padding(
                      padding:
                      const EdgeInsets.symmetric(horizontal: 30),
                      child: Row(
                        mainAxisAlignment:
                        MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'All Tasks',
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 25),
                          ),
                          ElevatedButton(
                            style: ButtonStyle(
                              padding:
                              const WidgetStatePropertyAll(
                                EdgeInsets.only(right: 0, left: 6),
                              ),
                              fixedSize:
                              const WidgetStatePropertyAll(
                                  Size(105, 30)),
                              backgroundColor:
                              const WidgetStatePropertyAll(
                                AppTheme.primary,
                              ),
                              elevation:
                              const WidgetStatePropertyAll(0),
                              shape: WidgetStatePropertyAll(
                                RoundedRectangleBorder(
                                  borderRadius:
                                  BorderRadius.circular(12),
                                ),
                              ),
                            ),
                            onPressed: () async {
                              final newTask = await Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (_) =>
                                    const NewTaskPage()),
                              );
                              if (newTask != null) {
                                await _refreshTasks();
                                ScaffoldMessenger.of(context)
                                    .showSnackBar(
                                  const SnackBar(
                                    content: Text(
                                        'Task created successfully!'),
                                    backgroundColor: Colors.green,
                                  ),
                                );
                              }
                            },
                            child: Row(
                              children: const [
                                Icon(Icons.add,
                                    color: Colors.white),
                                SizedBox(width: 5),
                                Text('New Task',
                                    style: TextStyle(
                                        color: Colors.white)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),

                    /// Search
                    Padding(
                      padding:
                      const EdgeInsets.symmetric(horizontal: 30),
                      child: Container(
                        height: 44,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(25),
                        ),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 15),
                        child: Row(
                          children: [
                            const Icon(Icons.search,
                                color: Colors.grey),
                            const SizedBox(width: 10),
                            Expanded(
                              child: TextField(
                                controller: _searchController,
                                decoration:
                                const InputDecoration(
                                  hintText:
                                  'search tasks .....',
                                  border: InputBorder.none,
                                  isDense: true,
                                  contentPadding: EdgeInsets.zero,
                                ),
                                style: const TextStyle(
                                    color: Colors.grey),
                                onChanged: (_) => setState(() {}),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                  ],
                ),
              ),

              /// ===== Active Tasks =====
              if (activeTasks.isNotEmpty)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 30, vertical: 10),
                    child: Text(
                      'TO DO (${activeTasks.length})',
                      style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              if (activeTasks.isNotEmpty)
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                        (context, index) {
                      final task = activeTasks[index];
                      return TasksCard(
                        tasks: [task],
                        onStatusChanged: (t) =>
                            _toggleTaskStatus(t),
                        onEdit: (t) => _editTask(t),
                      );
                    },
                    childCount: activeTasks.length,
                  ),
                ),

              /// ===== Completed Tasks =====
              if (completedTasks.isNotEmpty)
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 30, vertical: 10),
                    child: Text(
                      'Completed (${completedTasks.length})',
                      style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              if (completedTasks.isNotEmpty)
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 15),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                          (context, index) {
                        final task =
                        completedTasks[index];
                        return TasksCard(
                          tasks: [task],
                          onStatusChanged: (t) =>
                              _toggleTaskStatus(t),
                          onEdit: (t) => _editTask(t),
                        );
                      },
                      childCount: completedTasks.length,
                    ),
                  ),
                ),

              const SliverToBoxAdapter(
                  child: SizedBox(height: 30)),
            ],
          ),
        ),
      ),
    );
  }
}
