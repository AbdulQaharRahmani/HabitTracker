import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;
import 'package:shimmer/shimmer.dart';
import '../../app/app_theme.dart';
import '../../utils/habits/habit.dart';
import '../../utils/habits/habit_card.dart';
import 'add_habit.dart';
import 'edit_habit_screen.dart';

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
  final TextEditingController _searchController = TextEditingController();

  /* -------------------------------------------------------------------------- */
  /* Reusable Styles                                                            */
  /* -------------------------------------------------------------------------- */

  final TextStyle _linkStyle = const TextStyle(
    color: AppTheme.primary,
    fontWeight: FontWeight.bold,
  );

  final TextStyle _descriptionStyle = const TextStyle(
    color: AppTheme.textSecondary,
    fontSize: 14,
  );

  @override
  void initState() {
    super.initState();
    _fetchHabits();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  /* -------------------------------------------------------------------------- */
  /* Logic Methods                                                              */
  /* -------------------------------------------------------------------------- */

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
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
        setState(() {
          _habits.removeAt(index);
        });

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Habit deleted successfully'),
            backgroundColor: AppTheme.success,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to delete habit'),
            backgroundColor: AppTheme.error,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $e'),
          backgroundColor: AppTheme.error,
        ),
      );
    }
  }

  Future<void> _editHabit(Habit habit) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => EditHabitPage(habit: habit)),
    );

    if (result == true) {
      await _refreshHabits();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Habit updated successfully!'),
          backgroundColor: AppTheme.success,
        ),
      );
    }
  }
  Future<void> _refreshHabits() async {
    await _fetchHabits();
  }

  List<Habit> get _filteredHabits {
    if (_searchQuery.isEmpty) return _habits;
    return _habits.where((habit) {
      return habit.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          habit.description.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          habit.category.name.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();
  }

  /* -------------------------------------------------------------------------- */
  /* Shimmer Loading Widget                                                     */
  /* -------------------------------------------------------------------------- */

  Widget _buildShimmerLoading() {
    return ListView.builder(
      itemCount: 5,
      padding: const EdgeInsets.only(bottom: 20),
      itemBuilder: (context, index) {
        return Shimmer.fromColors(
          baseColor: AppTheme.border.withOpacity(0.4),
          highlightColor: AppTheme.surface,
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            height: 100,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        );
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /* UI Build                                                                   */
  /* -------------------------------------------------------------------------- */

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Column(
          children: [
            // HEADER SECTION
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 16.h),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    "My Habits",
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 30,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  SizedBox(height: 8.h),
                  Text(
                    'Manage and track your daily routines effectively.',
                    style: _descriptionStyle,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),

            // SEARCH AND BUTTON SECTION
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20.w),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 48.h,
                      decoration: BoxDecoration(
                        color: AppTheme.inputBackground,
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: Row(
                        children: [
                          SizedBox(width: 12.w),
                          const Icon(Icons.search, color: AppTheme.textMuted),
                          SizedBox(width: 10.w),
                          Expanded(
                            child: TextField(
                              controller: _searchController,
                              decoration: const InputDecoration(
                                hintText: 'Search habits...',
                                border: InputBorder.none,
                                hintStyle: TextStyle(color: AppTheme.textMuted),
                              ),
                              onChanged: (value) {
                                setState(() {
                                  _searchQuery = value;
                                });
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(width: 12.w),
                  SizedBox(
                    height: 48.h,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        AddHabitDialog.show(
                          context,
                          onSubmit: (data) {
                            _refreshHabits();
                          },
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      icon: const Icon(Icons.add, size: 20, color: Colors.white),
                      label: const Text(
                        'New',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: 16.h),

            // HABITS LIST SECTION
            Expanded(
              child: RefreshIndicator(
                color: AppTheme.primary,
                onRefresh: _refreshHabits,
                child: _buildHabitsList(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHabitsList() {
    if (_isLoading) {
      return _buildShimmerLoading();
    }

    if (_errorMessage != null) {
      return Center(
        child: Padding(
          padding: EdgeInsets.all(20.w),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                _errorMessage!,
                style: const TextStyle(color: AppTheme.textSecondary),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 20.h),
              ElevatedButton(
                onPressed: _refreshHabits,
                child: const Text('Try Again'),
              ),
            ],
          ),
        ),
      );
    }

    if (_filteredHabits.isEmpty) {
      return SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Padding(
          padding: EdgeInsets.all(40.w),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.inbox_outlined,
                size: 80.w,
                color: AppTheme.textMuted,
              ),
              SizedBox(height: 20.h),
              Text(
                _searchQuery.isNotEmpty
                    ? 'No habits found for "$_searchQuery"'
                    : 'No habits found',
                style: _descriptionStyle,
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 12.h),
              if (_searchQuery.isNotEmpty)
                TextButton(
                  onPressed: () {
                    setState(() {
                      _searchQuery = '';
                      _searchController.clear();
                    });
                  },
                  child: Text(
                    'Clear search',
                    style: _linkStyle,
                  ),
                ),
            ],
          ),
        ),
      );
    }

    return ListView.builder(
      physics: const AlwaysScrollableScrollPhysics(),
      padding: EdgeInsets.only(
        bottom: 20.h,
        top: 10.h,
        left: 20.w,
        right: 20.w,
      ),
      itemCount: _filteredHabits.length,
      itemBuilder: (context, index) {
        final habit = _filteredHabits[index];
        return HabitCard(
          habit: habit,
          onEdit: () => _editHabit(habit),
          onDelete: () => _deleteHabit(habit.id, index),
        );
      },
    );
  }
}