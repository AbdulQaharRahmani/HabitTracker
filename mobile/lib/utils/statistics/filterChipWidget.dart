import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/app/app_theme.dart';

class FilterChipWidget extends StatefulWidget {
  final String title;

  final bool? selected;

  final ValueChanged<bool>? onSelected;

  final EdgeInsets? padding;

  final double? borderRadius;

  const FilterChipWidget({
    super.key,
    required this.title,
    this.selected,
    this.onSelected,
    this.padding,
    this.borderRadius,
  });

  @override
  State<FilterChipWidget> createState() => _FilterChipWidgetState();
}

class _FilterChipWidgetState extends State<FilterChipWidget>
    with SingleTickerProviderStateMixin {
  late bool _internalSelected;
  bool _pressed = false;

  @override
  void initState() {
    super.initState();
    _internalSelected = widget.selected ?? false;
  }

  @override
  void didUpdateWidget(covariant FilterChipWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.selected != null && widget.selected != _internalSelected) {
      _internalSelected = widget.selected!;
    }
  }

  bool get _isSelected => widget.selected ?? _internalSelected;

  void _handleTap() {
    final newValue = !_isSelected;

    if (widget.selected == null) {
      setState(() {
        _internalSelected = newValue;
      });
    }

    widget.onSelected?.call(newValue);
  }

  @override
  Widget build(BuildContext context) {
    final chipPadding =
        widget.padding ?? EdgeInsets.symmetric(horizontal: 16.w, vertical: 10.h);
    final chipRadius = widget.borderRadius ?? 14.r;
    final fontSize = 14.sp;
    final fontWeight = FontWeight.w600;

    final backgroundColor = _isSelected
        ? AppTheme.filterActiveBackground
        : AppTheme.filterInactiveBackground;
    final textColor =
    _isSelected ? AppTheme.filterActiveText : AppTheme.filterInactiveText;

    // Shadows
    final boxShadow = _isSelected
        ? [
      BoxShadow(
        color: AppTheme.shadow.withOpacity(0.18),
        blurRadius: 8.r,
        offset: Offset(0, 3.h),
      )
    ]
        : [
      BoxShadow(
        color: AppTheme.shadow.withOpacity(0.04),
        blurRadius: 4.r,
        offset: Offset(0, 2.h),
      )
    ];

    return Semantics(
      button: true,
      selected: _isSelected,
      label: widget.title,
      child: AnimatedScale(
        duration: const Duration(milliseconds: 120),
        scale: _pressed ? 0.985 : 1.0,
        curve: Curves.easeOut,
        child: GestureDetector(
          onTapDown: (_) => setState(() => _pressed = true),
          onTapUp: (_) {
            setState(() => _pressed = false);
            _handleTap();
          },
          onTapCancel: () => setState(() => _pressed = false),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 220),
            padding: chipPadding,
            decoration: BoxDecoration(
              color: backgroundColor,
              borderRadius: BorderRadius.circular(chipRadius),
              boxShadow: boxShadow,
              border: _isSelected
                  ? Border.all(
                color: AppTheme.filterActiveText.withOpacity(0.06),
                width: 1.w,
              )
                  : null,
            ),
            child: DefaultTextStyle(
              style: TextStyle(
                fontSize: fontSize,
                fontWeight: fontWeight,
                color: textColor,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (_isSelected) ...[
                    Container(
                      width: 18.w,
                      height: 18.w,
                      margin: EdgeInsets.only(right: 8.w),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.10),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.check,
                        size: 12.w,
                        color: textColor,
                      ),
                    ),
                  ],
                  Text(widget.title),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}