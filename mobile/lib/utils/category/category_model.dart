import 'package:flutter/material.dart';

class CategoryModel {
  final String id;
  final String name;
  final String iconName;
  final Color backgroundColor;

  CategoryModel({
    required this.id,
    required this.name,
    required this.iconName,
    required this.backgroundColor,
  });

  factory CategoryModel.fromJson(Map<String, dynamic> json) {
    return CategoryModel(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      iconName: json['icon'] ?? 'circle',
      backgroundColor: _stringToColor(json['backgroundColor'] ?? '#9E9E9E'),
    );
  }

  static Color _stringToColor(String colorStr) {
    // Support for hexadecimal colors
    if (colorStr.startsWith('#')) {
      try {
        String hexColor = colorStr.replaceAll('#', '');
        if (hexColor.length == 6) {
          hexColor = 'FF$hexColor';
        }
        return Color(int.parse(hexColor, radix: 16));
      } catch (e) {
        return Colors.grey;
      }
    }

    // Support for named colors
    switch (colorStr.toLowerCase()) {
      case 'red':
        return Colors.red;
      case 'redaccent':
        return Colors.redAccent;
      case 'pink':
        return Colors.pink;
      case 'pinkaccent':
        return Colors.pinkAccent;
      case 'purple':
        return Colors.purple;
      case 'purpleaccent':
        return Colors.purpleAccent;
      case 'deeppurple':
        return Colors.deepPurple;
      case 'deeppurpleaccent':
        return Colors.deepPurpleAccent;
      case 'indigo':
        return Colors.indigo;
      case 'indigoaccent':
        return Colors.indigoAccent;
      case 'blue':
        return Colors.blue;
      case 'blueaccent':
        return Colors.blueAccent;
      case 'lightblue':
        return Colors.lightBlue;
      case 'lightblueaccent':
        return Colors.lightBlueAccent;
      case 'cyan':
        return Colors.cyan;
      case 'cyanaccent':
        return Colors.cyanAccent;
      case 'teal':
        return Colors.teal;
      case 'tealaccent':
        return Colors.tealAccent;
      case 'green':
        return Colors.green;
      case 'greenaccent':
        return Colors.greenAccent;
      case 'lightgreen':
        return Colors.lightGreen;
      case 'lightgreenaccent':
        return Colors.lightGreenAccent;
      case 'lime':
        return Colors.lime;
      case 'limeaccent':
        return Colors.limeAccent;
      case 'yellow':
        return Colors.yellow;
      case 'yellowaccent':
        return Colors.yellowAccent;
      case 'amber':
        return Colors.amber;
      case 'amberaccent':
        return Colors.amberAccent;
      case 'orange':
        return Colors.orange;
      case 'orangeaccent':
        return Colors.orangeAccent;
      case 'deeporange':
        return Colors.deepOrange;
      case 'deeporangeaccent':
        return Colors.deepOrangeAccent;
      case 'brown':
        return Colors.brown;
      case 'grey':
        return Colors.grey;
      case 'bluegrey':
        return Colors.blueGrey;
      default:
        return Colors.grey;
    }
  }

  // Convert the color to a string for backend storage
  String get backgroundColorString {
    String hex = backgroundColor.value.toRadixString(16).toUpperCase();
    return '#${hex.substring(2)}${hex.substring(0, 2)}';
  }

