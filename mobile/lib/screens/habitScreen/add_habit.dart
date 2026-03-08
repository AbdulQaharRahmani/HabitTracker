import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:http/http.dart' as http;

import '../../app/app_theme.dart';
import '../../services/category_cache.dart';
import '../../services/habit_reminder_service.dart';
import '../../services/token_storage.dart';
import '../../utils/category/category_model.dart';
import '../../utils/habits/habit.dart';
import 'habit_form.dart';

class AddHabitDialog {
  static Future<void> show(
    BuildContext context, {
    required FutureOr<void> Function(Habit? newHabit) onSubmit,
    bool barrierDismissible = true,
  }) async {
    final result = await Navigator.of(context).push<Habit?>(
      PageRouteBuilder<Habit?>(
        opaque: false,
        barrierDismissible: barrierDismissible,
        pageBuilder: (context, animation, secondaryAnimation) =>
            const AddHabitPage(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          final curved = CurvedAnimation(
            parent: animation,
            curve: Curves.easeOutCubic,
          );
          return FadeTransition(
            opacity: curved,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0, 0.08),
                end: Offset.zero,
              ).animate(curved),
              child: child,
            ),
          );
        },
      ),
    );
    await onSubmit(result);
  }
}

class AddHabitPage extends StatefulWidget {
  const AddHabitPage({super.key});

  @override
  State<AddHabitPage> createState() => _AddHabitPageState();
}

class _AddHabitPageState extends State<AddHabitPage> {
  static const _endpoint = 'https://habit-tracker-17sr.onrender.com/api/habits';

  bool _loadingCategories = true;
  bool _isSubmitting = false;
  String? _error;
  List<CategoryModel> _categories = <CategoryModel>[];

  HabitFormValue? _formValue;
  bool _isFormValid = false;

  @override
  void initState() {
    super.initState();
    _fetchCategories();
  }

  Future<void> _fetchCategories() async {
    setState(() {
      _loadingCategories = true;
      _error = null;
    });

    try {
      final cached = CategoryCache().getCachedCategoriesSync();
      if (cached != null && cached.isNotEmpty) {
        _categories = List<CategoryModel>.from(cached);
      } else {
        _categories = List<CategoryModel>.from(
          await CategoryCache().getCategories(),
        );
      }

      if (!mounted) return;
      setState(() => _loadingCategories = false);
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _loadingCategories = false;
        _error = 'Unable to load categories. Check your connection and retry.';
      });
    }
  }

  Future<void> _submit() async {
    if (!_isFormValid || _formValue == null || _isSubmitting) {
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final token = await AuthManager.getToken();
      if (token == null || token.isEmpty) {
        _showMessage('Please login again.');
        return;
      }

      final response = await http
          .post(
            Uri.parse(_endpoint),
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json',
            },
            body: jsonEncode({
              'title': _formValue!.title,
              'description': _formValue!.description,
              'frequency': _formValue!.apiFrequency,
              'categoryId': _formValue!.category!.id,
              'reminderEnabled': _formValue!.reminderEnabled,
              'reminderTime': _formValue!.reminderTime,
            }),
          )
          .timeout(const Duration(seconds: 45));

      if (response.statusCode == 200 || response.statusCode == 201) {
        HapticFeedback.lightImpact();
        Habit? created;
        try {
          final decoded = jsonDecode(response.body) as Map<String, dynamic>;
          created = Habit.fromJson(decoded['data'] as Map<String, dynamic>);
        } catch (_) {
          created = null;
        }

        if (!mounted) return;
        if (created != null) {
          await HabitReminderService.instance.applyReminderForHabit(
            habit: created,
            enabled: _formValue!.reminderEnabled,
            reminderTime: _formValue!.reminderTime,
          );
          created = created.copyWith(
            reminderEnabled: _formValue!.reminderEnabled,
            reminderTime: _formValue!.reminderTime,
          );
        }
        if (!mounted) return;
        _showMessage('Habit created successfully.', success: true);
        Navigator.of(context).pop(created);
        return;
      }

      _showMessage('Could not create habit (${response.statusCode}).');
    } catch (_) {
      _showMessage('Network issue while creating habit.');
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  void _showMessage(String message, {bool success = false}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        behavior: SnackBarBehavior.floating,
        backgroundColor: success ? AppTheme.success : AppTheme.error,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        elevation: 0,
        title: Text(
          'Add Habit',
          style: TextStyle(
            color: AppTheme.textPrimary,
            fontSize: 18.sp,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      body: SafeArea(
        child: _loadingCategories
            ? const _CenteredLoader()
            : _error != null
            ? _InlineErrorState(message: _error!, onRetry: _fetchCategories)
            : AnimatedPadding(
                duration: const Duration(milliseconds: 160),
                curve: Curves.easeOut,
                padding: EdgeInsets.only(
                  bottom: MediaQuery.viewInsetsOf(context).bottom,
                ),
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: EdgeInsets.fromLTRB(16.w, 12.h, 16.w, 12.h),
                  child: HabitForm(
                    categories: _categories,
                    enabled: !_isSubmitting,
                    onChanged: (value, isValid) {
                      _formValue = value;
                      if (_isFormValid != isValid) {
                        setState(() => _isFormValid = isValid);
                      }
                    },
                  ),
                ),
              ),
      ),
      bottomNavigationBar: SafeArea(
        top: false,
        child: Padding(
          padding: EdgeInsets.fromLTRB(16.w, 8.h, 16.w, 12.h),
          child: SizedBox(
            height: 48.h,
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 180),
              child: ElevatedButton(
                key: ValueKey<bool>(_isSubmitting),
                onPressed: _isSubmitting || !_isFormValid || _loadingCategories
                    ? null
                    : _submit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  foregroundColor: AppTheme.textWhite,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12.r),
                  ),
                  elevation: 0,
                ),
                child: _isSubmitting
                    ? SizedBox(
                        width: 16.w,
                        height: 16.w,
                        child: const CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Text(
                        'Save habit',
                        style: TextStyle(
                          fontSize: 14.sp,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _InlineErrorState extends StatelessWidget {
  const _InlineErrorState({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16.w),
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(14.r),
          border: Border.all(color: AppTheme.border),
        ),
        padding: EdgeInsets.all(16.w),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.wifi_off_rounded,
              size: 26.sp,
              color: AppTheme.textMuted,
            ),
            SizedBox(height: 10.h),
            Text(
              message,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12.sp, color: AppTheme.textSecondary),
            ),
            SizedBox(height: 12.h),
            ElevatedButton(onPressed: onRetry, child: const Text('Retry')),
          ],
        ),
      ),
    );
  }
}

class _CenteredLoader extends StatelessWidget {
  const _CenteredLoader();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SizedBox(
        width: 24.w,
        height: 24.w,
        child: CircularProgressIndicator(
          strokeWidth: 2.2,
          color: AppTheme.primary,
        ),
      ),
    );
  }
}
