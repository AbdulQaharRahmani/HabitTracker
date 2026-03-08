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

class EditHabitPage extends StatefulWidget {
  const EditHabitPage({super.key, required this.habit});

  final Habit habit;

  @override
  State<EditHabitPage> createState() => _EditHabitPageState();
}

class _EditHabitPageState extends State<EditHabitPage> {
  bool _loadingCategories = true;
  bool _isSubmitting = false;
  bool _isDeleting = false;
  String? _error;
  List<CategoryModel> _categories = <CategoryModel>[];

  HabitFormValue? _formValue;
  bool _isFormValid = true;

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

      if (_categories
          .where((item) => item.id == widget.habit.category.id)
          .isEmpty) {
        _categories = List<CategoryModel>.from(_categories)
          ..add(widget.habit.category);
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

  HabitFormValue get _initialValue => HabitFormValue.fromHabit(
    title: widget.habit.title,
    description: widget.habit.description,
    frequency: widget.habit.frequency,
    category: widget.habit.category,
    reminderEnabled: widget.habit.reminderEnabled,
    reminderTime: widget.habit.reminderTime,
  );

  Future<void> _updateHabit() async {
    if (!_isFormValid || _formValue == null || _isSubmitting || _isDeleting) {
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
          .put(
            Uri.parse(
              'https://habit-tracker-17sr.onrender.com/api/habits/${widget.habit.id}',
            ),
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

      if (response.statusCode == 200) {
        Habit updatedHabit;
        try {
          final decoded = jsonDecode(response.body) as Map<String, dynamic>;
          updatedHabit = Habit.fromJson(
            decoded['data'] as Map<String, dynamic>,
          );
        } catch (_) {
          updatedHabit = Habit(
            id: widget.habit.id,
            title: _formValue!.title,
            description: _formValue!.description,
            category: _formValue!.category!,
            frequency: _formValue!.apiFrequency,
            order: widget.habit.order,
            createdAt: widget.habit.createdAt,
            currentStreak: widget.habit.currentStreak,
            reminderEnabled: _formValue!.reminderEnabled,
            reminderTime: _formValue!.reminderTime,
          );
        }

        await HabitReminderService.instance.applyReminderForHabit(
          habit: updatedHabit,
          enabled: _formValue!.reminderEnabled,
          reminderTime: _formValue!.reminderTime,
        );
        updatedHabit = updatedHabit.copyWith(
          reminderEnabled: _formValue!.reminderEnabled,
          reminderTime: _formValue!.reminderTime,
        );

        HapticFeedback.lightImpact();
        if (!mounted) return;
        _showMessage('Habit updated successfully.', success: true);
        Navigator.of(context).pop(updatedHabit);
      } else {
        _showMessage('Could not update habit (${response.statusCode}).');
      }
    } catch (_) {
      _showMessage('Network issue while updating habit.');
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  Future<void> _deleteHabit() async {
    if (_isDeleting || _isSubmitting) return;

    final shouldDelete = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: AppTheme.surface,
          title: const Text('Delete habit?'),
          content: const Text(
            'This action cannot be undone. The habit and its progress will be removed.',
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.error,
                foregroundColor: AppTheme.textWhite,
              ),
              onPressed: () => Navigator.of(context).pop(true),
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );

    if (shouldDelete != true) {
      return;
    }

    setState(() => _isDeleting = true);

    try {
      final token = await AuthManager.getToken();
      if (token == null || token.isEmpty) {
        _showMessage('Please login again.');
        return;
      }

      final response = await http
          .delete(
            Uri.parse(
              'https://habit-tracker-17sr.onrender.com/api/habits/${widget.habit.id}',
            ),
            headers: {
              'Authorization': 'Bearer $token',
              'Content-Type': 'application/json',
            },
          )
          .timeout(const Duration(seconds: 45));

      if (response.statusCode == 200) {
        HapticFeedback.mediumImpact();
        if (!mounted) return;
        _showMessage('Habit deleted successfully.', success: true);
        await HabitReminderService.instance.removeReminderForHabit(
          widget.habit.id,
        );
        if (!mounted) return;
        Navigator.of(context).pop(true);
      } else {
        _showMessage('Could not delete habit (${response.statusCode}).');
      }
    } catch (_) {
      _showMessage('Network issue while deleting habit.');
    } finally {
      if (mounted) {
        setState(() => _isDeleting = false);
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
          'Edit Habit',
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
                    initialValue: _initialValue,
                    enabled: !_isSubmitting && !_isDeleting,
                    onChanged: (value, isValid) {
                      _formValue = value;
                      final nextValid = isValid;
                      if (_isFormValid != nextValid) {
                        setState(() => _isFormValid = nextValid);
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
          child: Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 48.h,
                  child: OutlinedButton.icon(
                    onPressed: _isSubmitting || _isDeleting
                        ? null
                        : _deleteHabit,
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(
                        color: AppTheme.error.withValues(alpha: 0.35),
                      ),
                      foregroundColor: AppTheme.error,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.r),
                      ),
                    ),
                    icon: _isDeleting
                        ? SizedBox(
                            width: 14.w,
                            height: 14.w,
                            child: const CircularProgressIndicator(
                              strokeWidth: 2,
                            ),
                          )
                        : const Icon(Icons.delete_outline),
                    label: Text(
                      _isDeleting ? 'Deleting...' : 'Delete',
                      style: TextStyle(
                        fontSize: 13.sp,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ),
              SizedBox(width: 10.w),
              Expanded(
                flex: 2,
                child: SizedBox(
                  height: 48.h,
                  child: ElevatedButton(
                    onPressed:
                        _isSubmitting ||
                            _isDeleting ||
                            _loadingCategories ||
                            !_isFormValid
                        ? null
                        : _updateHabit,
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
                            child: const CircularProgressIndicator(
                              strokeWidth: 2,
                            ),
                          )
                        : Text(
                            'Save changes',
                            style: TextStyle(
                              fontSize: 14.sp,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                  ),
                ),
              ),
            ],
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
