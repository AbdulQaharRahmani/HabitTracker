import 'package:flutter/material.dart';
import 'habit.dart';

class HabitCard extends StatefulWidget {
  const HabitCard({super.key});

  @override
  State<HabitCard> createState() => _HabitCardState();
}

class _HabitCardState extends State<HabitCard> {
  final List<Habit> _habits = [
    Habit(
      title: 'Running',
      description: 'Running to the mountains',
      category: 'Health'.toUpperCase(),
      color: Colors.blue,
      icon: Icons.directions_run,
      frequency: 'Daily',
      timeInMinutes: 30,
    ),
    Habit(
      title: 'Footsall',
      description: 'Go to gym ',
      category: 'Study'.toUpperCase(),
      color: Colors.green,
      icon: Icons.menu_book,
      frequency: 'Weekly',
      timeInMinutes: 60,

    ),
    Habit(
      title: 'Club',
      description: 'Go to club',
      category: 'Study'.toUpperCase(),
      color: Colors.deepOrange,
      icon: Icons.menu_book,
      frequency: 'monthly',
      timeInMinutes: 60,

    ),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: _habits.length,
      itemBuilder: (context, index) {
        final habit = _habits[index];
        return Card(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(18),
          ),
          color:Color(0xFFFFFFFF),
          elevation: 0,
          margin: EdgeInsets.only(bottom: 15),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(8,4, 5, 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // ======  Icon section ======
                Container(
                  padding: EdgeInsets.all(10),
                  margin: EdgeInsets.only(bottom: 30),
                  decoration: BoxDecoration(
                    color: habit.color.withAlpha(51),
                    borderRadius: BorderRadius.circular(50),
                  ),
                  child: Icon(habit.icon, size: 30, color: habit.color),
                ),
                // const SizedBox(
                //   width: 5,
                // ),

                // ====== Information section of habit  ======
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal:10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          habit.title,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        // SizedBox(height:3),
                        Text(habit.description,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                          color: Colors.grey, fontSize: 13,

                        ),),
                        SizedBox(height: 5),
                        Row(
                          children: [
                            Container(
                              padding: EdgeInsets.symmetric(horizontal:6, vertical: 4),
                                decoration:BoxDecoration(
                                      color: habit.color.withAlpha(51),
                                  borderRadius: BorderRadius.circular(5)
                                ),
                                child: Text(
                                  '${habit.category}',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                    // backgroundColor: habit.color.withAlpha(51),
                                    color: habit.color,
                                  ),
                                ),
                              ),

                            const SizedBox(width: 2),
                            Text(
                              '${habit.frequency} ',
                              style: TextStyle(fontSize: 11.5,color: Colors.grey),
                            ),
                            Text(' ● ',style: TextStyle(
                              color: Colors.green[200]
                            ),),
                            Text(
                              '${habit.timeInMinutes} min',
                              style: TextStyle(fontSize: 11.5,color: Colors.grey,),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                // ======  Action buttons ======
                Column(
                  children: [
                    IconButton(onPressed: () {}, icon: Icon(Icons.edit)),
                    IconButton(onPressed: () {}, icon: Icon(Icons.delete)),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
