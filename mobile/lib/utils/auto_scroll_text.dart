import 'dart:async';

import 'package:flutter/material.dart';

class AutoScrollText extends StatefulWidget {
  final String text;
  final TextStyle textStyle;
  final Duration pauseDuration;
  final double velocity; // pixels per second

  const AutoScrollText({
    super.key,
    required this.text,
    required this.textStyle,
    this.pauseDuration = const Duration(seconds: 1),
    this.velocity = 30.0,
  });

  @override
  State<AutoScrollText> createState() => AutoScrollTextState();
}

class AutoScrollTextState extends State<AutoScrollText>
    with SingleTickerProviderStateMixin {
  final ScrollController _scrollController = ScrollController();
  Timer? _timer;
  bool _scrollingForward = true;

  @override
  void initState() {
    super.initState();
    // start after first frame so we can measure extents
    WidgetsBinding.instance.addPostFrameCallback((_) => _maybeStartScrolling());
  }

  @override
  void didUpdateWidget(covariant AutoScrollText oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.text != widget.text ||
        oldWidget.textStyle != widget.textStyle) {
      _restartScrolling();
    }
  }

  void _restartScrolling() {
    _stopScrolling();
    WidgetsBinding.instance.addPostFrameCallback((_) => _maybeStartScrolling());
  }

  void _maybeStartScrolling() {
    if (!mounted) return;
    final box = context.findRenderObject();
    if (box == null) return;

    final availableWidth = context.size?.width ?? 0;
    // measure text width
    final tp = TextPainter(
      text: TextSpan(text: widget.text, style: widget.textStyle),
      maxLines: 1,
      textDirection: TextDirection.ltr,
    )..layout();

    final textWidth = tp.width;

    // If text fits, don't scroll
    if (textWidth <= availableWidth + 4) return;

    final maxScroll = textWidth - availableWidth;
    if (maxScroll <= 0) return;

    final durationSeconds = maxScroll / widget.velocity;
    final duration = Duration(
      milliseconds: (durationSeconds * 1000).clamp(500, 20000).toInt(),
    );

    // start loop
    _timer = Timer(widget.pauseDuration, () async {
      if (!mounted) return;
      _scrollingForward = true;
      await _animateTo(maxScroll, duration);
      if (!mounted) return;
      await Future.delayed(widget.pauseDuration);
      if (!mounted) return;
      _scrollingForward = false;
      await _animateTo(0.0, duration);
      if (!mounted) return;
      // repeat loop
      _maybeStartScrolling();
    });
  }

  Future<void> _animateTo(double offset, Duration duration) async {
    try {
      await _scrollController.animateTo(
        offset,
        duration: duration,
        curve: Curves.easeInOut,
      );
    } catch (_) {
      // might fail if controller disposed
    }
  }

  void _stopScrolling() {
    _timer?.cancel();
    _timer = null;
    try {
      _scrollController.jumpTo(0.0);
    } catch (_) {}
  }

  @override
  void dispose() {
    _stopScrolling();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: SingleChildScrollView(
        controller: _scrollController,
        scrollDirection: Axis.horizontal,
        physics: const NeverScrollableScrollPhysics(),
        child: Align(
          alignment: Alignment.centerLeft,
          child: Text(
            widget.text,
            style: widget.textStyle,
            maxLines: 1,
            overflow: TextOverflow.visible,
          ),
        ),
      ),
    );
  }
}
