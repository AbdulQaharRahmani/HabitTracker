import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';
import 'package:habit_tracker/utils/category/model.dart';
import '../../services/category_api/category_api.dart';
import '../../services/taskPageAPI/task_api.dart';
import '../../utils/tasks_page_component/token_storage.dart';

class NewTaskPage extends StatefulWidget {
  const NewTaskPage({super.key});

  @override
  State<NewTaskPage> createState() => _NewTaskPageState();
}

class _NewTaskPageState extends State<NewTaskPage> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _priorityController = TextEditingController();

  final TaskApiService _apiService = TaskApiService();
  final CategoryApiService _categoryApi = CategoryApiService();

  bool _isLoading = false;
  bool _isTokenLoading = true;
  String? _token;

  List<CategoryModel> _categories = [];
  String? _selectedCategoryId;

  @override
  void initState() {
    super.initState();
    _loadTokenAndCategories();
  }

  Future<void> _loadTokenAndCategories() async {
    try {
      final token = await TokenStorage.getToken();
      if (token == null) {
        setState(() => _isTokenLoading = false);
        return;
      }

      final categoriesFromApi = await _categoryApi.fetchCategories();

      setState(() {
        _token = token;
        _categories = categoriesFromApi;
        if (_categories.isNotEmpty) _selectedCategoryId = _categories.first.id;
        _isTokenLoading = false;
      });
    } catch (e) {
      setState(() => _isTokenLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error fetching categories: $e')));
    }
  }

  Future<void> _createTask() async {
    if (_token == null || _selectedCategoryId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please login and select a category')),
      );
      return;
    }

    if (_titleController.text.isEmpty || _descController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text(
              'Title and description are required',
              style: TextStyle(color: Colors.red),
            )),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      await _apiService.addTask(
        categoryId: _selectedCategoryId!,
        title: _titleController.text.trim(),
        description: _descController.text.trim(),
        priority: _priorityController.text.trim(),
        status: 'todo',
      );

      if (!mounted) return;
      Navigator.pop(context, true);
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Error creating task: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isTokenLoading)
      return const Scaffold(body: Center(child: CircularProgressIndicator()));

    return Scaffold(
      backgroundColor: AppTheme.surface,
      appBar: AppBar(
        backgroundColor: AppTheme.surface,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'Create New Task',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildLabel('Task Title'),
            _buildTextField(_titleController, 'Enter title...', 1),
            const SizedBox(height: 20),
            _buildLabel('Description'),
            _buildTextField(_descController, 'Enter description...', 3),
            const SizedBox(height: 20),
            _buildLabel('Priority'),
            _buildTextField(_priorityController, 'Enter priority...', 1),
            const SizedBox(height: 20),
            _buildLabel('Category'),
            _buildCategoryDropdown(),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 55,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _createTask,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primary,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(15),
                  ),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                  'Create Task',
                  style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.surface),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String text) => Padding(
    padding: const EdgeInsets.only(bottom: 8),
    child: Text(
      text,
      style: const TextStyle(
          fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
    ),
  );

  Widget _buildTextField(TextEditingController controller, String hint, int maxLines) =>
      TextField(
        controller: controller,
        maxLines: maxLines,
        decoration: InputDecoration(
          hintText: hint,
          filled: true,
          fillColor: const Color(0xfff3f4f6),
          border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
        ),
      );

  Widget _buildCategoryDropdown() {
    if (_categories.isEmpty) return const Text('No categories available');

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        color: AppTheme.background,
        borderRadius: BorderRadius.circular(12),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedCategoryId,
          isExpanded: true,
          items: _categories.map((cat) {
            return DropdownMenuItem(
              value: cat.id,
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: stringToColor(cat.backgroundColor.toString()),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(stringToIcon(cat.icon.toString()), color: Colors.white, size: 20),
                  ),
                  const SizedBox(width: 8),
                  Flexible(child: Text(cat.name, overflow: TextOverflow.ellipsis)),
                ],
              ),
            );
          }).toList(),
          onChanged: (val) => setState(() => _selectedCategoryId = val),
        ),
      ),
    );
  }

  Color stringToColor(String? colorStr) {
    switch (colorStr?.toLowerCase()) {
      case 'red':
        return Colors.red;
      case 'green':
        return Colors.green;
      case 'blue':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  IconData stringToIcon(String? iconStr) {
    switch (iconStr) {
      case 'sports':
        return Icons.sports;
      case 'work':
        return Icons.work;
      case 'home':
        return Icons.home;
      default:
        return Icons.category;
    }
  }
}
