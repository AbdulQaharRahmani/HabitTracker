import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';
import '../../app/app_theme.dart';
import '../../providers/theme_provider.dart';

class TasksCardShimmer extends StatelessWidget {
  const TasksCardShimmer({super.key});

  @override
  Widget build(BuildContext context) {
    Provider.of<ThemeProvider>(context);

    return Card(
      margin: const EdgeInsets.fromLTRB(21, 20, 21, 10),
      elevation: 0,
      color: AppTheme.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Shimmer.fromColors(
          baseColor: AppTheme.border.withOpacity(0.5),
          highlightColor: AppTheme.surface,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Category icon placeholder
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppTheme.textMuted,
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              const SizedBox(width: 12),

              // Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _line(width: double.infinity, height: 16),
                    const SizedBox(height: 6),
                    _line(width: double.infinity, height: 13),
                    const SizedBox(height: 6),
                    _line(width: 160, height: 13),
                    const SizedBox(height: 10),
                    _line(width: 70, height: 20, radius: 8),
                    const SizedBox(height: 10),
                    _line(width: 120, height: 14),
                  ],
                ),
              ),

              const SizedBox(width: 12),

              // Action icons placeholder
              Column(
                children: [
                  _circle(size: 26),
                  const SizedBox(height: 10),
                  _circle(size: 26),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _line({required double width, required double height, double radius = 6}) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: AppTheme.textMuted,
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }

  Widget _circle({required double size}) {
    return Container(
      width: size,
      height: size,
      decoration:  BoxDecoration(
        color: AppTheme.textMuted,
        shape: BoxShape.circle,
      ),
    );
  }
}