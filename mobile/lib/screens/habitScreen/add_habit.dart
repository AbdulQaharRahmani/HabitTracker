import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../app/app_theme.dart';
import '../../features/add_habit_model.dart';

class CategoryModel {
  final String id;
  final String name;

  CategoryModel({required this.id, required this.name});

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
    );
  }
}

class AddHabitDialog {
  static Future<void> show(
      BuildContext context, {
        required void Function(HabitData data) onSubmit,
        bool barrierDismissible = true,
      }) async {
    final maxWidth = MediaQuery.of(context).size.width * 0.92;
    final dialogWidth = maxWidth > 420 ? 420.0 : maxWidth;

    await showDialog(
      context: context,
      barrierDismissible: barrierDismissible,
      builder: (_) => Dialog(
        insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        backgroundColor: Colors.transparent,
        child: Center(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              maxWidth: dialogWidth,
              maxHeight: MediaQuery.of(context).size.height * 0.86,
            ),
            child: Material(
              borderRadius: BorderRadius.circular(14.r),
              elevation: 14,
              color: AppTheme.surface,
              shadowColor: AppTheme.shadow,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Header
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
                    decoration: BoxDecoration(
                      color: AppTheme.inputBackground,
                      borderRadius: BorderRadius.vertical(top: Radius.circular(14.r)),
                      border: Border(
                        bottom: BorderSide(color: AppTheme.border, width: 0.5),
                      ),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Text(
                            'Add New Habit',
                            style: TextStyle(
                              fontSize: 16.sp,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                        ),

                      ],
                    ),
                  ),

                  // Body
                  Expanded(
                    child: SingleChildScrollView(
                      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 18.h),
                      child: _AddHabitForm(
                        onSubmit: (data) {
                          onSubmit(data);
                        },
                      ),
                    ),
                  ),
                  SizedBox(height: 8.h),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _AddHabitForm extends StatefulWidget {
  final void Function(HabitData data) onSubmit;

  const _AddHabitForm({
    required this.onSubmit,
  });

  @override
  State<_AddHabitForm> createState() => _AddHabitFormState();
}

class _AddHabitFormState extends State<_AddHabitForm> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtl = TextEditingController();
  final _descCtl = TextEditingController();

  final _frequencies = ['Daily', 'Weekly', 'Monthly'];


  List<CategoryModel> _categories = [];
  bool _isLoadingCategories = true;
  String? _errorMessage;

  String _frequency = 'Daily';
  CategoryModel? _selectedCategory;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _fetchCategories();
  }
// Method for getting token from cache
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  Future<void> _fetchCategories() async {
    final url = Uri.parse('https://habit-tracker-17sr.onrender.com/api/categories');

    setState(() {
      _isLoadingCategories = true;
      _errorMessage = null;
    });

    try {
      final token = await _getToken();
      print("🚀 Fetching Categories with Token: ${token != null ? 'Present' : 'NULL'}");

      if (token == null) {
        setState(() {
          _errorMessage = "Error: Please relogin to account, token not found)";
          _isLoadingCategories = false;
        });
        return;
      }

      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      ).timeout(const Duration(seconds: 30));

      print("📥 Server Response Code: ${response.statusCode}");

      if (response.statusCode == 200) {
        final Map<String, dynamic> decodedData = jsonDecode(response.body);

        final List<dynamic> categoriesJson = decodedData['data'];

        setState(() {
          _categories = categoriesJson.map((item) => CategoryModel.fromJson(item)).toList();
          if (_categories.isNotEmpty) _selectedCategory = _categories.first;
          _isLoadingCategories = false;
        });
      } else {
        // چاپ متن ارور سرور برای رفع مشکل 500
        print("❌ Server Error Body: ${response.body}");
        setState(() {
          _errorMessage = "خطای سرور: ${response.statusCode}";
          _isLoadingCategories = false;
        });
      }
    } catch (e) {
      print("❌ Connection Exception: $e");
      setState(() {
        _errorMessage = "Error with connecting to network";
        _isLoadingCategories = false;
      });
    }
  }

