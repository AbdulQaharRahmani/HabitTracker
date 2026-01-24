import 'package:flutter/material.dart';

import '../../utils/category/category_model.dart';

/// =======================
/// Models
/// =======================
class AppIcon {
  final String id;
  final IconData icon;
  const AppIcon(this.id, this.icon);
}

class AppColor {
  final String id;
  final Color color;
  const AppColor(this.id, this.color);
}

/// =======================
/// Static Data (More options)
/// =======================
const List<AppIcon> appIcons = [
  AppIcon('study', Icons.school),
  AppIcon('work', Icons.work),
  AppIcon('sport', Icons.fitness_center),
  AppIcon('health', Icons.favorite),
  AppIcon('personal', Icons.person),
  AppIcon('other', Icons.category),
  AppIcon('fun', Icons.sentiment_satisfied),
  AppIcon('shopping', Icons.shopping_cart),
  AppIcon('travel', Icons.airplanemode_active),
  AppIcon('idea', Icons.lightbulb),
];

const List<AppColor> appColors = [
  AppColor('blue', Color(0xFF1E88E5)),
  AppColor('indigo', Color(0xFF3949AB)),
  AppColor('green', Color(0xFF43A047)),
  AppColor('red', Color(0xFFE53935)),
  AppColor('purple', Color(0xFF8E24AA)),
  AppColor('grey', Color(0xFF757575)),
  AppColor('orange', Color(0xFFF4511E)),
  AppColor('pink', Color(0xFFE91E63)),
  AppColor('teal', Color(0xFF009688)),
  AppColor('brown', Color(0xFF6D4C41)),
];

/// =======================
/// Page
/// =======================
class CreateCategory extends StatefulWidget {
  const CreateCategory({super.key});

  @override
  State<CreateCategory> createState() => _CreateCategoryState();
}

class _CreateCategoryState extends State<CreateCategory> {
  final TextEditingController _titleController = TextEditingController();
  String? selectedIconId;
  String? selectedColorId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Add New Category',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// ===== Category Name =====
            const Text('Category Name', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            TextField(
              controller: _titleController,
              decoration: InputDecoration(
                hintText: 'e.g. Study',
                border:
                OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 12),
              ),
            ),
            const SizedBox(height: 24),

            /// ===== Icon Picker =====
            const Text('Choose Icon', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 12),
            _buildIconPicker(),
            const SizedBox(height: 24),

            /// ===== Color Picker =====
            const Text('Choose Color', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 12),
            _buildColorPicker(),
            const SizedBox(height: 24),

            /// ===== Preview =====
            const Text('Preview', style: TextStyle(fontSize: 16)),
            const SizedBox(height: 12),
            _buildPreview(),
            const SizedBox(height: 32),

            /// ===== Actions =====
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14)),
                    child: const Text('Cancel'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _submit,
                    style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14)),
                    child: const Text('Save'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  /// =======================
  /// Icon Picker Grid
  /// =======================
  Widget _buildIconPicker() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: appIcons.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 5,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
      ),
      itemBuilder: (_, index) {
        final item = appIcons[index];
        final isSelected = selectedIconId == item.id;

        return GestureDetector(
          onTap: () => setState(() => selectedIconId = item.id),
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                  color: isSelected ? Colors.blue : Colors.grey.shade300),
              color: isSelected ? Colors.blue.withOpacity(0.15) : null,
            ),
            child: Icon(item.icon, color: isSelected ? Colors.blue : Colors.black),
          ),
        );
      },
    );
  }

  /// =======================
  /// Color Picker
  /// =======================
  Widget _buildColorPicker() {
    return Wrap(
      spacing: 12,
      children: appColors.map((c) {
        final isSelected = selectedColorId == c.id;
        return GestureDetector(
          onTap: () => setState(() => selectedColorId = c.id),
          child: CircleAvatar(
            radius: 22,
            backgroundColor: c.color,
            child: isSelected
                ? const Icon(Icons.check, color: Colors.white, size: 20)
                : null,
          ),
        );
      }).toList(),
    );
  }

  /// =======================
  /// Preview
  /// =======================
  Widget _buildPreview() {
    if (selectedIconId == null || selectedColorId == null) return Container(
      height: 70,
      alignment: Alignment.center,
      child: const Text('Select icon and color to preview'),
    );

    final icon = appIcons.firstWhere((e) => e.id == selectedIconId!).icon;
    final color = appColors.firstWhere((e) => e.id == selectedColorId!).color;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: color,
            radius: 24,
            child: Icon(icon, color: Colors.white, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              _titleController.text.isEmpty
                  ? 'Preview'
                  : _titleController.text,
              style: const TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 18),
            ),
          ),
        ],
      ),
    );
  }

  /// =======================
  /// Submit
  /// =======================
  void _submit() {
    if (_titleController.text.isEmpty ||
        selectedIconId == null ||
        selectedColorId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Complete all fields')),
      );
      return;
    }

    Navigator.pop(
      context,
      CreateCategoryModel(
        iconName: selectedIconId!,
        name: _titleController.text.trim(),
       backgroundColor: selectedColorId!,
      ),
    );
  }
}
