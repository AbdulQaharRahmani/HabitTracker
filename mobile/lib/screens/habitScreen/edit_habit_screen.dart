import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../../app/app_theme.dart';
import '../../utils/category/category_model.dart';
import '../../utils/habits/habit.dart';

class EditHabitPage extends StatefulWidget {
  final Habit habit;

  const EditHabitPage({super.key, required this.habit});

  @override
  State<EditHabitPage> createState() => _EditHabitPageState();
}

class _EditHabitPageState extends State<EditHabitPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleCtl;
  late TextEditingController _descCtl;

  final _frequencies = ['Daily', 'Weekly', 'Monthly'];

  List<CategoryModel> _categories = [];
  bool _isLoadingCategories = true;
  String? _errorMessage;

  late String _frequency;
  CategoryModel? _selectedCategory;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _titleCtl = TextEditingController(text: widget.habit.title);
    _descCtl = TextEditingController(text: widget.habit.description);
    _frequency = _capitalizeFirst(widget.habit.frequency);
    _selectedCategory = widget.habit.category;
    _fetchCategories();
  }

  String _capitalizeFirst(String s) {
    if (s.isEmpty) return s;
    return s[0].toUpperCase() + s.substring(1);
  }

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

      if (token == null) {
        setState(() {
          _errorMessage = "Error: Please relogin to account, token not found";
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

      if (response.statusCode == 200) {
        final Map<String, dynamic> decodedData = jsonDecode(response.body);
        final List<dynamic> categoriesJson = decodedData['data'];

        setState(() {
          _categories = categoriesJson.map((item) => CategoryModel.fromJson(item)).toList();
           if (_selectedCategory != null) {
            final existing = _categories.firstWhere(
                  (cat) => cat.id == _selectedCategory!.id,
              orElse: () => _selectedCategory!,
            );
            if (!_categories.contains(existing)) {
              _categories.add(existing);
            }
            _selectedCategory = existing;
          }
          _isLoadingCategories = false;
        });
      } else {
        setState(() {
          _errorMessage = "Server Error: ${response.statusCode}";
          _isLoadingCategories = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = "Error with connecting to network";
        _isLoadingCategories = false;
      });
    }
  }

  Future<void> _updateHabit() async {
    if (!_formKey.currentState!.validate() || _selectedCategory == null) return;

    setState(() => _isSubmitting = true);

    final url = Uri.parse('https://habit-tracker-17sr.onrender.com/api/habits/${widget.habit.id}');

    try {
      final token = await _getToken();

      if (token == null) {
        _showSnackBar("Please login again");
        setState(() => _isSubmitting = false);
        return;
      }

      final response = await http.put(
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

      if (response.statusCode == 200) {
        _showSnackBar("Habit updated successfully!", isSuccess: true);
        Navigator.pop(context, true);
      } else {
        _showSnackBar("Failed to update: ${response.statusCode}");
      }
    } catch (e) {
      _showSnackBar("Connection error");
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

  Widget _buildCategoryDropdown() {
    if (_isLoadingCategories) {
      return Center(
        child: Padding(
          padding: EdgeInsets.all(10.h),
          child: SizedBox(
            height: 20.h,
            width: 20.w,
            child: const CircularProgressIndicator(strokeWidth: 2),
          ),
        ),
      );
    }

    if (_errorMessage != null) {
      return Text(
        _errorMessage!,
        style: TextStyle(color: Colors.red, fontSize: 12.sp),
      );
    }

    if (_categories.isEmpty) {
      return const Text(
        'No categories available',
        style: TextStyle(color: Colors.grey),
      );
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14.r),
        border: Border.all(color: AppTheme.border, width: 1),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<CategoryModel>(
          value: _selectedCategory,
          isExpanded: true,
          icon: const Icon(Icons.keyboard_arrow_down_rounded, color: Colors.grey),
          dropdownColor: Colors.white,
          borderRadius: BorderRadius.circular(16.r),
          items: _categories.map((cat) => DropdownMenuItem<CategoryModel>(
            value: cat,
            child: Row(
              children: [
                Container(
                  width: 34.w,
                  height: 34.h,
                  decoration: BoxDecoration(
                    color: cat.backgroundColor,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: cat.backgroundColor.withOpacity(0.4),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Icon(cat.icon, color: Colors.white, size: 18.sp),
                ),
                SizedBox(width: 12.w),
                Expanded(
                  child: Text(
                    cat.name,
                    style: TextStyle(
                      fontSize: 15.sp,
                      fontWeight: FontWeight.w500,
                      color: AppTheme.textPrimary,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          )).toList(),
          onChanged: (val) {
            if (val != null) {
              setState(() => _selectedCategory = val);
            }
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text('Edit Habit'),
        backgroundColor: AppTheme.surface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),

      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 20.h),
        child: Form(
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
                value: _frequency,
                decoration: _fieldDecoration(),
                items: _frequencies
                    .map((f) => DropdownMenuItem(value: f, child: Text(f)))
                    .toList(),
                onChanged: (v) {
                  if (v == null) return;
                  setState(() => _frequency = v);
                },
              ),
              SizedBox(height: 14.h),

              // Category
              Text('Category', style: _labelStyle()),
              SizedBox(height: 8.h),
              _buildCategoryDropdown(),
              SizedBox(height: 30.h),

              // Update button
              SizedBox(
                height: 50.h,
                child: ElevatedButton(
                  onPressed: _isSubmitting || _isLoadingCategories ? null : _updateHabit,
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
                      : Text('Update Habit', style: TextStyle(fontSize: 14.sp)),
                ),
              ),

              SizedBox(height: 16.h),

              // Cancel button
              SizedBox(
                height: 50.h,
                child: TextButton(
                  onPressed: _isSubmitting ? null : () => Navigator.pop(context),
                  style: TextButton.styleFrom(
                    foregroundColor: AppTheme.textSecondary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10.r),
                    ),
                  ),
                  child: Text('Cancel', style: TextStyle(fontSize: 14.sp)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}