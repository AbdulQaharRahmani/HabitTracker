import 'package:flutter/material.dart';
import '../../app/app_theme.dart';
import '../../services/taskpage_api/category_api.dart';
import '../../services/taskpage_api/tasks_api.dart';
import '../../utils/category/category_model.dart';
import '../../services/token_storage.dart';
import '../categoryScreen/create_category.dart';

class NewTaskPage extends StatefulWidget {
  const NewTaskPage({super.key});

  @override
  State<NewTaskPage> createState() => _NewTaskPageState();
}

class _NewTaskPageState extends State<NewTaskPage> {
  // ===== Controllers =====
  final _titleController = TextEditingController();
  final _descController = TextEditingController();

  // ===== API Services =====
  final TaskApiService _taskApi = TaskApiService();
  final CategoryApiService _categoryApi = CategoryApiService();

  // ===== UI State =====
  bool _isLoading = false;
  bool _isTokenLoading = true; // Used only for token fetch
  String? _token;

  // ===== Categories =====
  List<CategoryModel> _categories = [];
  String? _selectedCategoryId;

  // ===== Priority =====
  String _selectedPriority = 'medium';
  final List<String> _priorities = ['low', 'medium', 'high'];

  // ===== Due Date =====
  DateTime? _selectedDueDate;

  @override
  void initState() {
    super.initState();
    _loadTokenAndCategories();
  }

  /// Load token and fetch categories from server
  Future<void> _loadTokenAndCategories() async {
    try {
      final token = await AuthManager.getToken();
      if (token == null) {
        setState(() => _isTokenLoading = false);
        return;
      }

      final categories = await _categoryApi.fetchCategories(token: token);
      setState(() {
        _token = token;
        _categories = categories;
        _selectedCategoryId = _categories.isNotEmpty ? _categories.first.id : null;
        _isTokenLoading = false;
      });
    } catch (e) {
      setState(() => _isTokenLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error fetching categories: $e')),
      );
    }
  }

  /// Create a new task on server
  Future<void> _createTask() async {
    if (_token == null || _selectedCategoryId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please login and select a category')),
      );
      return;
    }
    if (_titleController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Title is required')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final res = await _taskApi.addTask(
        title: _titleController.text.trim(),
        description: _descController.text.trim(),
        status: 'todo',
        priority: _selectedPriority,
        categoryId: _selectedCategoryId!,
        token: _token,
        dueDate: _selectedDueDate?.toIso8601String(),
      );

      if (!mounted) return;

      if (res['success'] == true) {
        Navigator.pop(context, res['data']);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(res['error'] ?? 'Failed to create task')),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error creating task: $e')),
      );
    } finally {
      if (!mounted) return;
      setState(() => _isLoading = false);
    }
  }

  /// Handle creation of new category
  Future<void> _handleNewCategory(CreateCategoryModel model) async {
    try {
      setState(() => _isLoading = true);

      final CategoryModel newCategory = await _categoryApi.createCategory(model);

      setState(() {
        _categories.add(newCategory);
        _selectedCategoryId = newCategory.id;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Category created successfully!'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error creating category: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  /// ===== Pick Due Date & Time =====
  Future<void> _pickDueDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _selectedDueDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime(2100),
    );

    if (date == null) return;

    final time = await showTimePicker(
      context: context,
      initialTime: _selectedDueDate != null
          ? TimeOfDay.fromDateTime(_selectedDueDate!)
          : TimeOfDay.now(),
    );

    if (time == null) return;

    setState(() {
      _selectedDueDate = DateTime(date.year, date.month, date.day, time.hour, time.minute);
    });
  }

  @override
  Widget build(BuildContext context) {
    // ===== Build the entire form immediately =====
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
            _buildPriorityDropdown(),
            const SizedBox(height: 20),
            _buildLabel('Category'),

            // ===== Only category dropdown shows loading if needed =====
            _isTokenLoading || _categories.isEmpty
                ? const SizedBox(
              height: 44,
              child: Center(child: CircularProgressIndicator()),
            )
                : _buildCategoryDropdown(),

            const SizedBox(height: 20),
            _buildLabel('Due Date'),
            GestureDetector(
              onTap: _pickDueDate,
              child: Container(
                height: 44,
                padding: const EdgeInsets.symmetric(horizontal: 15),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                alignment: Alignment.centerLeft,
                child: Text(
                  _selectedDueDate != null
                      ? '${_selectedDueDate!.day}/${_selectedDueDate!.month}/${_selectedDueDate!.year} '
                      '${_selectedDueDate!.hour.toString().padLeft(2,'0')}:${_selectedDueDate!.minute.toString().padLeft(2,'0')}'
                      : 'Select due date & time',
                  style: const TextStyle(color: Colors.black87),
                ),
              ),
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

  // ===== UI Helpers =====
  Widget _buildLabel(String text) => Padding(
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

  Widget _buildTextField(TextEditingController controller, String hint, int maxLines) =>
      TextField(
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

  Widget _buildPriorityDropdown() => Container(
    padding: const EdgeInsets.symmetric(horizontal: 12),
    decoration: BoxDecoration(
      color: AppTheme.background,
      borderRadius: BorderRadius.circular(12),
    ),
    child: DropdownButtonHideUnderline(
      child: DropdownButton<String>(
        value: _selectedPriority,
        isExpanded: true,
        items: _priorities
            .map((p) => DropdownMenuItem(value: p, child: Text(p)))
            .toList(),
        onChanged: (val) => setState(() => _selectedPriority = val!),
      ),
    ),
  );

  Widget _buildCategoryDropdown() {
    if (_categories.isEmpty) {
      return const Text('No categories available', style: TextStyle(color: Colors.grey));
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200, width: 1),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedCategoryId,
          isExpanded: true,
          icon: const Icon(Icons.keyboard_arrow_down_rounded, color: Colors.grey),
          dropdownColor: Colors.white,
          borderRadius: BorderRadius.circular(16),
          items: [
            ..._categories.map((cat) => DropdownMenuItem<String>(
              value: cat.id,
              child: Row(
                children: [
                  Container(
                    width: 34,
                    height: 34,
                    decoration: BoxDecoration(
                      color: cat.backgroundColor,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: cat.backgroundColor.withOpacity(0.4),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Icon(cat.icon, color: Colors.white, size: 18),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      cat.name,
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            )),
            const DropdownMenuItem<String>(
              value: 'add_new',
              child: Row(
                children: [
                  Icon(Icons.add_circle_outline_rounded, color: Colors.blue),
                  SizedBox(width: 10),
                  Text('Add new category', style: TextStyle(fontWeight: FontWeight.w600, color: Colors.blue)),
                ],
              ),
            ),
          ],
          onChanged: (val) async {
            if (val == 'add_new') {
              final result = await Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const CreateCategory()),
              );
              if (result != null && result is CreateCategoryModel) {
                await _handleNewCategory(result);
              }
            } else {
              setState(() => _selectedCategoryId = val);
            }
          },
        ),
      ),
    );
  }
}
