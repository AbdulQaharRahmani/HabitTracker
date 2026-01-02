import 'package:flutter/material.dart';
import 'habit.dart';

class TasksCard extends StatefulWidget {
  const TasksCard({super.key});

  @override
  State<TasksCard> createState() => _TasksCardState();
}

class _TasksCardState extends State<TasksCard> {
  final List<Habit> _habits = [
    Habit(
      title: 'Read Book',
      description: 'Read a book for 20 min',
      category: 'Health',
      isCompleted: false,
      iconColor: Colors.deepOrange,
      taskIcon: Icons.menu_book,
      timeInMin: 30,
    ),
    Habit(
      title: 'Meditation',
      description: 'Meditation for 20 min',
      category: 'Health',
      isCompleted: false,
      iconColor: Colors.purple,
      taskIcon: Icons.self_improvement
      ,
      timeInMin: 30,
    ),
    Habit(
      title: 'Evening Workout',
      description: 'Exercise  for 20 min',
      category: 'Health',
      isCompleted: false,
      iconColor: Colors.red,
      taskIcon:Icons.fitness_center,
      timeInMin: 30,
    ),
    Habit(
      title: 'Evening Workout',
      description: 'Exercise  for 20 min',
      category: 'Health',
      isCompleted: false,
      iconColor: Colors.red,
      taskIcon:Icons.fitness_center,
      timeInMin: 30,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final activeHabits = _habits.where((h) => !h.isCompleted).toList();
    final completedHabits = _habits.where((h) => h.isCompleted).toList();


    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [

          // ====== active tasks ======
          ListView.builder(
              itemCount: activeHabits.length,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemBuilder: (context, index) {
                return _buildHabitCard(activeHabits[index],index);
              }),

          // const SizedBox(
          //   height:5,
          // ),

          //  ====== complete Tasks  ======
          if (completedHabits.isNotEmpty)
            Column(crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: Text("Completed Tasks", style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey,),),),
                const SizedBox(
                  height:5,
                ),
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: completedHabits.length,
                  itemBuilder: (context, index) {
                    return  _buildHabitCard(completedHabits[index], index, isCompleted: true);
                  },
                ),
              ],
            ),


        ],

      ),

    );
  }

  Widget _buildHabitCard(Habit habit, int index ,{bool isCompleted = false}) {
    return Card(
      color: isCompleted ? Colors.grey.shade200 : Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
          borderRadius: BorderRadiusGeometry.circular(25)
      ),
      margin: const EdgeInsets.fromLTRB(21, 0, 21, 10),
      // margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ======= Icon of task =======
            Container(
              margin: EdgeInsets.only(top: 9),
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color:habit.isCompleted ?Colors.grey.withAlpha(25): habit.iconColor.withAlpha(38),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                habit.taskIcon,
                color: habit.isCompleted ?Colors.grey: habit.iconColor,
              ),
            ),

            const SizedBox(width: 12),

            // =======  Content of task card =======
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // =======  Title row =======
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          habit.title,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            decoration:
                            habit.isCompleted ? TextDecoration.lineThrough : TextDecoration.none,
                            color: habit.isCompleted ? Colors.grey : Colors.black,
                          ),
                        ),
                      ),
                      IconButton(
                        padding: EdgeInsets.only(left: 35),
                        icon: const Icon(
                          Icons.delete, size: 23, color: Colors.grey,),
                        onPressed: () {
                          setState(() {
                            _habits.removeAt(index);
                          });
                        },
                      ),
                      // =======  check box =======
                      Transform.scale(
                        scale: 1.38,
                        child: Checkbox(
                          activeColor: habit.isCompleted ?Colors.grey : Colors.blue,
                          checkColor: Colors.white,
                          side: BorderSide(
                              color: Colors.grey.shade400, width: 2
                          ),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadiusGeometry.circular(5)
                          ),
                          value: habit.isCompleted,
                          onChanged: (value) {
                            setState(() {
                              habit.isCompleted = value!;
                            });
                          },
                        ),
                      ),

                    ],
                  ),

                  // const SizedBox(height:0),

                  // =======  Description =======
                  Text(
                    habit.description,
                    style: const TextStyle(
                      color: Colors.grey,

                    ),
                  ),

                  const SizedBox(height: 6),

                  // =======  Category Badge =======

                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 15,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: habit.isCompleted? Colors.grey.withAlpha(40): habit.iconColor.withAlpha(40),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          habit.category.toUpperCase(),
                          style: TextStyle(
                            color:habit.isCompleted?Colors.grey: habit.iconColor,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      SizedBox(width: 10,),
                      // =======  Time of tasks =======
                      if (!habit.isCompleted) ...[
                        Icon(Icons.access_time_outlined, color: Colors.grey, size: 15),
                        SizedBox(width: 4),
                        Text(
                          '1h',
                          style: TextStyle(color: Colors.grey),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
