import 'package:flutter/material.dart';

class ShimmerHeatmap extends StatefulWidget {
  const ShimmerHeatmap({super.key});

  @override
  State<ShimmerHeatmap> createState() => _ShimmerHeatmapState();
}

class _ShimmerHeatmapState extends State<ShimmerHeatmap>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const double cellSize = 24;
    const double cellSpacing = 5;
    const double containerHeight = 300;

    final weeks = List.generate(5, (_) => List.generate(7, (_) => 0));

    return Container(
      height: containerHeight,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Expanded(
            flex: 6,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                //weeks column
                Padding(
                  padding: const EdgeInsets.only(top: 30),
                  child: _buildWeekDaysShimmer(cellSize, cellSpacing),
                ),
                const SizedBox(width: 12),
                //   (PageView)
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // month title
                      AnimatedBuilder(
                        animation: _controller,
                        builder: (context, child) {
                          return Center(
                            child: Container(
                              width: 100,
                              height: 20,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(4),
                                gradient: LinearGradient(
                                  colors: [
                                    Colors.grey.shade300,
                                    Colors.grey.shade100,
                                    Colors.grey.shade300,
                                  ],
                                  stops: const [0.0, 0.5, 1.0],
                                  begin: Alignment(
                                    -1 + _controller.value * 2,
                                    0,
                                  ),
                                  end: Alignment(
                                    1 + _controller.value * 2,
                                    0,
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 12),
                      Expanded(
                        child: SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: weeks.map((week) {
                              return Padding(
                                padding: const EdgeInsets.only(
                                  right: cellSpacing + 10,
                                ),
                                child: Column(
                                  children: week.map((_) {
                                    return _buildShimmerCell(
                                      cellSize,
                                      cellSpacing,
                                      _controller,
                                    );
                                  }).toList(),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          Expanded(
            flex: 1,
            child: _buildLegendShimmer(cellSize, _controller),
          ),
        ],
      ),
    );
  }

  Widget _buildWeekDaysShimmer(double cellSize, double cellSpacing) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return Column(
      children: days
          .map(
            (d) => SizedBox(
          height: cellSize + cellSpacing,
          child: Align(
            alignment: Alignment.centerRight,
            child: Text(
              d,
              style: const TextStyle(fontSize: 12, color: Colors.grey),
            ),
          ),
        ),
      )
          .toList(),
    );
  }

  Widget _buildShimmerCell(
      double cellSize,
      double cellSpacing,
      AnimationController controller,
      ) {
    return Container(
      width: cellSize,
      height: cellSize,
      margin: EdgeInsets.only(
        bottom: cellSpacing,
        left: cellSpacing - 4,
      ),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(5),
        gradient: LinearGradient(
          colors: [
            Colors.grey.shade300,
            Colors.grey.shade100,
            Colors.grey.shade300,
          ],
          stops: const [0.0, 0.5, 1.0],
          begin: Alignment(-1 + controller.value * 2, 0),
          end: Alignment(1 + controller.value * 2, 0),
        ),
      ),
    );
  }

  Widget _buildLegendShimmer(
      double cellSize,
      AnimationController controller,
      ) {
    return Padding(
      padding: const EdgeInsets.only(top: 0, right: 30, bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          const Text(
            "Less",
            style: TextStyle(fontSize: 12, color: Colors.grey),
          ),
          const SizedBox(width: 8),
          ...List.generate(3, (index) {
            return Container(
              width: cellSize - 4,
              height: cellSize - 4,
              margin: const EdgeInsets.symmetric(horizontal: 3),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(4),
                gradient: LinearGradient(
                  colors: [
                    Colors.grey.shade300,
                    Colors.grey.shade100,
                    Colors.grey.shade300,
                  ],
                  stops: const [0.0, 0.5, 1.0],
                  begin: Alignment(-1 + controller.value * 2, 0),
                  end: Alignment(1 + controller.value * 2, 0),
                ),
              ),
            );
          }),
          const SizedBox(width: 8),
          const Text(
            "More",
            style: TextStyle(fontSize: 12, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}