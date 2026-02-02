import 'package:flutter/material.dart';
import '../../app/app_theme.dart';
import '../../services/taskpage_api/category_api.dart';
import '../../services/taskpage_api/tasks_api.dart';
import '../../utils/taskpage_components/tasks_model.dart';
import '../../utils/category/category_model.dart';
import '../../utils/taskpage_components/token_storage.dart';

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
  bool _loadingCategories = true;
  bool _isSubmitting = false;

  // Priority data
  final List<Map<String, dynamic>> _priorities = [
    {
      'value': 'low',
      'label': 'Low',
      'color': Colors.green,
      'icon': Icons.arrow_downward,
      'description': 'Not urgent',
    },
    {
      'value': 'medium',
      'label': 'Medium',
      'color': Colors.orange,
      'icon': Icons.remove,
      'description': 'Normal priority',
    },
    {
      'value': 'high',
      'label': 'High',
      'color': Colors.red,
      'icon': Icons.arrow_upward,
      'description': 'Urgent',
    },
  ];

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.task.title);
    _descriptionController = TextEditingController(
      text: widget.task.description,
    );
    _priority = widget.task.priority.toLowerCase();
    _categoryId = widget.task.category?.id;
    _dueDate = widget.task.dueDate;

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadCategories();
    });
  }

  Future<void> _loadCategories() async {
    try {
      final token = await TokenStorage.getToken();
      if (token == null) throw Exception('Token not found');

      final categories = await _categoryApi.fetchCategories(token: token);

      if (!mounted) return;
      setState(() {
        _categories = categories;
        _loadingCategories = false;

        if (_categoryId == null && _categories.isNotEmpty) {
          _categoryId = _categories[0].id;
        } else if (_categoryId != null &&
            !_categories.any((c) => c.id == _categoryId)) {
          _categoryId = _categories.isNotEmpty ? _categories[0].id : null;
        }
      });
    } catch (e) {
      setState(() {
        _loadingCategories = false;
      });
      _showErrorSnackbar('Failed to load categories');
    }
  }

  String _formatDate(DateTime date) {
    return '${date.year.toString().padLeft(4, '0')}-'
        '${date.month.toString().padLeft(2, '0')}-'
        '${date.day.toString().padLeft(2, '0')}';
  }

  Future<void> _pickDueDate() async {
    // 1) pick date
    final pickedDate = await showDatePicker(
      context: context,
      initialDate: _dueDate ?? DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2100),
    );

    if (pickedDate == null) return;

    // 2) pick time (keep backend time if exists)
    final initialTime = _dueDate != null
        ? TimeOfDay(hour: _dueDate!.hour, minute: _dueDate!.minute)
        : TimeOfDay.now();

    final pickedTime = await showTimePicker(
      context: context,
      initialTime: initialTime,
    );

    if (pickedTime == null) return;

    // 3) combine date + time
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

    final token = await TokenStorage.getToken();
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

      _showSuccessSnackbar('Task updated successfully!');

      await Future.delayed(const Duration(milliseconds: 800));

      if (!mounted) return;
      Navigator.pop(context, updatedTask);
    } catch (e, stackTrace) {
      setState(() => _isSubmitting = false);
      debugPrint('StackTrace: $stackTrace');
      _showErrorSnackbar('Failed to update task. Please try again.');
    }
  }

  void _showErrorSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.error_outline, color: Colors.white, size: 20),
            const SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _showSuccessSnackbar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white, size: 20),
            const SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  Future<void> _deleteTask() async {
    setState(() => _isSubmitting = true);

    final token = await TokenStorage.getToken();
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
    } catch (e) {
      setState(() => _isSubmitting = false);
      _showErrorSnackbar('Failed to delete task');
    }
  }

  /// ===========================
  /// AlertDialog for deleting
  /// ===========================
  Future<void> _confirmDeleteTask() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Delete'),
        content: const Text(
          'Are you sure you want to delete this task? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            style: ButtonStyle(
              backgroundColor: WidgetStatePropertyAll(AppTheme.primary),
            ),
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel', style: TextStyle(color: Colors.white)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary),
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

  /// ===========================
  /// Due Date Text Formatter
  /// ===========================
  String _dueDateText() {
    if (_dueDate == null) return 'Select due date & time';

    final d = _dueDate!;

    final date =
        '${d.year.toString().padLeft(4, '0')}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';

    final time =
        '${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';

    return '$date  •  $time';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final selectedPriority = _priorities.firstWhere(
      (p) => p['value'] == _priority,
    );

    return Scaffold(
      backgroundColor: isDark ? Colors.grey[900] : Colors.grey[50],
      appBar: AppBar(
        title: const Text(
          'Edit Task',
          style: TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 20,
            letterSpacing: -0.5,
          ),
        ),
        centerTitle: false,
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: isDark ? Colors.white : Colors.black,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          if (_isSubmitting)
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: isDark ? Colors.white : Colors.blue,
                ),
              ),
            ),
        ],
      ),
      body: _loadingCategories
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text(
                    'Loading categories...',
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            )
          : Form(
              key: _formKey,
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    /// ===== Preview Card =====
                    _buildPreviewCard(context, selectedPriority),
                    const SizedBox(height: 30),

                    /// ===== Title Section =====
                    _buildSectionTitle('Task Title', Icons.title),
                    const SizedBox(height: 12),
                    _buildTitleInput(),
                    const SizedBox(height: 25),

                    /// ===== Description Section =====
                    _buildSectionTitle('Description', Icons.description),
                    const SizedBox(height: 12),
                    _buildDescriptionInput(),
                    const SizedBox(height: 25),

                    /// ===== Priority Section =====
                    _buildSectionTitle('Priority Level', Icons.flag),
                    const SizedBox(height: 12),
                    _buildPrioritySelector(),
                    const SizedBox(height: 25),

                    /// ===== Category Section =====
                    _buildSectionTitle('Category', Icons.category),
                    const SizedBox(height: 12),
                    _buildCategorySelector(),
                    const SizedBox(height: 12),

                    /// ===== Due Date Section =====
                    _buildSectionTitle('Due Date', Icons.calendar_today),
                    const SizedBox(height: 12),
                    _dueDatePicker(),
                    const SizedBox(height: 25),

                    /// ===== Action Buttons =====
                    _buildActionButtons(),
                    const SizedBox(height: 20),

                    //   delete button for deleting
                    _deleteTaskButton(),

                    // Due date logical hook (no UI change required)
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
          foregroundColor: AppTheme.primary,
          side: const BorderSide(color: Colors.grey),
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
        Icon(icon, size: 18, color: Colors.blueAccent),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: Colors.black87,
            letterSpacing: -0.3,
          ),
        ),
      ],
    );
  }

  Widget _buildPreviewCard(
    BuildContext context,
    Map<String, dynamic> priority,
  ) {
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
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
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
                  color: Colors.white,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _titleController.text.isNotEmpty
                          ? _titleController.text
                          : 'Task Title',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: Colors.black87,
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
                          style: const TextStyle(
                            fontSize: 14,
                            color: Colors.grey,
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
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: priorityData['color'].withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: priorityData['color'].withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      priorityData['icon'],
                      size: 16,
                      color: priorityData['color'],
                    ),
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
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: selectedCategory.backgroundColor.withValues(
                    alpha: 0.1,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: selectedCategory.backgroundColor.withValues(
                      alpha: 0.3,
                    ),
                    width: 1,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      selectedCategory.icon,
                      size: 14,
                      color: selectedCategory.backgroundColor,
                    ),
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
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: TextFormField(
        controller: _titleController,
        onChanged: (_) => setState(() {}),
        style: const TextStyle(fontSize: 16),
        decoration: InputDecoration(
          hintText: 'Enter task title',
          hintStyle: const TextStyle(color: Colors.grey),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 18,
          ),
          prefixIcon: const Icon(Icons.task, color: Colors.blueGrey),
          suffixIcon: _titleController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear, color: Colors.grey, size: 20),
                  onPressed: () {
                    _titleController.clear();
                    setState(() {});
                  },
                )
              : null,
        ),
        validator: (value) {
          if (value == null || value.trim().isEmpty) {
            return 'Please enter a task title';
          }
          if (value.trim().length < 2) {
            return 'Title must be at least 2 characters';
          }
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
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: TextFormField(
        controller: _descriptionController,
        onChanged: (_) => setState(() {}),
        style: const TextStyle(fontSize: 15),
        decoration: InputDecoration(
          hintText: 'Add description (optional)',
          hintStyle: const TextStyle(color: Colors.grey),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.all(20),
          prefixIcon: const Icon(Icons.notes, color: Colors.blueGrey),
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
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
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
              onTap: () {
                setState(() {
                  _priority = priority['value'];
                });
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 14,
                ),
                decoration: BoxDecoration(
                  color: isSelected
                      ? priority['color'].withOpacity(0.1)
                      : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isSelected
                        ? priority['color'].withOpacity(0.3)
                        : Colors.transparent,
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
                        color: isSelected
                            ? priority['color']
                            : Colors.grey[300],
                        border: Border.all(
                          color: isSelected
                              ? priority['color']
                              : Colors.grey[400]!,
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
                              color: isSelected
                                  ? priority['color']
                                  : Colors.black87,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            priority['description'],
                            style: TextStyle(
                              fontSize: 13,
                              color: isSelected
                                  ? priority['color'].withOpacity(0.8)
                                  : Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (isSelected)
                      Icon(
                        Icons.check_circle,
                        color: priority['color'],
                        size: 24,
                      ),
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
          color: Colors.red,
          borderRadius: BorderRadius.circular(20),
        ),
        child: const Column(
          children: [
            Icon(Icons.category_outlined, size: 40, color: Colors.grey),
            SizedBox(height: 12),
            Text(
              'No categories available',
              style: TextStyle(color: Colors.grey),
            ),
            SizedBox(height: 8),
            Text(
              'Create categories first',
              style: TextStyle(color: Colors.grey, fontSize: 13),
            ),
          ],
        ),
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: DropdownButtonFormField<String>(
        initialValue: _categoryId,
        decoration: const InputDecoration(
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          prefixIcon: Icon(Icons.category, color: Colors.blueGrey),
        ),
        items: _categories.map((category) {
          return DropdownMenuItem<String>(
            value: category.id,
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.only(
                    left: 10,
                    right: 10,
                    bottom: 6,
                    top: 3,
                  ),
                  decoration: BoxDecoration(
                    color: category.backgroundColor.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    category.icon,
                    color: category.backgroundColor,
                    size: 18,
                  ),
                ),
                const SizedBox(width: 12),
                Text(category.name, style: const TextStyle(fontSize: 15)),
              ],
            ),
          );
        }).toList(),
        onChanged: (value) {
          setState(() {
            _categoryId = value;
          });
        },
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please select a category';
          }
          return null;
        },
        dropdownColor: Colors.white,
        borderRadius: BorderRadius.circular(12),
        icon: const Icon(Icons.arrow_drop_down, color: Colors.grey),
        style: const TextStyle(color: Colors.black87),
      ),
    );
  }

  Widget _buildActionButtons() {
    final isFormValid =
        _titleController.text.trim().isNotEmpty &&
        _priority.isNotEmpty &&
        _categoryId != null;

    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton(
            onPressed: isFormValid && !_isSubmitting ? _saveTask : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: isFormValid ? Colors.grey[50] : Colors.grey[400],
              foregroundColor: AppTheme.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
                side: BorderSide(color: Colors.grey),
              ),
              elevation: 0,
              shadowColor: Colors.transparent,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (_isSubmitting)
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Colors.white,
                    ),
                  )
                else
                  const Icon(Icons.check_circle_outline, size: 22),
                const SizedBox(width: 10),
                Text(
                  _isSubmitting ? 'Saving...' : 'Save Changes',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    letterSpacing: -0.3,
                  ),
                ),
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
              foregroundColor: Colors.grey[700],
              side: BorderSide(color: Colors.grey[400]!),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.close, size: 20, color: AppTheme.primary),
                SizedBox(width: 8),
                Text(
                  'Cancel',
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    color: AppTheme.primary,
                  ),
                ),
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
          color: Colors.white,
          borderRadius: BorderRadius.circular(15),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            const Icon(Icons.event, color: Colors.blueGrey),
            const SizedBox(width: 12),
            Text(
              _dueDateText(),
              style: TextStyle(
                fontSize: 15,
                color: _dueDate == null ? Colors.grey : Colors.black87,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