  // Full icon map
  static final Map<String, IconData> _iconMap = {
    // 📚 Study & Education
    'school': Icons.school,
    'menu_book': Icons.menu_book,
    'library_books': Icons.library_books,
    'auto_stories': Icons.auto_stories,
    'edit_note': Icons.edit_note,

    // 💼 Work & Business
    'work': Icons.work,
    'business': Icons.business,
    'business_center': Icons.business_center,
    'work_outline': Icons.work_outline,
    'apartment': Icons.apartment,

    // 🛒 Shopping
    'shopping_cart': Icons.shopping_cart,
    'local_grocery_store': Icons.local_grocery_store,
    'shopping_bag': Icons.shopping_bag,
    'store': Icons.store,
    'local_mall': Icons.local_mall,

    // 🏠 Home
    'home': Icons.home,
    'house': Icons.house,
    'home_work': Icons.home_work,
    'cottage': Icons.cottage,
    'bed': Icons.bed,

    // 🏥 Health
    'health': Icons.health_and_safety,
    'medical_services': Icons.medical_services,
    'local_hospital': Icons.local_hospital,
    'favorite': Icons.favorite,
    'fitness_center': Icons.fitness_center,

    // 🚗 Travel & Transport
    'directions_car': Icons.directions_car,
    'flight': Icons.flight,
    'directions_bus': Icons.directions_bus,
    'train': Icons.train,
    'directions_bike': Icons.directions_bike,

    // 🎉 Entertainment & Fun
    'sports': Icons.sports,
    'sports_soccer': Icons.sports_soccer,
    'sports_esports': Icons.sports_esports,
    'movie': Icons.movie,
    'music_note': Icons.music_note,

    // 👨‍👩‍👧‍👦 Personal
    'person': Icons.person,
    'family_restroom': Icons.family_restroom,
    'child_care': Icons.child_care,
    'elderly': Icons.elderly,
    'pets': Icons.pets,

    // 💰 Finance
    'account_balance': Icons.account_balance,
    'payments': Icons.payments,
    'savings': Icons.savings,
    'attach_money': Icons.attach_money,
    'credit_card': Icons.credit_card,

    // 📱 Technology
    'computer': Icons.computer,
    'phone_iphone': Icons.phone_iphone,
    'laptop': Icons.laptop,
    'devices': Icons.devices,
    'memory': Icons.memory,

    // 🍽 Food & Restaurant
    'restaurant': Icons.restaurant,
    'local_dining': Icons.local_dining,
    'fastfood': Icons.fastfood,
    'kitchen': Icons.kitchen,
    'coffee': Icons.coffee,

    // 🎨 Creativity
    'palette': Icons.palette,
    'brush': Icons.brush,
    'color_lens': Icons.color_lens,
    'draw': Icons.draw,
    'photo_camera': Icons.photo_camera,

    // 📅 Time & Scheduling
    'event': Icons.event,
    'schedule': Icons.schedule,
    'calendar_today': Icons.calendar_today,
    'access_time': Icons.access_time,
    'timer': Icons.timer,

    // 📍 Locations
    'place': Icons.place,
    'location_on': Icons.location_on,
    'map': Icons.map,
    'explore': Icons.explore,
    'pin_drop': Icons.pin_drop,

    // 💡 Ideas & Projects
    'lightbulb': Icons.lightbulb,
    'idea': Icons.lightbulb_outline,
    'inventory': Icons.inventory,
    'build': Icons.build,
    'construction': Icons.construction,

    // 📧 Communication
    'email': Icons.email,
    'chat': Icons.chat,
    'forum': Icons.forum,
    'call': Icons.call,
    'contact_mail': Icons.contact_mail,

    // ⚙ Tools & Settings
    'settings': Icons.settings,
    'tune': Icons.tune,
    'handyman': Icons.handyman,
    'engineering': Icons.engineering,
    'biotech': Icons.biotech,

    // 📊 Analytics
    'analytics': Icons.analytics,
    'assessment': Icons.assessment,
    'trending_up': Icons.trending_up,
    'show_chart': Icons.show_chart,
    'bar_chart': Icons.bar_chart,

    // General icons
    'task': Icons.task,
    'task_alt': Icons.task_alt,
    'check_circle': Icons.check_circle,
    'warning': Icons.warning,
    'error': Icons.error,
    'info': Icons.info,
    'help': Icons.help,
    'star': Icons.star,
    'category': Icons.category,
    'folder': Icons.folder,
    'insert_drive_file': Icons.insert_drive_file,
    'description': Icons.description,
    'note': Icons.note,
    'notes': Icons.notes,
    'list': Icons.list,
    'format_list_bulleted': Icons.format_list_bulleted,
    'checklist': Icons.checklist,
    'done': Icons.done,
    'done_all': Icons.done_all,
    'pending': Icons.pending,
    'hourglass_empty': Icons.hourglass_empty,
    'circle': Icons.circle,
    'radio_button_unchecked': Icons.radio_button_unchecked,
    'check_box_outline_blank': Icons.check_box_outline_blank,
  };

  // Icon categories for UI display
  static final Map<String, List<String>> _iconCategories = {
    '📚 Study & Education': ['school', 'menu_book', 'library_books', 'auto_stories', 'edit_note'],
    '💼 Work & Business': ['work', 'business', 'business_center', 'work_outline', 'apartment'],
    '🛒 Shopping': ['shopping_cart', 'local_grocery_store', 'shopping_bag', 'store', 'local_mall'],
    '🏠 Home': ['home', 'house', 'home_work', 'cottage', 'bed'],
    '🏥 Health': ['health', 'medical_services', 'local_hospital', 'favorite', 'fitness_center'],
    '🚗 Travel & Transport': ['directions_car', 'flight', 'directions_bus', 'train', 'directions_bike'],
    '🎉 Entertainment & Fun': ['sports', 'sports_soccer', 'sports_esports', 'movie', 'music_note'],
    '👨‍👩‍👧‍👦 Personal': ['person', 'family_restroom', 'child_care', 'elderly', 'pets'],
    '💰 Finance': ['account_balance', 'payments', 'savings', 'attach_money', 'credit_card'],
    '📱 Technology': ['computer', 'phone_iphone', 'laptop', 'devices', 'memory'],
    '🍽 Food & Restaurant': ['restaurant', 'local_dining', 'fastfood', 'kitchen', 'coffee'],
    '🎨 Creativity': ['palette', 'brush', 'color_lens', 'draw', 'photo_camera'],
    '📅 Time & Scheduling': ['event', 'schedule', 'calendar_today', 'access_time', 'timer'],
    '📍 Locations': ['place', 'location_on', 'map', 'explore', 'pin_drop'],
    '💡 Ideas & Projects': ['lightbulb', 'idea', 'inventory', 'build', 'construction'],
    '📧 Communication': ['email', 'chat', 'forum', 'call', 'contact_mail'],
    '⚙ Tools & Settings': ['settings', 'tune', 'handyman', 'engineering', 'biotech'],
    '📊 Analytics': ['analytics', 'assessment', 'trending_up', 'show_chart', 'bar_chart'],
    '📋 General': ['task', 'task_alt', 'check_circle', 'warning', 'error', 'info', 'help', 'star', 'category', 'folder'],
  };

  // Get icon by name
  IconData get icon => _iconMap[iconName] ?? Icons.circle;

  // Get all icons
  static List<String> get allIcons => _iconMap.keys.toList();

  // Get icons by category
  static Map<String, List<String>> get iconCategories => _iconCategories;

  // Get all category names
  static List<String> get categoryNames => _iconCategories.keys.toList();

  // Get icons of a specific category
  static List<String> getIconsByCategory(String categoryName) {
    return _iconCategories[categoryName] ?? [];
  }
}

// =========================
// Model for creating new category
// =========================
class CreateCategoryModel {
  final String name;
  final String iconName;
  final String backgroundColor;

  CreateCategoryModel({
    required this.name,
    required this.iconName,
    required this.backgroundColor,
  });

  Map<String, dynamic> toJson() {
    return {"name": name, "icon": iconName, "backgroundColor": backgroundColor};
  }
}
