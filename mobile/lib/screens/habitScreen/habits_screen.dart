import 'package:flutter/material.dart';
import '../../app/app_theme.dart';

class HabitsScreen extends StatefulWidget {
  const HabitsScreen({super.key});

  @override
  State<HabitsScreen> createState() => _HabitsScreenState();
}

class _HabitsScreenState extends State<HabitsScreen> {
  bool isGrid = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              /// Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'My Habits',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                    ),
                  ),

                  /// View Switcher
                  Container(
                    decoration: BoxDecoration(
                      color: AppTheme.surface,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        IconButton(
                          splashRadius: 20,
                          onPressed: () {
                            setState(() => isGrid = true);
                          },
                          icon: Icon(
                            Icons.grid_view_rounded,
                            color: isGrid
                                ? AppTheme.primary
                                : AppTheme.textMuted,
                          ),
                        ),
                        IconButton(
                          splashRadius: 20,
                          onPressed: () {
                            setState(() => isGrid = false);
                          },
                          icon: Icon(
                            Icons.list_rounded,
                            color: !isGrid
                                ? AppTheme.primary
                                : AppTheme.textMuted,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              /// Content Placeholder
              Expanded(
                child: Center(
                  child: Text(
                    isGrid ? 'Grid View' : 'List View',
                    style: TextStyle(color: AppTheme.textMuted),
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
