import 'package:flutter/material.dart';
import 'package:habit_tracker/screens/taskScreen/add_task_screen.dart';
import '../../app/app_theme.dart';
import '../../services/taskpage_api/tasks_api.dart';
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

  final List<Task> _tasks = [];
  bool _isLoading = false;
  bool _hasMore = true;

  int _page = 1;
  final int _limit = 20;
  String? _token;

  @override
  void initState() {
    super.initState();
    _init();
    _scrollController.addListener(_onScroll);
  }

  Future<void> _init() async {
    _token = await AuthManager.getToken();
    if (_token == null) return;
    await _fetchTasks(reset: true);
  }

  Future<void> _fetchTasks({bool reset = false}) async {
    if (_isLoading) return;
    if (reset) {
      _page = 1;
      _tasks.clear();
      _hasMore = true;
    }

    if (!_hasMore && !reset) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final data = await _apiService.fetchTasks(
        token: _token!,
        page: _page,
        limit: _limit,
      );

      final newTasks = data
          .where((t) => !_tasks.any((old) => old.id == t.id))
          .toList();

      _tasks.addAll(newTasks);

      if (data.length < _limit) _hasMore = false;
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

    // (Optimistic Update)
    setState(() {
      _tasks[index] = _tasks[index].copyWith(status: newStatus);
    });

    try {
      await _apiService.toggleTaskStatus(
        taskId: task.id,
        currentStatus: oldStatus,
        token: _token!,
      );
    } catch (e) {
      setState(() {
        _tasks[index] = _tasks[index].copyWith(status: oldStatus);
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Failed to update task status!'),
          backgroundColor: Colors.red,
        ),
      );
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
    final filteredTasks = _tasks
        .where(
          (t) => t.title.toLowerCase().contains(
            _searchController.text.toLowerCase(),
          ),
        )
        .toList();

    final activeTasks = filteredTasks.where((t) => t.status != 'done').toList();
    final completedTasks = filteredTasks
        .where((t) => t.status == 'done')
        .toList();

    _sortByDueDate(activeTasks);
    _sortByDueDate(completedTasks);

    return SafeArea(
      child: Scaffold(
        backgroundColor: const Color(0xFFEFF2F6),
        body: RefreshIndicator(
          onRefresh: _refreshTasks,
          child: CustomScrollView(
            controller: _scrollController,
            slivers: [
              /// Header
              SliverToBoxAdapter(
                child: Column(
                  children: [
                    const SizedBox(height: 20),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 30),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'All Tasks',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 25,
                            ),
                          ),
                          ElevatedButton(
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
                                  builder: (_) => const NewTaskPage(),
                                ),
                              );
                              if (newTask != null) {
                                await _refreshTasks();
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Task created successfully!'),
                                    backgroundColor: Colors.green,
                                  ),
                                );
                              }
                            },
                            child: Row(
                              children: const [
                                Icon(Icons.add, color: Colors.white),
                                SizedBox(width: 5),
                                Text(
                                  'New Task',
                                  style: TextStyle(color: Colors.white),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 10),

                    /// Search
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 30),
                      child: Container(
                        height: 44,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(25),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 15),
                        child: Row(
                          children: [
                            const Icon(Icons.search, color: Colors.grey),
                            const SizedBox(width: 10),
                            Expanded(
                              child: TextField(
                                controller: _searchController,
                                decoration: const InputDecoration(
                                  hintText: 'search tasks .....',
                                  border: InputBorder.none,
                                ),
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

              /// ACTIVE TASKS
              if (activeTasks.isNotEmpty)
                _buildSection(
                  title: 'TO DO (${activeTasks.length})',
                  tasks: activeTasks,
                ),

              /// COMPLETED TASKS
              if (completedTasks.isNotEmpty)
                _buildSection(
                  title: 'Completed (${completedTasks.length})',
                  tasks: completedTasks,
                ),

              const SliverToBoxAdapter(child: SizedBox(height: 30)),
            ],
          ),
        ),
      ),
    );
  }

  SliverList _buildSection({required String title, required List<Task> tasks}) {
    return SliverList(
      delegate: SliverChildBuilderDelegate((context, index) {
        if (index == 0) {
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 10),
            child: Text(
              title,
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
}
