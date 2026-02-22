import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';

import '../../app/app_theme.dart';
import '../../providers/theme_provider.dart';

class SectionHeader extends StatelessWidget {
  final String title;
  final Icon icon;

  const SectionHeader({super.key, required this.title, required this.icon});

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);

    return Row(
      children: [
        icon,
         SizedBox(width: 8.w),
        Text(
          title,
          style:  TextStyle(
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
      ],
    );
  }
}
