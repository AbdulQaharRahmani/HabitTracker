import 'package:flutter/material.dart';
import '../../app/app_theme.dart';

class SquareTiles extends StatelessWidget {
  final String imagePath;
  final VoidCallback? onTap;

  const SquareTiles({
    super.key,
    required this.imagePath,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 54,
        height: 54,
        decoration: BoxDecoration(
          color: AppTheme.textWhite,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: AppTheme.border,
            width: 0.6,
          ),
        ),
        child: Center(
          child: Image.asset(
            'assets/icons/google.png',
            height: 24,
          ),
        ),
      ),
    );
  }
}
