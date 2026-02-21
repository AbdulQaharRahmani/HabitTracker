import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:habit_tracker/utils/setting_utils/setting_icons.dart';
import 'package:provider/provider.dart';

import '../../providers/theme_provider.dart';

class SettingNavItem extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String? subtitle;

  const SettingNavItem({
    super.key,
    required this.icon,
    required this.color,
    required this.title,
    this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: SettingIcon(icon: icon, color: color),
      title: Text(title, style: const TextStyle(fontSize: 17)),
      subtitle: subtitle != null ? Text(subtitle!) : null,
      trailing: const Icon(Icons.chevron_right),
    );
  }
}

class SettingTimeItem extends StatelessWidget {
  final String time;

  const SettingTimeItem({
    super.key,
    required this.time,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading:  SettingIcon(
        icon: Icons.schedule,
        color: AppTheme.learningText,
      ),
      title: const Text("Daily Reminder"),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.grey.shade200,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Text(
          time,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}

class SettingSwitchItem extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final bool value;
  final ValueChanged<bool> onChanged;

  const SettingSwitchItem({
    super.key,
    required this.icon,
    required this.color,
    required this.title,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: SettingIcon(icon: icon, color: color),
      title: Text(title),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        activeThumbColor: AppTheme.primary,
      ),
    );
  }
}

class SettingDangerItem extends StatelessWidget {
  final VoidCallback onTap;

  const SettingDangerItem({
    super.key,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);
    return ListTile(
      leading: SettingIcon(icon: Icons.delete, color: AppTheme.error),
      title:  Text(
        "Delete Account",
        style: TextStyle(color: AppTheme.error),
      ),
      onTap: onTap,
    );
  }
}