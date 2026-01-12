import 'package:flutter/material.dart';
import 'package:habit_tracker/screens/taskScreen/add_task_screen.dart';
import 'package:habit_tracker/utils/tasks_page_component/tasks_card.dart';
import '../../services/taskPageAPI/task_api.dart';
import '../../utils/tasks_page_component/habit.dart';

class TasksScreen extends StatefulWidget {
  final String token;

  const TasksScreen({super.key, required this.token});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  double avatarRadius = 10;
  double statusRadius = 5;
  final TaskApiService _apiService = TaskApiService();
  late Future<List<Habit>> _tasksFuture;

  @override
  void initState() {
    super.initState();
    // ⚡ fetchTasks with the token
    _tasksFuture = _apiService.fetchTasks(widget.token);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFEFF2F6),
      appBar: AppBar(
        backgroundColor: Color(0xFFEFF2F6),
        title: Row(
          children: [
            Padding(
              padding: const EdgeInsets.only(left: 5, top: 6),
              child: Stack(
                children: [
                  // ====== User Avatar ======
                  Container(
                    height: 50,
                    width: 50,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.grey.shade300, width: 2),
                    ),
                    child: CircleAvatar(
                      radius: avatarRadius,
                      backgroundImage: AssetImage('assets/images/image.png'),
                    ),
                  ),
                  // ====== Online Status Dot ======
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
            // ====== Name and Profile ======
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(padding: EdgeInsets.only(top: 15)),
                Text(
                  'Ahmad Amiri',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
                Text(
                  'View Profile',
                  style: TextStyle(fontSize: 13, color: Colors.blue),
                ),
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
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
              ),
              child: IconButton(
                onPressed: () {
                  // TODO: notification action
                },
                icon: Icon(
                  Icons.notifications_active_rounded,
                  color: Colors.black,
                  size: 30,
                ),
              ),
            ),
          ),
        ],
      ),

      // ====== Body ======
      body: SingleChildScrollView(
        padding: EdgeInsets.only(top: 15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ====== Row: Title + New Task Button ======
            Container(
              padding: EdgeInsets.symmetric(horizontal: 30),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'All Tasks',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25),
                  ),
                  ElevatedButton(
                    style: ButtonStyle(
                      padding: WidgetStatePropertyAll(
                        EdgeInsets.only(right: 0, left: 6),
                      ),
                      fixedSize: WidgetStatePropertyAll(Size(105, 30)),
                      backgroundColor: WidgetStatePropertyAll(Colors.blue),
                      elevation: WidgetStatePropertyAll(0),
                      shape: WidgetStatePropertyAll(
                        RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                    onPressed: () {
                      Navigator.push(context,
                          MaterialPageRoute(builder: (_) => NewTaskPage()));
                    },
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Icon(Icons.add, color: Colors.white),
                        const SizedBox(width: 5),
                        Text('New Task', style: TextStyle(color: Colors.white)),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 5),

            // ====== Search Box ======
            Container(
              height: 44,
              margin: EdgeInsets.symmetric(horizontal: 30),
              child: SearchBar(
                backgroundColor: WidgetStatePropertyAll(Colors.white),
                shape: WidgetStatePropertyAll(
                  RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25),
                  ),
                ),
                leading: Icon(Icons.search, color: Colors.grey),
                padding: WidgetStatePropertyAll(
                  EdgeInsets.only(left: 15, right: 0),
                ),
                elevation: WidgetStatePropertyAll(0),
                hintText: 'search tasks .....',
                textStyle: WidgetStatePropertyAll(
                  TextStyle(color: Colors.grey),
                ),
              ),
            ),

            const SizedBox(height: 10),

            // ====== Row: To Do & Active Tasks ======
            Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: 25),
                  child: Text(
                    'To Do',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 25),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.only(right: 25),
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                    height: 25,
                    width: 70,
                    decoration: BoxDecoration(
                      color: Colors.blue.shade100,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      '3 Active',
                      style: TextStyle(
                        color: Colors.blue.shade800,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),

            // ====== FutureBuilder to load Tasks ======
            FutureBuilder<List<Habit>>(
              future: _tasksFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return Center(child: Text(snapshot.error.toString()));
                }

                if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Center(child: Text('No tasks available'));
                }

                // ====== Display TasksCard ======
                return TasksCard(habits: snapshot.data!);
              },
            ),
          ],
        ),
      ),
    );
  }
}
