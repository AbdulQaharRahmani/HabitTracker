import 'package:flutter/material.dart';

class FormLabel extends StatelessWidget {
  final String text;
  const FormLabel({super.key,required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left:20),
      child: Row(
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 3),
            child: Text(
              text,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.grey[800],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

