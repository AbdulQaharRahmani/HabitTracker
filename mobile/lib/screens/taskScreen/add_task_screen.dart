import 'package:flutter/material.dart';
import 'package:habit_tracker/app/app_theme.dart';
import '../../services/category_api/category_api.dart';
import '../../services/taskPageAPI/task_api.dart';
import '../../utils/tasks_page_component/token_storage.dart';
import '../../utils/tasks_page_component/category.dart';

class NewTaskPage extends StatefulWidget {
  const NewTaskPage({super.key});

  @override
  State<NewTaskPage> createState() => _NewTaskPageState();
}

class _NewTaskPageState extends State<NewTaskPage> {
  // ====== Controllers ======
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _timeController = TextEditingController();

  // ====== API Services ======
  final TaskApiService _apiService = TaskApiService();
  final CategoryApiService _categoryApi = CategoryApiService();

  // ====== UI State ======
  bool _isLoading = false;
  bool _isTokenLoading = true;
  String? _token;

  // ====== Categories ======
  List<Category> _categories = [];
  String? _selectedCategoryId; // store _id of selected category

  @override
  void initState() {
    super.initState();
    _loadTokenAndCategories();
  }

  // ====== Load token and fetch categories ======
  Future<void> _loadTokenAndCategories() async {
    final token = await TokenStorage.getToken();
    if (token == null) {
      setState(() => _isTokenLoading = false);
      return;
    }

    final categories = await _categoryApi.fetchCategories();

    setState(() {
      _token = token;
      _categories = categories;
      if (categories.isNotEmpty) {
        _selectedCategoryId = categories.first.id; // default first category
      }
      _isTokenLoading = false;
    });
  }

  // ====== Create Task ======
  Future<void> _createTask() async {
    if (_token == null || _selectedCategoryId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please login and select a category')),
      );
      return;
    }

    if (_titleController.text.isEmpty || _descController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Title and description are required')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      await _apiService.addTask(
       category: _selectedCategoryId!, // send id to backend
        title: _titleController.text.trim(),
        description: _descController.text.trim(),
        frequency: _timeController.text,
        status: 'todo',
        priority: 'medium',
      );

      if (!mounted) return;
      Navigator.pop(context, true);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isTokenLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

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
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildLabel('Frequency'),
                      _buildTextField(_timeController, 'write frequency for tasks', 1),
                    ],
                  ),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildLabel('Category'),
                      _buildCategoryDropdown(),
                    ],
                  ),
                ),
              ],
            ),
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
                    color: AppTheme.surface,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: AppTheme.textPrimary,
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hint, int maxLines) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      decoration: InputDecoration(
        hintText: hint,
        filled: true,
        fillColor: const Color(0xfff3f4f6),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  Widget _buildCategoryDropdown() {
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
          items: _categories
              .map(
                (cat) => DropdownMenuItem(
              value: cat.id,
              child: Text(cat.name),
            ),
          )
              .toList(),
          onChanged: (val) => setState(() => _selectedCategoryId = val),
        ),
      ),
    );
  }
}
