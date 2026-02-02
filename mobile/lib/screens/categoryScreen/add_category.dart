import 'package:flutter/material.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';


import '../../app/app_theme.dart';
import '../../utils/category/model.dart';

class AddCategory extends StatefulWidget {
  const AddCategory({super.key});

  @override
  State<AddCategory> createState() => _AddCategoryState();
}

enum IconGroup { study, sport, work, fun }

class _AddCategoryState extends State<AddCategory> {
  final TextEditingController _nameController = TextEditingController();

  Color selectedColor = Colors.red;
  IconData selectedIcon = Icons.school;
  IconGroup selectedGroup = IconGroup.study;

  /// Icon groups
  final Map<IconGroup, List<IconData>> iconGroups = {
    IconGroup.study: [
      Icons.school,
      Icons.menu_book,
      Icons.edit,
      Icons.lightbulb,
      Icons.quiz,
      Icons.library_books,
      Icons.article,
      Icons.note,
      Icons.history_edu,
      Icons.calculate,
    ],
    IconGroup.sport: [
      Icons.fitness_center,
      Icons.sports_soccer,
      Icons.directions_run,
      Icons.pool,
      Icons.sports_basketball,
      Icons.sports_tennis,
      Icons.sports_volleyball,
      Icons.sports_baseball,
      Icons.sports_football,
      Icons.sports_handball,
    ],
    IconGroup.work: [
      Icons.work,
      Icons.laptop,
      Icons.calendar_today,
      Icons.task_alt,
      Icons.trending_up,
      Icons.business,
      Icons.meeting_room,
      Icons.present_to_all,
      Icons.bar_chart,
      Icons.folder,
    ],
    IconGroup.fun: [
      Icons.music_note,
      Icons.movie,
      Icons.games,
      Icons.palette,
      Icons.celebration,
      Icons.headphones,
      Icons.tv,
      Icons.videogame_asset,
      Icons.camera_alt,
      Icons.restaurant,
    ],
  };

  void _onSavePressed() {
    if (_nameController.text.trim().isEmpty) return;

    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        backgroundColor: AppTheme.background,
        title: const Text('Save Category'),
        content: const Text('Do you want to save this category?'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(dialogContext);
            },
            child: const Text('Cancel',style: TextStyle(color: AppTheme.error)),
          ),
          ElevatedButton(
            onPressed: () {
              final category = CategoryModel(
                title: _nameController.text.trim(),
                entries: 0,
                icon: selectedIcon,
                color: selectedColor,
              );

              Navigator.pop(dialogContext);

              if (!mounted) return;

              Navigator.pop(context, category);
            },
            child:  Text('Save',style: TextStyle(color: AppTheme.success),),
          ),
        ],
      ),
    );
  }



  @override
  Widget build(BuildContext context) {
    final icons = iconGroups[selectedGroup]!;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        backgroundColor: AppTheme.background,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, size: 22.sp),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 16.w),
            child: GestureDetector(
              onTap: _onSavePressed,
              child: CircleAvatar(
                backgroundColor: selectedColor,
                child: Icon(Icons.check, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// Name field (icon = selected icon)
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Category name',
                prefixIcon: Icon(selectedIcon, color: selectedColor),
                filled: true,
                fillColor: Colors.grey.shade100,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16.r),
                  borderSide: BorderSide.none,
                ),
              ),
            ),

            SizedBox(height: 24.h),

            /// Color Picker
            ColorPicker(
              pickerColor: selectedColor,
              onColorChanged: (c) => setState(() => selectedColor = c),
              enableAlpha: false,
            ),

            SizedBox(height: 24.h),

            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: IconGroup.values.map((group) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    /// Group title
                    Padding(
                      padding: EdgeInsets.only(top: 24.h, bottom: 12.h),
                      child: Text(
                        group.name.toUpperCase(),
                        style: TextStyle(
                          fontSize: 13.sp,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey,
                          letterSpacing: 1.2,
                        ),
                      ),
                    ),
                    SizedBox(height: 24.h),
                    /// Icons grid
                    GridView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: iconGroups[group]!.length,
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 5,
                        crossAxisSpacing: 12.w,
                        mainAxisSpacing: 12.h,
                      ),
                      itemBuilder: (_, index) {
                        final icon = iconGroups[group]![index];
                        final isSelected = selectedIcon == icon;

                        return GestureDetector(
                          onTap: () => setState(() => selectedIcon = icon),
                          child: Container(
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? selectedColor.withOpacity(0.18)
                                  : Colors.grey.shade200,
                              borderRadius: BorderRadius.circular(16.r),
                              border: Border.all(
                                color:
                                isSelected ? selectedColor : Colors.transparent,
                                width: 2,
                              ),
                            ),
                            child: Icon(
                              icon,
                              size: 26.sp,
                              color: isSelected ? selectedColor : Colors.black,
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                );
              }).toList(),
            ),

          ],
        ),
      ),
    );
  }
}
