import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import '../../app/app_theme.dart';
import '../../utils/habits/habit.dart';
import '../../utils/habits/habit_card.dart';
import 'add_habit.dart';


class HabitsScreen extends StatefulWidget {
  const HabitsScreen({super.key});

  @override
  State<HabitsScreen> createState() => _HabitsScreenState();
}

class _HabitsScreenState extends State<HabitsScreen> {
  List<Habit> _habits = [];
  bool _isLoading = true;
  String? _errorMessage;
  String _searchQuery = '';


  @override
  void initState() {
    super.initState();
    _fetchHabits();
  }

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }

  Future<void> _fetchHabits() async {
    final url = Uri.parse('https://habit-tracker-17sr.onrender.com/api/habits');

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final token = await _getToken();

      if (token == null) {
        setState(() {
          _errorMessage = "Please login again (token not found)";
          _isLoading = false;
        });
        return;
      }

      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 30));

      if (response.statusCode == 200) {
        final Map<String, dynamic> decodedData = jsonDecode(response.body);

        if (decodedData['success'] == true) {
          final List<dynamic> habitsJson = decodedData['data'];

          setState(() {
            _habits = habitsJson.map((item) => Habit.fromJson(item)).toList().reversed.toList();
            _isLoading = false;
          });
        } else {
          setState(() {
            _errorMessage = "Failed to load habits";
            _isLoading = false;
          });
        }
      } else {
        setState(() {
          _errorMessage = "Server error: ${response.statusCode}";
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = "Network error: $e";
        _isLoading = false;
      });
    }
  }

  Future<void> _deleteHabit(String habitId, int index) async {
    try {
      final token = await _getToken();
      final url = Uri.parse('https://habit-tracker-17sr.onrender.com/api/habits/$habitId');

      final response = await http.delete(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        // Remove from local list
        setState(() {
          _habits.removeAt(index);
        });

        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Habit deleted successfully'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to delete habit'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _editHabit(Habit habit) async {
    // TODO: Implement edit dialog
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Edit Habit'),
        content: Text('Edit feature will be implemented soon'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  Future<void> _refreshHabits() async {
    await _fetchHabits();
  }

  // فیلتر کردن habits بر اساس جستجو
  List<Habit> get _filteredHabits {
    if (_searchQuery.isEmpty) return _habits;
    return _habits.where((habit) {
      return habit.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          habit.description.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          habit.category.name.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 20),
              // ======= Header =======
              Text(
                "My Habits",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
              ),
              const SizedBox(height: 10),
              Text(
                'Manage and track your daily routines effectively.',
                style: TextStyle(color: AppTheme.textMuted),
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
                        hintText: 'Search....',
                        hintStyle: TextStyle(color: AppTheme.textMuted),
                        prefixIcon: Icon(Icons.search, color: Colors.grey),
                        fillColor: Color(0xFFF9FAFB),
                        filled: true,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(15),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onChanged: (value) {
                        setState(() {
                          _searchQuery = value;
                        });
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
                          AddHabitDialog.show(
                            context,
                            onSubmit: (data) {
                              _refreshHabits();
                              print('New habit added: ${data.title}');
                            },
                          );
                        },
                        icon: Icon(Icons.add, color: Color(0xFFFFFFFF)),
                        label: Padding(
                          padding: const EdgeInsets.only(right: 5),
                          child: Text('New Habit', style: TextStyle(color: Color(0xFFFFFFFF))),
                        ),
                        elevation: 0,
                        backgroundColor: AppTheme.primary,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // ======= Habit List =======
              Expanded(
                child: RefreshIndicator(
                  onRefresh: _refreshHabits,
                  child: _isLoading
                      ? Center(child: CircularProgressIndicator())
                      : _errorMessage != null
                      ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: _refreshHabits,
                          child: Text('Retry'),
                        ),
                      ],
                    ),
                  )
                      : _filteredHabits.isEmpty
                      ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.inbox_outlined, size: 60, color: Colors.grey),
                        SizedBox(height: 16),
                        Text(
                          _searchQuery.isNotEmpty
                              ? 'No habits found for "$_searchQuery"'
                              : 'No habits found',
                          style: TextStyle(color: Colors.grey),
                        ),
                        SizedBox(height: 8),
                        if (_searchQuery.isNotEmpty)
                          TextButton(
                            onPressed: () {
                              setState(() {
                                _searchQuery = '';
                              });
                            },
                            child: Text('Clear search'),
                          ),
                      ],
                    ),
                  )
                      : ListView.builder(
                    itemCount: _filteredHabits.length,
                    itemBuilder: (context, index) {
                      final habit = _filteredHabits[index];
                      return HabitCard(
                        habit: habit,
                        onEdit: () => _editHabit(habit),
                        onDelete: () => _deleteHabit(habit.id, index),
                      );
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}