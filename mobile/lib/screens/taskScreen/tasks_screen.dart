import 'package:flutter/material.dart';
import 'package:habit_tracker/screens/taskScreen/add_task_screen.dart';
import '../../services/taskpage_api/tasks_api.dart';
import '../../utils/taskpage_components/tasks_card.dart';
import '../../utils/taskpage_components/tasks_model.dart';
import '../../utils/taskpage_components/token_storage.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  final TaskApiService _apiService = TaskApiService();
  late Future<List<Task>> _tasksFuture = Future.value([]);
  final TextEditingController _searchController = TextEditingController();
  String? _token;

  final double avatarRadius = 10;
  final double statusRadius = 5;

  @override
  void initState() {
    super.initState();
    _loadTokenAndTasks();
  }

  Future<void> _loadTokenAndTasks() async {
    final token = await TokenStorage.getToken();
    setState(() {
      _token = token;
      _tasksFuture = token != null ? _apiService.fetchTasks(token: token, page: 1) : Future.value([]);
    });
  }

  Future<void> _refreshTasks() async {
    if (_token == null) return;
    final tasks = await _apiService.fetchTasks(token: _token!, page: 1);
    setState(() {
      _tasksFuture = Future.value(tasks);
    });
  }

  void _toggleTaskStatus(Task task) async {
    if (_token != null) {
      await _apiService.toggleTaskStatus(
        taskId: task.id,
        currentStatus: task.status,
        token: _token,
      );
    }
    await _refreshTasks();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF2F6),
      appBar: AppBar(
        backgroundColor: const Color(0xFFEFF2F6),
        title: Row(
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 5, top: 6),
              child: Stack(
                children: [
                  Container(
                    height: 50,
                    width: 50,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.grey.shade300, width: 2),
                    ),
                    child: CircleAvatar(radius: avatarRadius, child: const Icon(Icons.person)),
                  ),
                  Positioned(
                    bottom: 3,
                    right: 2,
                    child: Container(
                      width: statusRadius * 2,
                      height: statusRadius * 2,
                      decoration: BoxDecoration(
                        color: Colors.green,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Padding(padding: EdgeInsets.only(top: 15)),
                Text('Ahmad Amiri', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                Text('View Profile', style: TextStyle(fontSize: 13, color: Colors.blue)),
              ],
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 30, top: 10),
            child: Container(
              width: 50,
              height: 50,
              decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle),
              child: IconButton(
                onPressed: () {},
                icon: const Icon(Icons.notifications_active_rounded, color: Colors.black, size: 30),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(top: 15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header + New Task
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('All Tasks', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25)),
                  ElevatedButton(
                    style: ButtonStyle(
                      padding: const MaterialStatePropertyAll(EdgeInsets.only(right: 0, left: 6)),
                      fixedSize: const MaterialStatePropertyAll(Size(105, 30)),
                      backgroundColor: const MaterialStatePropertyAll(Colors.blue),
                      elevation: const MaterialStatePropertyAll(0),
                      shape: MaterialStatePropertyAll(
                        RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                    ),
                    onPressed: () async {
                      final newTask = await Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const NewTaskPage()),
                      );
                      if (newTask != null) {
                        await _refreshTasks();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Task created successfully!'), backgroundColor: Colors.green),
                        );
                      }
                    },
                    child: Row(
                      children: const [
                        Icon(Icons.add, color: Colors.white),
                        SizedBox(width: 5),
                        Text('New Task', style: TextStyle(color: Colors.white)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10),

            // Search Box
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30),
              child: Container(
                height: 44,
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(25)),
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
                          isDense: true,
                          contentPadding: EdgeInsets.zero,
                        ),
                        style: const TextStyle(color: Colors.grey),
                        onChanged: (_) => setState(() {}),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 10),

            // Tasks List
            FutureBuilder<List<Task>>(
              future: _tasksFuture,
              builder: (context, snapshot) {
                if (_token == null) return const Center(child: Text('No token found'));
                if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
                if (snapshot.hasError) return Center(child: Text(snapshot.error.toString()));
                if (!snapshot.hasData || snapshot.data!.isEmpty) return const Center(child: Text('No tasks available'));

                final filteredTasks = snapshot.data!
                    .where((t) => t.title.toLowerCase().contains(_searchController.text.toLowerCase()))
                    .toList();

                final activeTasks = filteredTasks.where((t) => t.status != 'done').toList();
                final completedTasks = filteredTasks.where((t) => t.status == 'done').toList();

                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Active Tasks
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 30),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('To Do', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                            height: 25,
                            width: 80,
                            decoration: BoxDecoration(
                              color: Colors.blue.shade100,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Center(
                              child: Text('${activeTasks.length} Active',
                                  style: TextStyle(color: Colors.blue.shade800, fontWeight: FontWeight.bold)),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 15),
                    TasksCard(tasks: activeTasks, onStatusChanged: (task) => _toggleTaskStatus(task)),

                    const SizedBox(height: 20),
                    if (completedTasks.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 30),
                        child: const Text('Completed',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20, color: Colors.grey)),
                      ),
                    const SizedBox(height: 10),
                    if (completedTasks.isNotEmpty)
                      TasksCard(tasks: completedTasks, onStatusChanged: (task) => _toggleTaskStatus(task)),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
