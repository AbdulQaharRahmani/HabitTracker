import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';
import '../../services/category_cache.dart';
import '../../utils/category/category_model.dart';

/// =======================
/// Models
/// =======================
class AppIcon {
  final String id;
  final IconData icon;
  final String category;
  const AppIcon(this.id, this.icon, {this.category = 'General'});
}

class AppColor {
  final String id;
  final Color color;
  final String displayName;
  const AppColor(this.id, this.color, {required this.displayName});
}

/// =======================
/// Static Data (Expanded options)
/// =======================
final List<AppIcon> appIcons = [
 // 📚 Education and Study
  AppIcon('school', Icons.school, category: '📚 Education'),
  AppIcon('menu_book', Icons.menu_book, category: '📚 Education'),
  AppIcon('library_books', Icons.library_books, category: '📚 Education'),
  AppIcon('auto_stories', Icons.auto_stories, category: '📚 Education'),
  AppIcon('edit_note', Icons.edit_note, category: '📚 Education'),

  // 💼 Work and Business
  AppIcon('work', Icons.work, category: '💼 Work'),
  AppIcon('business', Icons.business, category: '💼 Work'),
  AppIcon('business_center', Icons.business_center, category: '💼 Work'),
  AppIcon('work_outline', Icons.work_outline, category: '💼 Work'),
  AppIcon('apartment', Icons.apartment, category: '💼 Work'),

  // 🛒 Shopping
  AppIcon('shopping_cart', Icons.shopping_cart, category: '🛒 Shopping'),
  AppIcon('local_grocery_store', Icons.local_grocery_store, category: '🛒 Shopping'),
  AppIcon('shopping_bag', Icons.shopping_bag, category: '🛒 Shopping'),
  AppIcon('store', Icons.store, category: '🛒 Shopping'),
  AppIcon('local_mall', Icons.local_mall, category: '🛒 Shopping'),

// 🏠 Home
  AppIcon('home', Icons.home, category: '🏠 Home'),
  AppIcon('house', Icons.house, category: '🏠 Home'),
  AppIcon('home_work', Icons.home_work, category: '🏠 Home'),
  AppIcon('cottage', Icons.cottage, category: '🏠 Home'),
  AppIcon('bed', Icons.bed, category: '🏠 Home'),

// 🏥 Health
  AppIcon('health_and_safety', Icons.health_and_safety, category: '🏥 Health'),
  AppIcon('medical_services', Icons.medical_services, category: '🏥 Health'),
  AppIcon('local_hospital', Icons.local_hospital, category: '🏥 Health'),
  AppIcon('favorite', Icons.favorite, category: '🏥 Health'),
  AppIcon('fitness_center', Icons.fitness_center, category: '🏥 Health'),

  // 🚗 Travel and Transportation
  AppIcon('directions_car', Icons.directions_car, category: '🚗 Travel'),
  AppIcon('flight', Icons.flight, category: '🚗 Travel'),
  AppIcon('directions_bus', Icons.directions_bus, category: '🚗 Travel'),
  AppIcon('train', Icons.train, category: '🚗 Travel'),
  AppIcon('directions_bike', Icons.directions_bike, category: '🚗 Travel'),

  // 🎉 Entertainment and Fun
  AppIcon('sports', Icons.sports, category: '🎉 Entertainment'),
  AppIcon('sports_soccer', Icons.sports_soccer, category: '🎉 Entertainment'),
  AppIcon('sports_esports', Icons.sports_esports, category: '🎉 Entertainment'),
  AppIcon('movie', Icons.movie, category: '🎉 Entertainment'),
  AppIcon('music_note', Icons.music_note, category: '🎉 Entertainment'),

  // 👨‍👩‍👧‍👦 Personal
  AppIcon('person', Icons.person, category: '👨‍👩‍👧‍👦 Personal'),
  AppIcon('family_restroom', Icons.family_restroom, category: '👨‍👩‍👧‍👦 Personal'),
  AppIcon('child_care', Icons.child_care, category: '👨‍👩‍👧‍👦 Personal'),
  AppIcon('elderly', Icons.elderly, category: '👨‍👩‍👧‍👦 Personal'),
  AppIcon('pets', Icons.pets, category: '👨‍👩‍👧‍👦 Personal'),

// 💰 Finance
  AppIcon('account_balance', Icons.account_balance, category: '💰 Finance'),
  AppIcon('payments', Icons.payments, category: '💰 Finance'),
  AppIcon('savings', Icons.savings, category: '💰 Finance'),
  AppIcon('attach_money', Icons.attach_money, category: '💰 Finance'),
  AppIcon('credit_card', Icons.credit_card, category: '💰 Finance'),

  // 📱 Technology
  AppIcon('computer', Icons.computer, category: '📱 Technology'),
  AppIcon('phone_iphone', Icons.phone_iphone, category: '📱 Technology'),
  AppIcon('laptop', Icons.laptop, category: '📱 Technology'),
  AppIcon('devices', Icons.devices, category: '📱 Technology'),
  AppIcon('memory', Icons.memory, category: '📱 Technology'),

  // 🍽 Food and Restaurant
  AppIcon('restaurant', Icons.restaurant, category: '🍽 Food'),
  AppIcon('local_dining', Icons.local_dining, category: '🍽 Food'),
  AppIcon('fastfood', Icons.fastfood, category: '🍽 Food'),
  AppIcon('kitchen', Icons.kitchen, category: '🍽 Food'),
  AppIcon('coffee', Icons.coffee, category: '🍽 Food'),

  // 🎨 Creativity
  AppIcon('palette', Icons.palette, category: '🎨 Creativity'),
  AppIcon('brush', Icons.brush, category: '🎨 Creativity'),
  AppIcon('color_lens', Icons.color_lens, category: '🎨 Creativity'),
  AppIcon('draw', Icons.draw, category: '🎨 Creativity'),
  AppIcon('photo_camera', Icons.photo_camera, category: '🎨 Creativity'),

  // 📅 Time and Planning
  AppIcon('event', Icons.event, category: '📅 Planning'),
  AppIcon('schedule', Icons.schedule, category: '📅 Planning'),
  AppIcon('calendar_today', Icons.calendar_today, category: '📅 Planning'),
  AppIcon('access_time', Icons.access_time, category: '📅 Planning'),
  AppIcon('timer', Icons.timer, category: '📅 Planning'),

  // 📍 Locations
  AppIcon('place', Icons.place, category: '📍 Locations'),
  AppIcon('location_on', Icons.location_on, category: '📍 Locations'),
  AppIcon('map', Icons.map, category: '📍 Locations'),
  AppIcon('explore', Icons.explore, category: '📍 Locations'),
  AppIcon('pin_drop', Icons.pin_drop, category: '📍 Locations'),

// 💡 Ideas and Projects
  AppIcon('lightbulb', Icons.lightbulb, category: '💡 Projects'),
  AppIcon('lightbulb_outline', Icons.lightbulb_outline, category: '💡 Projects'),
  AppIcon('inventory', Icons.inventory, category: '💡 Projects'),
  AppIcon('build', Icons.build, category: '💡 Projects'),
  AppIcon('construction', Icons.construction, category: '💡 Projects'),

  // 📧 Communication
  AppIcon('email', Icons.email, category: '📧 Communication'),
  AppIcon('chat', Icons.chat, category: '📧 Communication'),
  AppIcon('forum', Icons.forum, category: '📧 Communication'),
  AppIcon('call', Icons.call, category: '📧 Communication'),
  AppIcon('contact_mail', Icons.contact_mail, category: '📧 Communication'),

  // ⚙ Settings and Tools
  AppIcon('settings', Icons.settings, category: '⚙ Tools'),
  AppIcon('tune', Icons.tune, category: '⚙ Tools'),
  AppIcon('handyman', Icons.handyman, category: '⚙ Tools'),
  AppIcon('engineering', Icons.engineering, category: '⚙ Tools'),
  AppIcon('biotech', Icons.biotech, category: '⚙ Tools'),

// 📊 Analytics and Statistics
  AppIcon('analytics', Icons.analytics, category: '📊 Analytics'),
  AppIcon('assessment', Icons.assessment, category: '📊 Analytics'),
  AppIcon('trending_up', Icons.trending_up, category: '📊 Analytics'),
  AppIcon('show_chart', Icons.show_chart, category: '📊 Analytics'),
  AppIcon('bar_chart', Icons.bar_chart, category: '📊 Analytics'),

// 📋 General
  AppIcon('task', Icons.task, category: '📋 General'),
  AppIcon('task_alt', Icons.task_alt, category: '📋 General'),
  AppIcon('check_circle', Icons.check_circle, category: '📋 General'),
  AppIcon('warning', Icons.warning, category: '📋 General'),
  AppIcon('error', Icons.error, category: '📋 General'),
  AppIcon('info', Icons.info, category: '📋 General'),
  AppIcon('help', Icons.help, category: '📋 General'),
  AppIcon('question_answer', Icons.question_answer, category: '📋 General'),
  AppIcon('star', Icons.star, category: '📋 General'),
  AppIcon('grade', Icons.grade, category: '📋 General'),
  AppIcon('favorite_border', Icons.favorite_border, category: '📋 General'),
  AppIcon('bookmark', Icons.bookmark, category: '📋 General'),
  AppIcon('tag', Icons.tag, category: '📋 General'),
  AppIcon('label', Icons.label, category: '📋 General'),
  AppIcon('category', Icons.category, category: '📋 General'),
  AppIcon('folder', Icons.folder, category: '📋 General'),
  AppIcon('insert_drive_file', Icons.insert_drive_file, category: '📋 General'),
  AppIcon('description', Icons.description, category: '📋 General'),
  AppIcon('note', Icons.note, category: '📋 General'),
  AppIcon('notes', Icons.notes, category: '📋 General'),
  AppIcon('list', Icons.list, category: '📋 General'),
  AppIcon('format_list_bulleted', Icons.format_list_bulleted, category: '📋 General'),
  AppIcon('checklist', Icons.checklist, category: '📋 General'),
  AppIcon('done', Icons.done, category: '📋 General'),
  AppIcon('done_all', Icons.done_all, category: '📋 General'),
  AppIcon('pending', Icons.pending, category: '📋 General'),
  AppIcon('hourglass_empty', Icons.hourglass_empty, category: '📋 General'),
  AppIcon('circle', Icons.circle, category: '📋 General'),
  AppIcon('radio_button_unchecked', Icons.radio_button_unchecked, category: '📋 General'),
  AppIcon('check_box_outline_blank', Icons.check_box_outline_blank, category: '📋 General'),
];

