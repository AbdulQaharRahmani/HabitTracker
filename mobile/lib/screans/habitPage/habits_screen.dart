import 'package:flutter/material.dart';
import 'package:habit_tracker/utils/habits/habit_card.dart';

class HabitsScreen extends StatefulWidget {
  const HabitsScreen({super.key});

  @override
  State<HabitsScreen> createState() => _HabitsScreenState();
}

class _HabitsScreenState extends State<HabitsScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFEFF2F6),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 20),
              // ======= Header =======
              Text(
                "My Habit",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
              ),
              const SizedBox(height: 10),
              Text(
                'Manage and track your daily routines effectively.',
                style: TextStyle(color: Colors.grey),
              ),
              const SizedBox(height:20),

              // ======= Search + New Habit Button =======
              Row(
                children: [
                  Expanded(
                    flex: 5,
                    child: TextField(
                      decoration: InputDecoration(
                        contentPadding: EdgeInsets.symmetric(vertical: 5, horizontal:10),
                        hintText: 'Search....',hintStyle: TextStyle(
                        color: Colors.grey
                      ),
                        prefixIcon: Icon(Icons.search,color: Colors.grey,),
                        fillColor: Color(0xFFF9FAFB),
                        filled: true,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onChanged: (value) {
                        // TODO: implement search filter
                      },
                    ),
                  ),
                  SizedBox(width: 20),
                  Expanded(
                    flex: 3,
                    child: SizedBox(
                      height: 47,
                      child: FloatingActionButton.extended(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(11)
                        ),
                        onPressed: () {
                          // TODO: open new habit form
                        },
                        icon: Icon(Icons.add,color: Color(0xFFFFFFFF),),
                        label: Padding(
                          padding: const EdgeInsets.only(right: 5),
                          child: Text('New Habit',style: TextStyle(
                            color: Color(0xFFFFFFFF)
                          ),),
                        ),
                        elevation: 0,
                        backgroundColor: Colors.blue,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // ======= Habit List =======
              Expanded(
                child: HabitCard(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
