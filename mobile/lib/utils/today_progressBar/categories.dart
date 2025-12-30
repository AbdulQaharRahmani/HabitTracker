import 'package:flutter/material.dart';

import '../../app/app_theme.dart';

Widget categories() {
  final items = ['Other', 'Health', 'Study', 'Work', 'Home'];

  return SizedBox(
    height: 36,
    child: ListView.separated(
      scrollDirection: Axis.horizontal,
      itemCount: items.length,
      separatorBuilder: (_, _) => const SizedBox(width: 8),
      itemBuilder: (_, i) => Chip(
        label: Text(items[i]),
        backgroundColor: AppTheme.surface,
      ),
    ),
  );
}