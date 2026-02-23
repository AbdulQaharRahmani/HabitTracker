import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:provider/provider.dart';

import '../../providers/theme_provider.dart';

class SettingHeader extends StatelessWidget {
  final String title;

  const SettingHeader({
    super.key,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);
    return Padding(
      padding: const EdgeInsets.fromLTRB(0, 0, 0, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}