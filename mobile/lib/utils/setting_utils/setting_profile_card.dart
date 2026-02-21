import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:provider/provider.dart';

import '../../providers/theme_provider.dart';

class SettingProfileCard extends StatelessWidget {
  const SettingProfileCard({
    super.key,
    required this.name,
    required this.email,
    required this.imageUrl,
  });

  final String name;
  final String email;
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _boxDecoration(),
      child: Row(
        children: [
          CircleAvatar(
            radius: 34,
            backgroundImage: NetworkImage(imageUrl),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 19,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  email,
                  style:  TextStyle(color: AppTheme.textMuted),
                ),
              ],
            ),
          ),
         Icon(Icons.chevron_right, color: AppTheme.textMuted),
        ],
      ),
    );
  }

  BoxDecoration _boxDecoration() {
    return BoxDecoration(
      color: AppTheme.surface,
      borderRadius: BorderRadius.circular(24),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withValues(alpha: 0.05),
          blurRadius: 10,
        ),
      ],
    );
  }
}