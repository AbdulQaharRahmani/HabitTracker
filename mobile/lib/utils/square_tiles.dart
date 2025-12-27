import 'package:flutter/material.dart';

class SquareTiles extends StatelessWidget {
  final String imagePath;
  const SquareTiles({super.key, required this.imagePath});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        print('pressed the button');
      },
      child: Container(
        padding: EdgeInsets.all(8),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.white),
          color: Colors.grey[200],
          borderRadius: BorderRadius.circular(16),
        ),
        child: Padding(
          padding: const EdgeInsets.all(5.0),
          child: Image.asset(imagePath, height: 30),
        ),
      ),
    );
  }
}
