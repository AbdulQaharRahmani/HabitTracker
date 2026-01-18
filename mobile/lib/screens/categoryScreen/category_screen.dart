import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:habit_tracker/screens/categoryScreen/add_category.dart';

import '../../app/app_theme.dart';
import '../../utils/category/category_card.dart';
import '../../utils/category/category_model.dart';

class CategoryScreen extends StatefulWidget {
  const CategoryScreen({super.key});

  @override
  State<CategoryScreen> createState() => _CategoryScreenState();
}

class _CategoryScreenState extends State<CategoryScreen> {
  final List<CategoryModel> categories = [
    CategoryModel(
      title: 'Other',
      entries: 1,
      icon: Icons.widgets,
      color: AppTheme.error,
    ),
    CategoryModel(
      title: 'Health',
      entries: 2,
      icon: Icons.monitor_heart,
      color: AppTheme.healthText,
    ),
    CategoryModel(
      title: 'Study',
      entries: 0,
      icon: Icons.school,
      color: AppTheme.learningText,
    ),
    CategoryModel(
      title: 'Work',
      entries: 0,
      icon: Icons.work,
      color: AppTheme.creativityText,
    ),
    CategoryModel(
      title: 'Home',
      entries: 0,
      icon: Icons.home,
      color: AppTheme.productivityText,
    ),
    CategoryModel(
      title: 'Art',
      entries: 0,
      icon: Icons.palette,
      color: AppTheme.success,
    ),
    CategoryModel(
      title: 'Gym',
      entries: 0,
      icon: Icons.fitness_center,
      color: AppTheme.warning,
    ),
    CategoryModel(
      title: 'Outdoor',
      entries: 0,
      icon: Icons.park,
      color: AppTheme.pendingIcon,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppTheme.primary,
        onPressed: () async {
          final result = await Navigator.push<CategoryModel>(
            context,
            MaterialPageRoute(builder: (_) => const AddCategory()),
          );

          if (result != null) {
            setState(() {
              categories.add(result);
            });
          }
        },
        child: Icon(Icons.add, size: 24.sp, color: AppTheme.textWhite),
      ),

      appBar: AppBar(
        backgroundColor: AppTheme.background,
        centerTitle: true,
        title: Text('Categories', style: TextStyle(fontSize: 18.sp)),
        leading: IconButton(
          onPressed: () {
            Navigator.pop(context);
          },
          icon: Icon(Icons.arrow_back_ios_new, size: 22.sp),
        ),
        actions: [
          IconButton(
            onPressed: () {},
            icon: Icon(Icons.menu, size: 22.sp),
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.w),
        child: GridView.builder(
          itemCount: categories.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 4,
            crossAxisSpacing: 14.w,
            mainAxisSpacing: 18.h,
            childAspectRatio: 0.6,
          ),
          itemBuilder: (context, index) {
            return CategoryCard(category: categories[index]);
          },
        ),
      ),
    );
  }
}
