import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../app/app_theme.dart';
import '../../features/add_habit_model.dart';

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
              // limit the dialog height to a percentage of the screen so it can scroll when needed
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
                  // Header (fixed)
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
                        InkWell(
                          borderRadius: BorderRadius.circular(18.r),
                          onTap: () => Navigator.of(context).pop(),
                          child: Padding(
                            padding: EdgeInsets.all(6.w),
                            child: Icon(Icons.close, size: 20.sp, color: AppTheme.textMuted),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Body (scrollable)
                  // Use Expanded so the body gets available space and becomes scrollable if content
                  // is larger than the constrained maxHeight above.
                  Expanded(
                    child: SingleChildScrollView(
                      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 18.h),
                      child: _AddHabitForm(
                        onSubmit: (data) {
                          onSubmit(data);
                          Navigator.of(context).pop();
                        },
                      ),
                    ),
                  ),

                  // Optional small bottom spacing
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

/// Internal stateful form used by the dialog. It's responsive via ScreenUtil.
class _AddHabitForm extends StatefulWidget {
  final void Function(HabitData data) onSubmit;
  final bool loading;

  const _AddHabitForm({
    required this.onSubmit,
    this.loading = false,
  });

  @override
  State<_AddHabitForm> createState() => _AddHabitFormState();
}

class _AddHabitFormState extends State<_AddHabitForm> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtl = TextEditingController();
  final _descCtl = TextEditingController();

  final _frequencies = ['Daily', 'Weekly', 'Monthly', 'Custom'];
  final _categories = ['Health', 'Productivity', 'Learning', 'Mindfulness'];

  String _frequency = 'Daily';
  String _category = 'Health';
  bool _loading = false;

  @override
  void dispose() {
    _titleCtl.dispose();
    _descCtl.dispose();
    super.dispose();
  }

  void _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _loading = true);

    // Simulate save delay — replace with real save call as needed.
    await Future.delayed(const Duration(milliseconds: 450));

    final data = HabitData(
      title: _titleCtl.text.trim(),
      description: _descCtl.text.trim(),
      frequency: _frequency,
      category: _category,
    );

    if (mounted) {
      widget.onSubmit(data);
    }
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
            value: _frequency,
            decoration: _fieldDecoration(),
            items: _frequencies.map((f) => DropdownMenuItem(value: f, child: Text(f))).toList(),
            onChanged: (v) {
              if (v == null) return;
              setState(() => _frequency = v);
            },
          ),
          SizedBox(height: 14.h),

          // Category
          Text('Category', style: _labelStyle()),
          SizedBox(height: 8.h),
          DropdownButtonFormField<String>(
            value: _category,
            decoration: _fieldDecoration(),
            items: _categories.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
            onChanged: (v) {
              if (v == null) return;
              setState(() => _category = v);
            },
          ),
          SizedBox(height: 20.h),

          // Save button
          SizedBox(
            height: 50.h,
            child: ElevatedButton(
              onPressed: _loading ? null : _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primary,
                foregroundColor: AppTheme.textWhite,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.r),
                ),
                elevation: 0,
              ),
              child: _loading
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
            onPressed: _loading ? null : () => Navigator.of(context).pop(),
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