final List<AppColor> appColors = [
  // Reds
  AppColor('red', Colors.red, displayName: 'Classic Red'),
  AppColor('red_accent', Colors.redAccent, displayName: 'Red Accent'),
  AppColor('deep_orange', Colors.deepOrange, displayName: 'Deep Orange'),
  AppColor('deep_orange_accent', Colors.deepOrangeAccent, displayName: 'Orange Accent'),

  // Pinks
  AppColor('pink', Colors.pink, displayName: 'Pink'),
  AppColor('pink_accent', Colors.pinkAccent, displayName: 'Pink Accent'),

  // Purples
  AppColor('purple', Colors.purple, displayName: 'Purple'),
  AppColor('purple_accent', Colors.purpleAccent, displayName: 'Purple Accent'),
  AppColor('deep_purple', Colors.deepPurple, displayName: 'Deep Purple'),
  AppColor('deep_purple_accent', Colors.deepPurpleAccent, displayName: 'Deep Purple Accent'),

  // Blues
  AppColor('indigo', Colors.indigo, displayName: 'Indigo'),
  AppColor('indigo_accent', Colors.indigoAccent, displayName: 'Indigo Accent'),
  AppColor('blue', Colors.blue, displayName: 'Blue'),
  AppColor('blue_accent', Colors.blueAccent, displayName: 'Blue Accent'),
  AppColor('light_blue', Colors.lightBlue, displayName: 'Light Blue'),
  AppColor('light_blue_accent', Colors.lightBlueAccent, displayName: 'Light Blue Accent'),

  // Greens
  AppColor('teal', Colors.teal, displayName: 'Teal'),
  AppColor('teal_accent', Colors.tealAccent, displayName: 'Teal Accent'),
  AppColor('green', Colors.green, displayName: 'Green'),
  AppColor('green_accent', Colors.greenAccent, displayName: 'Green Accent'),
  AppColor('light_green', Colors.lightGreen, displayName: 'Light Green'),
  AppColor('light_green_accent', Colors.lightGreenAccent, displayName: 'Light Green Accent'),
  AppColor('lime', Colors.lime, displayName: 'Lime'),
  AppColor('lime_accent', Colors.limeAccent, displayName: 'Lime Accent'),

  // Yellows
  AppColor('yellow', Colors.yellow, displayName: 'Yellow'),
  AppColor('yellow_accent', Colors.yellowAccent, displayName: 'Yellow Accent'),
  AppColor('amber', Colors.amber, displayName: 'Amber'),
  AppColor('amber_accent', Colors.amberAccent, displayName: 'Amber Accent'),
  AppColor('orange', Colors.orange, displayName: 'Orange'),
  AppColor('orange_accent', Colors.orangeAccent, displayName: 'Orange Accent'),

  // Neutral Colors
  AppColor('brown', Colors.brown, displayName: 'Brown'),
  AppColor('grey', Colors.grey, displayName: 'Grey'),
  AppColor('blue_grey', Colors.blueGrey, displayName: 'Blue Grey'),

  // Special Colors
  AppColor('cyan', Colors.cyan, displayName: 'Cyan'),
  AppColor('cyan_accent', Colors.cyanAccent, displayName: 'Cyan Accent'),
];

