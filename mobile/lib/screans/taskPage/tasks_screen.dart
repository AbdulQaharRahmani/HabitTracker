import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:habit_tracker/utils/tasks_page_component/tasks_card.dart';

import '../../utils/tasks_page_component/habit.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  double avatarRadius = 10;
  double statusRadius = 5;

  late final Habit habit;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFEFF2F6),
      appBar: AppBar(
        backgroundColor: Color(0xFFEFF2F6),
        // actionsPadding: EdgeInsets.symmetric(horizontal: 25, vertical: 9),
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
                    child: CircleAvatar(
                      radius: avatarRadius,
                      backgroundImage: AssetImage('assets/images.png'),
                    ),
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
            // Text for uer name
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(padding: EdgeInsetsGeometry.only(top: 15)),
                Text(
                  'Ahmad Amiri',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                ),
                Text(
                  'Veiw Profile',
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
                  // TODO: action
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
      //  The body of screen


      body: SingleChildScrollView(
        padding: EdgeInsets.only(top: 15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            //  Row for all tasks
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
                      // TODO : action
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

            //  ======= search box  =======
            Container(
              // color: Colors.red,
              height: 44,
              margin: EdgeInsets.symmetric(horizontal: 30),
              child: SearchBar(
                backgroundColor: WidgetStatePropertyAll(Colors.white),
                shape: WidgetStatePropertyAll(
                  RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25),
                  ),
                ),
                leading: Icon(Icons.search,color: Colors.grey,),
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

            // Row for to do and active
            const SizedBox(height: 10),
            Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: 25),
                  child: Text(
                    'To Do',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize:25),
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
                        // backgroundColor: Colors.blue.shade100
                      ),
                    ),
                  ),
                ),
              ],
            ),


            //  list to show habits card
            const SizedBox(
              height:10,
            ),
            //  Tasks card

            TasksCard(),

          ],
        ),
      ),
    );
  }
}
