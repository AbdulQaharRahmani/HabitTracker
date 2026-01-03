import 'package:flutter/material.dart';
import '../../app/app_theme.dart';

class CustomTextField extends StatefulWidget {
  final TextEditingController controller;
  final String hintText;
  final bool obsecureText;
  final TextInputType keyboardType;
  final IconData icon;
  final bool isRequired;
  final bool? enabled;
  final Widget? suffixIcon;
  final String? Function(String?)? validator;

  const CustomTextField({
    super.key,
    required this.controller,
    required this.hintText,
    required this.obsecureText,
    required this.icon,
    required this.keyboardType,
    this.isRequired = true,
    this.enabled,
    this.validator,
    this.suffixIcon,
  });

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  late bool _obsecure;

  @override
  void initState() {
    super.initState();
    _obsecure = widget.obsecureText;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: TextFormField(
        controller: widget.controller,
        obscureText: _obsecure,
        keyboardType: widget.keyboardType,
        enabled: widget.enabled ?? true,
        validator: widget.validator ??
                (value) {
              if (widget.isRequired &&
                  (value == null || value.trim().isEmpty)) {
                return 'This field is required';
              }
              return null;
            },
        style: const TextStyle(fontSize: 14),
        decoration: InputDecoration(
          hintText: widget.hintText,
          prefixIcon: Icon(widget.icon, size: 20),
          suffixIcon: widget.obsecureText
              ? IconButton(
            icon: Icon(
              _obsecure ? Icons.visibility_off : Icons.visibility,
              size: 20,
            ),
            onPressed: () {
              setState(() => _obsecure = !_obsecure);
            },
          )
              : null,
          filled: true,
          fillColor: AppTheme.inputBackground,
          contentPadding:
          const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(14),
            borderSide: BorderSide.none,
          ),
        ),
      ),
    );
  }
}