final List<String> iconCategories = appIcons
    .map((icon) => icon.category)
    .toSet()
    .toList();

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

  String? selectedIconCategory;

  bool _isExpanded = false;

  @override
  void initState() {
    super.initState();
    selectedIconCategory = iconCategories[0];
    _isExpanded = true;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppTheme.background : Colors.grey[50],
      appBar: AppBar(
        title: const Text(
          'Create New Category',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
        ),
        centerTitle: true,
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: isDark ? Colors.white : Colors.black,
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: IconButton(
              icon: const Icon(Icons.help_outline),
              onPressed: _showHelpDialog,
              tooltip: 'Help',
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// ===== Preview Card (Animated) =====
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
              height: _isExpanded ? 120 : 0,
              child: _buildPreviewCard(context),
            ),
            const SizedBox(height: 20),

            /// ===== Category Name Input =====
            _buildSectionTitle('Category Name', Icons.title),
            const SizedBox(height: 10),
            _buildNameInput(),
            const SizedBox(height: 30),

            /// ===== Icon Selection =====
            _buildSectionTitle('Choose Icon', Icons.emoji_emotions),
            const SizedBox(height: 10),
            _buildIconCategoryTabs(),
            const SizedBox(height: 15),
            _buildIconPicker(),
            const SizedBox(height: 30),

            /// ===== Color Selection =====
            _buildSectionTitle('Choose Color', Icons.palette),
            const SizedBox(height: 10),
            _buildColorPicker(),
            const SizedBox(height: 40),

            /// ===== Action Buttons =====
            _buildActionButtons(),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 20, color: Colors.blue),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Colors.black87,
          ),
        ),
      ],
    );
  }

  Widget _buildNameInput() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha:  0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TextField(
        controller: _titleController,
        onChanged: (_) => setState(() {}),
        decoration: InputDecoration(
          hintText: 'Enter category name (e.g., Work, Study, Shopping)',
          hintStyle: const TextStyle(color: Colors.grey),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          prefixIcon: const Icon(Icons.edit, color: Colors.blueGrey),
          suffixIcon: _titleController.text.isNotEmpty
              ? IconButton(
            icon: const Icon(Icons.clear, color: Colors.grey),
            onPressed: () {
              _titleController.clear();
              setState(() {});
            },
          )
              : null,
        ),
        style: const TextStyle(fontSize: 16),
        maxLength: 30,
      ),
    );
  }

  Widget _buildIconCategoryTabs() {
    return SizedBox(
      height: 50,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: iconCategories.length,
        itemBuilder: (context, index) {
          final category = iconCategories[index];
          final isSelected = selectedIconCategory == category;

          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: Text(
                category.replaceAll(RegExp(r'[^\w\s]'), ''),
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.black87,
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                ),
              ),
              selected: isSelected,
              onSelected: (selected) {
                setState(() {
                  selectedIconCategory = category;
                });
              },
              backgroundColor: Colors.white,
              selectedColor: AppTheme.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(
                  color: isSelected ? Colors.blue : Colors.grey[300]!,
                  width: 1,
                ),
              ),
              // avatar: isSelected ? const Icon(Icons.check, size: 16, color: Colors.green) : null,

            ),
          );
        },
      ),
    );
  }

  Widget _buildIconPicker() {
    final filteredIcons = appIcons.where((icon) => icon.category == selectedIconCategory).toList();

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha:  0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsets.all(15),
        itemCount: filteredIcons.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 6,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1,
        ),
        itemBuilder: (_, index) {
          final item = filteredIcons[index];
          final isSelected = selectedIconId == item.id;

          return GestureDetector(
            onTap: () {
              setState(() {
                selectedIconId = item.id;
                _isExpanded = true;
              });
            },
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeInOut,
              decoration: BoxDecoration(
                color: isSelected ? Colors.blue.withValues(alpha:  0.1) : Colors.grey[50],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected ? Colors.blue : Colors.grey[300]!,
                  width: isSelected ? 2 : 1,
                ),
                boxShadow: isSelected ? [
                  BoxShadow(
                    color: Colors.blue.withValues(alpha:  0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ] : [],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    item.icon,
                    color: isSelected ? Colors.blue : Colors.grey[700],
                    size: 22,
                  ),
                  const SizedBox(height: 4),
                  if (isSelected)
                    Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: Colors.blue,
                        shape: BoxShape.circle,
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildColorPicker() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha:  0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Wrap(
        spacing: 12,
        runSpacing: 12,
        alignment: WrapAlignment.center,
        children: appColors.map((c) {
          final isSelected = selectedColorId == c.id;

          return GestureDetector(
            onTap: () {
              setState(() {
                selectedColorId = c.id;
                _isExpanded = true;
              });
            },
            child: Tooltip(
              message: c.displayName,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: isSelected ? 48 : 44,
                height: isSelected ? 48 : 44,
                decoration: BoxDecoration(
                  color: c.color,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isSelected ? Colors.white : Colors.transparent,
                    width: isSelected ? 3 : 0,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha:  0.1),
                      blurRadius: 6,
                      offset: const Offset(0, 3),
                    ),
                    if (isSelected)
                      BoxShadow(
                        color: c.color.withValues(alpha:  0.4),
                        blurRadius: 12,
                        spreadRadius: 2,
                      ),
                  ],
                ),
                child: isSelected
                    ? const Icon(Icons.check, color: Colors.white, size: 20)
                    : null,
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildPreviewCard(BuildContext context) {
    if (selectedIconId == null || selectedColorId == null || _titleController.text.isEmpty) {
      return Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha:  0.1),
              blurRadius: 20,
              offset: const Offset(0, 5),
            ),
          ],
        ),
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            const Icon(Icons.visibility, color: Colors.blueGrey, size: 30),
            const SizedBox(width: 15),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Preview',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[700],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Complete the form to see preview',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.grey[500],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }

    final icon = appIcons.firstWhere((e) => e.id == selectedIconId!).icon;
    final color = appColors.firstWhere((e) => e.id == selectedColorId!).color;

    return Container(
      decoration: BoxDecoration(
        color: color.withValues(alpha:  0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha:  0.3), width: 2),
        boxShadow: [
          BoxShadow(
            color: color.withValues( alpha:  0.2),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(15),
              boxShadow: [
                BoxShadow(
                  color: color.withValues(alpha:  0.4),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Icon(icon, color: Colors.white, size: 30),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  _titleController.text,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 5),
                Text(
                  'Icon: ${appIcons.firstWhere((e) => e.id == selectedIconId!).id}',
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey[600],
                  ),
                ),
                Text(
                  'Color: ${appColors.firstWhere((e) => e.id == selectedColorId!).displayName}',
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.arrow_forward_ios, color: Colors.blueGrey),
            onPressed: () {

            },
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    final isFormComplete = _titleController.text.isNotEmpty &&
        selectedIconId != null &&
        selectedColorId != null;

    return Row(
      children: [
        Expanded(
          child: OutlinedButton(
            onPressed: () => Navigator.pop(context),
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 18),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              side: BorderSide(color: Colors.grey[400]!),
            ),
            child: const Text(
              'Cancel',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
          ),
        ),
        const SizedBox(width: 15),
        Expanded(
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(12),
              boxShadow: isFormComplete
                  ? [
                BoxShadow(
                  color: Colors.blue.withValues(alpha:  0.3),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ]
                  : [],
            ),
            child: ElevatedButton(
              onPressed: isFormComplete ? _submit : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: isFormComplete ? AppTheme.primary : Colors.grey[400],
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                elevation: 0,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(width: 8),
                  const Text(
                    'Create Category',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (!isFormComplete) ...[
                    const SizedBox(width: 8),

                  ],
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  void _submit() {
    if (_titleController.text.isEmpty ||
        selectedIconId == null ||
        selectedColorId == null) {
      _showErrorSnackbar('Please fill all fields');
      return;
    }
    CategoryCache().clear();
     final color = appColors.firstWhere((e) => e.id == selectedColorId!);
    final backgroundColor = color.id.replaceAll('_', '');

    Navigator.pop(
      context,
      CreateCategoryModel(
        iconName: selectedIconId!,
        name: _titleController.text.trim(),
        backgroundColor: backgroundColor,
      ),
    );
  }

  void _showErrorSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.error_outline, color: Colors.white),
            const SizedBox(width: 10),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }

  void _showHelpDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: const [
            Icon(Icons.help, color: Colors.blue,size: 25,),
            const SizedBox(
              width: 5,
            ),
            Text(
              'How to create a category',
              style: TextStyle(fontWeight: FontWeight.bold,fontSize: 17),
            ),

          ],
        ),

        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('1. Enter a descriptive name for your category'),
            SizedBox(height: 8),
            Text('2. Choose an icon that represents your category'),
            SizedBox(height: 8),
            Text('3. Select a color for your category'),
            SizedBox(height: 8),
            Text('4. Preview your category and save it'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Got it!'),
          ),
        ],
      ),
    );
  }
}