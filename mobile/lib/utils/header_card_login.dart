import 'package:flutter/material.dart';

import '../app/app_theme.dart';
class HeaderCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      color: AppTheme.cardColor,
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
        child: Row(
          children: [
            CircleAvatar(
              radius: 30,
              backgroundColor: AppTheme.primary30.withOpacity(0.12),
              child: const Icon(
                Icons.track_changes,
                size: 30,
                color: AppTheme.primary30,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Welcome to Habit Tracker',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                    ),
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
