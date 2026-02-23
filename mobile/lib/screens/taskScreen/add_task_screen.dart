import 'package:flutter/material.dart';
import '../../app/app_theme.dart';
import '../../services/taskpage_api/category_api.dart';
import '../../services/taskpage_api/tasks_api.dart';
import '../../utils/category/category_model.dart';
import '../../services/token_storage.dart';
import '../categoryScreen/create_category.dart';

class NewTaskPage extends StatefulWidget {
  final String? defaultCategoryId;
  const NewTaskPage({super.key, this.defaultCategoryId});

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
  bool _isTokenLoading = true;
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
    _selectedCategoryId = widget.defaultCategoryId;
    _loadTokenAndCategories();
  }

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
        _selectedCategoryId = widget.defaultCategoryId ?? (_categories.isNotEmpty ? _categories.first.id : null);
        _isTokenLoading = false;
      });
    } catch (e) {
      setState(() => _isTokenLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error fetching categories: $e'),
          backgroundColor: AppTheme.error,
        ),
      );
    }
  }

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
        dueDate: _selectedDueDate,
      );

      if (!mounted) return;

      if (res['success'] == true) {
        Navigator.pop(context, res['data']);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(res['error'] ?? 'Failed to create task'),
            backgroundColor: AppTheme.error,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error creating task: $e'),
          backgroundColor: AppTheme.error,
        ),
      );
    } finally {
      if (!mounted) return;
      setState(() => _isLoading = false);
    }
  }

  Future<void> _handleNewCategory(CreateCategoryModel model) async {
    try {
      setState(() => _isLoading = true);

      final CategoryModel newCategory = await _categoryApi.createCategory(model);

      setState(() {
        _categories.add(newCategory);
        _selectedCategoryId = newCategory.id;
      });

      ScaffoldMessenger.of(context).showSnackBar(
       SnackBar(
          content: Text('Category created successfully!'),
          backgroundColor: AppTheme.success,
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error creating category: $e'),
          backgroundColor: AppTheme.error,
        ),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

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
    return Scaffold(
      backgroundColor: AppTheme.surface,
      appBar: AppBar(
        backgroundColor: AppTheme.surface,
        elevation: 0,
        centerTitle: true,
        title: Text(
          'Create New Task',
          style: TextStyle(color: AppTheme.textPrimary, fontWeight: FontWeight.bold),
        ),
        iconTheme: IconThemeData(color: AppTheme.textPrimary),
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
                  color: AppTheme.inputBackground,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.border),
                ),
                alignment: Alignment.centerLeft,
                child: Text(
                  _selectedDueDate != null
                      ? '${_selectedDueDate!.year}-${_selectedDueDate!.month.toString().padLeft(2,'0')}-${_selectedDueDate!.day.toString().padLeft(2,'0')} '
                      '${_selectedDueDate!.hour.toString().padLeft(2,'0')}:${_selectedDueDate!.minute.toString().padLeft(2,'0')}'
                      : 'Select due date & time',
                  style: TextStyle(color: AppTheme.textPrimary),
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
                    : Text(
                  'Create Task',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.textWhite,
                  ),
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
      style: TextStyle(
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
          hintStyle: TextStyle(color: AppTheme.textMuted),
          filled: true,
          fillColor: AppTheme.inputBackground,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
        ),
        style: TextStyle(color: AppTheme.textPrimary),
      );

  Widget _buildPriorityDropdown() => Container(
    padding: const EdgeInsets.symmetric(horizontal: 12),
    decoration: BoxDecoration(
      color: AppTheme.inputBackground,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: AppTheme.border),
    ),
    child: DropdownButtonHideUnderline(
      child: DropdownButton<String>(
        value: _selectedPriority,
        isExpanded: true,
        items: _priorities
            .map((p) => DropdownMenuItem(value: p, child: Text(p, style: TextStyle(color: AppTheme.textPrimary))))
            .toList(),
        onChanged: (val) => setState(() => _selectedPriority = val!),
        dropdownColor: AppTheme.surface,
        icon: Icon(Icons.arrow_drop_down, color: AppTheme.textSecondary),
      ),
    ),
  );

  Widget _buildCategoryDropdown() {
    if (_categories.isEmpty) {
      return Text('No categories available', style: TextStyle(color: AppTheme.textMuted));
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        color: AppTheme.inputBackground,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.border, width: 1),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedCategoryId,
          isExpanded: true,
          icon: Icon(Icons.keyboard_arrow_down_rounded, color: AppTheme.textSecondary),
          dropdownColor: AppTheme.surface,
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
                    child: Icon(cat.icon, color: AppTheme.textWhite, size: 18),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      cat.name,
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: AppTheme.textPrimary),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            )),
             DropdownMenuItem<String>(
              value: 'add_new',
              child: Row(
                children: [
                  Icon(Icons.add_circle_outline_rounded, color: AppTheme.primary),
                  SizedBox(width: 10),
                  Text('Add new category', style: TextStyle(fontWeight: FontWeight.w600, color: AppTheme.primary)),
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