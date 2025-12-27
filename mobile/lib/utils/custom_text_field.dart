import 'package:flutter/material.dart';

class CustomTextField extends StatefulWidget {
  final TextEditingController controller;
  final String hintText;
  final bool obsecureText;
  final TextInputType keyboardType;
  final Icon icon;
  final Widget? suffixIcon;
  final bool isRequired;
  final bool? enabled;
  final String? Function(String?)? validator;
  final void Function(bool)? onObscureTextChanged;
  const CustomTextField({
    super.key,
    required this.controller,
    required this.hintText,
    required this.obsecureText,
    required this.icon,
    required this.keyboardType,
    required this.suffixIcon,
    this.isRequired = true,
    this.enabled,
    this.validator,
    this.onObscureTextChanged,
  });

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  late bool _obsecureText;

  @override
  void initState() {
    super.initState();
    _obsecureText = widget.obsecureText;
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25),
      child: Container(
        decoration: BoxDecoration(borderRadius: BorderRadius.circular(16)),
        child: TextFormField(
          validator:
              widget.validator ??
              (value) {
                if (widget.isRequired &&
                    (value == null || value.trim().isEmpty)) {
                  return 'Filling of this field is required';
                }
                return null;
              },
          enabled: widget.enabled ?? true,
          autocorrect: !_obsecureText,
          enableSuggestions: !_obsecureText,
          keyboardType: widget.keyboardType,
          cursorColor: Colors.blue,
          cursorHeight: 22,
          cursorWidth: 2,
          controller: widget.controller,
          obscureText: _obsecureText,
          decoration: InputDecoration(
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(20),
              borderSide: BorderSide.none,
            ),
            prefixIcon: widget.icon,

            suffixIcon: widget.suffixIcon,
            contentPadding: const EdgeInsets.symmetric(
              vertical: 16,
              horizontal: 12,
            ),
            filled: true,
            fillColor: const Color(0xFFF9FAFB),
            hintText: widget.hintText,
            hintStyle: TextStyle(color: Colors.grey[500]),
          ),
        ),
      ),
    );
  }
}
