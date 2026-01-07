import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';

class SettingCard extends StatelessWidget {
  final List<Widget> children;

  const SettingCard({
    super.key,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 8),
      decoration: _boxDecoration(),
      child: Column(children: children),
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