  void _submit() async {
    if (!_formKey.currentState!.validate() || _selectedCategory == null) return;

    setState(() => _isSubmitting = true);

    final url = Uri.parse('https://habit-tracker-17sr.onrender.com/api/habits');

    try {
      final token = await _getToken();

      if (token == null) {
        _showSnackBar("Please login again");
        setState(() => _isSubmitting = false);
        return;
      }

      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          "title": _titleCtl.text.trim(),
          "description": _descCtl.text.trim(),
          "frequency": _frequency.toLowerCase(),
          "categoryId": _selectedCategory!.id,
        }),
      ).timeout(const Duration(seconds: 20));

      if (response.statusCode == 200 || response.statusCode == 201) {
        widget.onSubmit(HabitData(
          title: _titleCtl.text,
          description: _descCtl.text,
          frequency: _frequency,
          category: _selectedCategory!.name,
        ));
        _showSnackBar("Habit added successfully!", isSuccess: true);
        Navigator.pop(context);
      } else {
        print("❌ Submit Error Body: ${response.body}");
        _showSnackBar("Not registered: ${response.statusCode}");
      }
    } catch (e) {
      _showSnackBar("connection error");
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  void _showSnackBar(String message, {bool isSuccess = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isSuccess ? Colors.green : Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  void dispose() {
    _titleCtl.dispose();
    _descCtl.dispose();
    super.dispose();
  }



  InputDecoration _fieldDecoration({String? hint}) {
    return InputDecoration(
      hintText: hint,
      filled: true,
      fillColor: AppTheme.inputBackground,
      contentPadding: EdgeInsets.symmetric(horizontal: 14.w, vertical: 14.h),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10.r),
        borderSide: BorderSide(color: AppTheme.border),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10.r),
        borderSide: BorderSide(color: AppTheme.border),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10.r),
        borderSide: BorderSide(color: AppTheme.primary, width: 1.5.w),
      ),
    );
  }

  TextStyle _labelStyle() {
    return TextStyle(
      color: AppTheme.textSecondary,
      fontWeight: FontWeight.w600,
      fontSize: 14.sp,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Title
          Text('Title', style: _labelStyle()),
          SizedBox(height: 8.h),
          TextFormField(
            controller: _titleCtl,
            decoration: _fieldDecoration(hint: 'Enter habit title...'),
            validator: (v) => v == null || v.trim().isEmpty ? 'Please enter a title' : null,
            textInputAction: TextInputAction.next,
          ),
          SizedBox(height: 14.h),

          // Description
          Text('Description', style: _labelStyle()),
          SizedBox(height: 8.h),
          TextFormField(
            controller: _descCtl,
            minLines: 3,
            maxLines: 6,
            decoration: _fieldDecoration(hint: 'Enter habit description...'),
            keyboardType: TextInputType.multiline,
          ),
          SizedBox(height: 14.h),

          // Frequency
          Text('Frequency', style: _labelStyle()),
          SizedBox(height: 8.h),
          DropdownButtonFormField<String>(
            initialValue: _frequency,
            decoration: _fieldDecoration(),
            items: _frequencies.map((f) => DropdownMenuItem(value: f, child: Text(f))).toList(),
            onChanged: (v) {
              if (v == null) return;
              setState(() => _frequency = v);
            },
          ),
          SizedBox(height: 14.h),

          // Category (Dynamic Loading)
          Text('Category', style: _labelStyle()),
          SizedBox(height: 8.h),
          _isLoadingCategories
              ? Center(child: Padding(
            padding: EdgeInsets.all(10.h),
            child: SizedBox(
                height: 20.h, width: 20.w,
                child: const CircularProgressIndicator(strokeWidth: 2)
            ),
          ))
              : _errorMessage != null
              ? Text(_errorMessage!, style: TextStyle(color: Colors.red, fontSize: 12.sp))
              : DropdownButtonFormField<CategoryModel>(
            initialValue: _selectedCategory,
            decoration: _fieldDecoration(),
            items: _categories.map((c) => DropdownMenuItem(
                value: c,
                child: Text(c.name)
            )).toList(),
            onChanged: (v) {
              if (v == null) return;
              setState(() => _selectedCategory = v);
            },
            validator: (v) => v == null ? 'Select a category' : null,
          ),
          SizedBox(height: 20.h),

          // Save button
          SizedBox(
            height: 50.h,
            child: ElevatedButton(
              onPressed: _isSubmitting || _isLoadingCategories ? null : _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                foregroundColor: AppTheme.textWhite,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.r),
                ),
                elevation: 0,
              ),
              child: _isSubmitting
                  ? SizedBox(
                width: 14.w,
                height: 14.h,
                child: CircularProgressIndicator(
                  strokeWidth: 2.w,
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                ),
              )
                  : Text('Save', style: TextStyle(fontSize: 14.sp)),
            ),
          ),

          SizedBox(height: 8.h),

          // Cancel
          TextButton(
            onPressed: _isSubmitting ? null : () => Navigator.of(context).pop(),
            style: TextButton.styleFrom(
              foregroundColor: AppTheme.textSecondary,
              padding: EdgeInsets.zero,
            ),
            child: Text('Cancel', style: TextStyle(fontSize: 14.sp)),
          ),
        ],
      ),
    );
  }
}