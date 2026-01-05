import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
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
    return TextFormField(
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
      style: TextStyle(fontSize: 14.sp),
      decoration: InputDecoration(
        hintText: widget.hintText,
        hintStyle: TextStyle(fontSize: 14.sp),
        prefixIcon: Icon(widget.icon, size: 20.sp),
        suffixIcon: widget.obsecureText
            ? IconButton(
          icon: Icon(
            _obsecure ? Icons.visibility_off : Icons.visibility,
            size: 20.sp,
          ),
          onPressed: () {
            setState(() => _obsecure = !_obsecure);
          },
        )
            : widget.suffixIcon,
        filled: true,
        fillColor: AppTheme.inputBackground,
        contentPadding: EdgeInsets.symmetric(
          vertical: 14.h,
          horizontal: 16.w, // 🔑 مهم: هماهنگ با Button
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14.r),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14.r),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14.r),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}
