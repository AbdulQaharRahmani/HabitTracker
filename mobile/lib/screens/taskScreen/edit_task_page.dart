import 'package:flutter/material.dart';
import '../../app/app_theme.dart';
import '../../services/taskpage_api/category_api.dart';
import '../../services/taskpage_api/tasks_api.dart';
import '../../utils/taskpage_components/tasks_model.dart';
import '../../utils/category/category_model.dart';
import '../../services/token_storage.dart';

class EditTaskPage extends StatefulWidget {
  final Task task;

  const EditTaskPage({super.key, required this.task});

  @override
  State<EditTaskPage> createState() => _EditTaskPageState();
}

class _EditTaskPageState extends State<EditTaskPage> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _titleController;
  late TextEditingController _descriptionController;

  String _priority = 'medium';
  String? _categoryId;
  DateTime? _dueDate;

  final TaskApiService _taskApi = TaskApiService();
  final CategoryApiService _categoryApi = CategoryApiService();

  List<CategoryModel> _categories = [];
  bool _isSubmitting = false;

  final List<Map<String, dynamic>> _priorities = [
    {
      'value': 'low',
      'label': 'Low',
      'color': AppTheme.success,
      'icon': Icons.arrow_downward,
      'description': 'Not urgent',
    },
    {
      'value': 'medium',
      'label': 'Medium',
      'color': AppTheme.warning,
      'icon': Icons.remove,
      'description': 'Normal priority',
    },
    {
      'value': 'high',
      'label': 'High',
      'color': AppTheme.error,
      'icon': Icons.arrow_upward,
      'description': 'Urgent',
    },
  ];

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.task.title);
    _descriptionController = TextEditingController(text: widget.task.description);
    _priority = widget.task.priority.toLowerCase();
    _categoryId = widget.task.category?.id;
    _dueDate = widget.task.dueDate;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadCategoriesInBackground();
    });
  }

  Future<void> _loadCategoriesInBackground() async {
    try {
      final token = await AuthManager.getToken();
      if (token == null) return;

      final categories = await _categoryApi.fetchCategories(token: token);
      if (!mounted) return;

      setState(() {
        _categories = categories;
        if (_categoryId != null && !_categories.any((c) => c.id == _categoryId)) {
          _categoryId = _categories.isNotEmpty ? _categories.first.id : null;
        }
      });
    } catch (_) {}
  }

  Future<void> _pickDueDate() async {
    final pickedDate = await showDatePicker(
      context: context,
      initialDate: _dueDate ?? DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
    );

    if (pickedDate == null) return;

    final initialTime = _dueDate != null
        ? TimeOfDay(hour: _dueDate!.hour, minute: _dueDate!.minute)
        : TimeOfDay.now();

    final pickedTime = await showTimePicker(
      context: context,
      initialTime: initialTime,
    );

    if (pickedTime == null) return;

    setState(() {
      _dueDate = DateTime(
        pickedDate.year,
        pickedDate.month,
        pickedDate.day,
        pickedTime.hour,
        pickedTime.minute,
      );
    });
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _saveTask() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    final token = await AuthManager.getToken();
    if (token == null) {
      _showErrorSnackbar('Session expired. Please login again');
      setState(() => _isSubmitting = false);
      return;
    }

    try {
      final updatedFields = {
        'title': _titleController.text.trim(),
        'description': _descriptionController.text.trim(),
        'priority': _priority,
        if (_categoryId != null) 'categoryId': _categoryId,
        if (_dueDate != null) 'dueDate': _dueDate!.toIso8601String(),
      };

      final updatedTask = await _taskApi.updateTask(
        widget.task.id,
        updatedFields,
        token,
      );

      if (!mounted) return;

      _showSuccessSnackbar('Task updated successfully');
      await Future.delayed(const Duration(milliseconds: 700));

      Navigator.pop(context, updatedTask);
    } catch (_) {
      setState(() => _isSubmitting = false);
      _showErrorSnackbar('Failed to update task');
    }
  }

  Future<void> _deleteTask() async {
    setState(() => _isSubmitting = true);

    final token = await AuthManager.getToken();
    if (token == null) {
      _showErrorSnackbar('Session expired. Please login again');
      setState(() => _isSubmitting = false);
      return;
    }

    try {
      await _taskApi.deleteTask(widget.task.id, token);
      if (!mounted) return;

      _showSuccessSnackbar('Task deleted successfully');
      await Future.delayed(const Duration(milliseconds: 500));

      Navigator.pop(context, 'deleted');
    } catch (_) {
      setState(() => _isSubmitting = false);
      _showErrorSnackbar('Failed to delete task');
    }
  }

  Future<void> _confirmDeleteTask() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Confirm Delete', style: TextStyle(color: AppTheme.textPrimary)),
        content: Text(
          'Are you sure you want to delete this task? This action cannot be undone.',
          style: TextStyle(color: AppTheme.textSecondary),
        ),
        backgroundColor: AppTheme.surface,
        actions: [
          TextButton(
            style: ButtonStyle(
              backgroundColor: WidgetStatePropertyAll(AppTheme.primary),
            ),
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel', style: TextStyle(color: Colors.white)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.error),
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      _deleteTask();
    }
  }

  void _showErrorSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppTheme.error,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _showSuccessSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: AppTheme.success,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  String _dueDateText() {
    if (_dueDate == null) return 'Select due date & time';
    final d = _dueDate!;
    return '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}  •  '
        '${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final selectedPriority = _priorities.firstWhere((p) => p['value'] == _priority);

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppBar(
        title: const Text(
          'Edit Task',
          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 20, letterSpacing: -0.5),
        ),
        centerTitle: false,
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: AppTheme.textPrimary,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildPreviewCard(selectedPriority),
              const SizedBox(height: 30),

              _buildSectionTitle('Task Title', Icons.title),
              const SizedBox(height: 12),
              _buildTitleInput(),
              const SizedBox(height: 25),

              _buildSectionTitle('Description', Icons.description),
              const SizedBox(height: 12),
              _buildDescriptionInput(),
              const SizedBox(height: 25),

              _buildSectionTitle('Priority Level', Icons.flag),
              const SizedBox(height: 12),
              _buildPrioritySelector(),
              const SizedBox(height: 25),

              _buildSectionTitle('Category', Icons.category),
              const SizedBox(height: 12),
              _buildCategorySelector(),
              const SizedBox(height: 12),

              _buildSectionTitle('Due Date', Icons.calendar_today),
              const SizedBox(height: 12),
              _dueDatePicker(),
              const SizedBox(height: 25),

              _buildActionButtons(),
              const SizedBox(height: 20),

              _deleteTaskButton(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _deleteTaskButton() {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: OutlinedButton(
        onPressed: _isSubmitting ? null : _confirmDeleteTask,
        style: OutlinedButton.styleFrom(
          foregroundColor: AppTheme.error,
          side:  BorderSide(color: AppTheme.error),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.delete_outline, size: 20),
            SizedBox(width: 8),
            Text('Delete Task', style: TextStyle(fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppTheme.primary),
        const SizedBox(width: 8),
        Text(
          title,
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: AppTheme.textPrimary,
            letterSpacing: -0.3,
          ),
        ),
      ],
    );
  }

  Widget _buildPreviewCard(Map<String, dynamic> priority) {
    final selectedCategory = _categories.firstWhere(
          (c) => c.id == _categoryId,
      orElse: () => CategoryModel(
        id: '',
        name: 'No Category',
        iconName: 'category',
        backgroundColor: Colors.grey,
      ),
    );

    final priorityData = _priorities.firstWhere((p) => p['value'] == _priority);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadow,
            blurRadius: 20,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: selectedCategory.backgroundColor,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  selectedCategory.icon,
                  color: AppTheme.textWhite,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _titleController.text.isNotEmpty ? _titleController.text : 'Task Title',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textPrimary,
                        height: 1.2,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (_descriptionController.text.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.only(top: 4),
                        child: Text(
                          _descriptionController.text,
                          style: TextStyle(
                            fontSize: 14,
                            color: AppTheme.textSecondary,
                            height: 1.4,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: priorityData['color'].withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: priorityData['color'].withOpacity(0.3), width: 1),
                ),
                child: Row(
                  children: [
                    Icon(priorityData['icon'], size: 16, color: priorityData['color']),
                    const SizedBox(width: 6),
                    Text(
                      priorityData['label'],
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: priorityData['color'],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: selectedCategory.backgroundColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: selectedCategory.backgroundColor.withOpacity(0.3), width: 1),
                ),
                child: Row(
                  children: [
                    Icon(selectedCategory.icon, size: 14, color: selectedCategory.backgroundColor),
                    const SizedBox(width: 6),
                    Text(
                      selectedCategory.name,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: selectedCategory.backgroundColor,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTitleInput() {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadow,
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: TextFormField(
        controller: _titleController,
        onChanged: (_) => setState(() {}),
        style: TextStyle(fontSize: 16, color: AppTheme.textPrimary),
        decoration: InputDecoration(
          hintText: 'Enter task title',
          hintStyle: TextStyle(color: AppTheme.textMuted),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
          prefixIcon: Icon(Icons.task, color: AppTheme.textSecondary),
          suffixIcon: _titleController.text.isNotEmpty
              ? IconButton(
            icon: Icon(Icons.clear, color: AppTheme.textMuted, size: 20),
            onPressed: () {
              _titleController.clear();
              setState(() {});
            },
          )
              : null,
        ),
        validator: (value) {
          if (value == null || value.trim().isEmpty) return 'Please enter a task title';
          if (value.trim().length < 2) return 'Title must be at least 2 characters';
          return null;
        },
        maxLength: 100,
        maxLines: 2,
        minLines: 1,
      ),
    );
  }

  Widget _buildDescriptionInput() {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadow,
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: TextFormField(
        controller: _descriptionController,
        onChanged: (_) => setState(() {}),
        style: TextStyle(fontSize: 15, color: AppTheme.textPrimary),
        decoration: InputDecoration(
          hintText: 'Add description (optional)',
          hintStyle: TextStyle(color: AppTheme.textMuted),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.all(20),
          prefixIcon: Icon(Icons.notes, color: AppTheme.textSecondary),
          alignLabelWithHint: true,
        ),
        maxLength: 500,
        maxLines: 4,
        minLines: 3,
      ),
    );
  }

  Widget _buildPrioritySelector() {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadow,
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
        child: Column(
          children: _priorities.map((priority) {
            final isSelected = _priority == priority['value'];
            return GestureDetector(
              onTap: () => setState(() => _priority = priority['value']),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: isSelected ? priority['color'].withOpacity(0.1) : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isSelected ? priority['color'].withOpacity(0.3) : Colors.transparent,
                    width: 2,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isSelected ? priority['color'] : AppTheme.textMuted,
                        border: Border.all(
                          color: isSelected ? priority['color'] : AppTheme.border,
                          width: isSelected ? 8 : 2,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            priority['label'],
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: isSelected ? priority['color'] : AppTheme.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            priority['description'],
                            style: TextStyle(
                              fontSize: 13,
                              color: isSelected ? priority['color'].withOpacity(0.8) : AppTheme.textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (isSelected)
                      Icon(Icons.check_circle, color: priority['color'], size: 24),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildCategorySelector() {
    if (_categories.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          children: [
            Icon(Icons.category_outlined, size: 40, color: AppTheme.textMuted),
            const SizedBox(height: 12),
            Text(
              'No categories available',
              style: TextStyle(color: AppTheme.textMuted),
            ),
            const SizedBox(height: 8),
            Text(
              'Create categories first',
              style: TextStyle(color: AppTheme.textMuted, fontSize: 13),
            ),
          ],
        ),
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadow,
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: DropdownButtonFormField<String>(
        value: _categoryId,
        decoration:  InputDecoration(
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          prefixIcon: Icon(Icons.category, color: AppTheme.textSecondary),
        ),
        items: _categories.map((category) {
          return DropdownMenuItem<String>(
            value: category.id,
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.only(left: 10, right: 10, bottom: 6, top: 3),
                  decoration: BoxDecoration(
                    color: category.backgroundColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    category.icon,
                    color: category.backgroundColor,
                    size: 18,
                  ),
                ),
                const SizedBox(width: 12),
                Text(category.name, style: TextStyle(fontSize: 15, color: AppTheme.textPrimary)),
              ],
            ),
          );
        }).toList(),
        onChanged: (value) => setState(() => _categoryId = value),
        validator: (value) => value == null || value.isEmpty ? 'Please select a category' : null,
        dropdownColor: AppTheme.surface,
        borderRadius: BorderRadius.circular(12),
        icon: Icon(Icons.arrow_drop_down, color: AppTheme.textSecondary),
        style: TextStyle(color: AppTheme.textPrimary),
      ),
    );
  }

  Widget _buildActionButtons() {
    final isFormValid = _titleController.text.trim().isNotEmpty && _priority.isNotEmpty && _categoryId != null;

    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton(
            onPressed: isFormValid && !_isSubmitting ? _saveTask : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: isFormValid ? AppTheme.primary : AppTheme.textMuted,
              foregroundColor: AppTheme.textWhite,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
              elevation: 0,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (_isSubmitting)
                  const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                else
                  const Icon(Icons.check_circle_outline, size: 22),
                const SizedBox(width: 10),
                Text(_isSubmitting ? 'Saving...' : 'Save Changes', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          height: 50,
          child: OutlinedButton(
            onPressed: _isSubmitting ? null : () => Navigator.pop(context),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppTheme.primary,
              side: BorderSide(color: AppTheme.border),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.close, size: 20),
                SizedBox(width: 8),
                Text('Cancel', style: TextStyle(fontWeight: FontWeight.w500)),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _dueDatePicker() {
    return GestureDetector(
      onTap: _pickDueDate,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        decoration: BoxDecoration(
          color: AppTheme.surface,
          borderRadius: BorderRadius.circular(15),
          boxShadow: [
            BoxShadow(
              color: AppTheme.shadow,
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            Icon(Icons.event, color: AppTheme.textSecondary),
            const SizedBox(width: 12),
            Text(
              _dueDateText(),
              style: TextStyle(
                fontSize: 15,
                color: _dueDate == null ? AppTheme.textMuted : AppTheme.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}