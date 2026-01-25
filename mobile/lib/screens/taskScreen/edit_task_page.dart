import 'package:flutter/material.dart';
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
  String? _priority;
  String? _categoryId;

  final TaskApiService _taskApi = TaskApiService();
  final CategoryApiService _categoryApi = CategoryApiService();

  List<CategoryModel> _categories = [];
  bool _loadingCategories = true;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.task.title);
    _descriptionController =
        TextEditingController(text: widget.task.description);
    _priority = widget.task.priority;
    _categoryId = widget.task.category?.id;

    _loadCategories();
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

        if (!_categories.any((c) => c.id == _categoryId)) {
          _categoryId = _categories.isNotEmpty ? _categories[0].id : null;
        }
      });
    } catch (e) {
      setState(() {
        _loadingCategories = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load categories: $e')),
      );
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _saveTask() async {
    if (!_formKey.currentState!.validate()) return;

    final token = await TokenStorage.getToken();
    if (token == null) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Token not found')));
      return;
    }

    try {
      final updatedFields = {
        'title': _titleController.text,
        'description': _descriptionController.text,
        'priority': _priority,
        'categoryId': _categoryId,
      };

      await _taskApi.updateTask(widget.task.id, updatedFields, token);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Task updated successfully!'),
          backgroundColor: Colors.green,
        ),
      );

      Navigator.pop(context, true);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update task: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F6FA),
      appBar: AppBar(
        title: const Text('Edit Task'),
        backgroundColor: Colors.blue,
      ),
      body: _loadingCategories
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              // ===== Title =====
              Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 8),
                  child: TextFormField(
                    controller: _titleController,
                    decoration: const InputDecoration(
                      labelText: 'Title',
                      border: InputBorder.none,
                    ),
                    validator: (val) => val == null || val.isEmpty
                        ? 'Title is required'
                        : null,
                  ),
                ),
              ),
              const SizedBox(height: 15),

              // ===== Description =====
              Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 8),
                  child: TextFormField(
                    controller: _descriptionController,
                    decoration: const InputDecoration(
                      labelText: 'Description',
                      border: InputBorder.none,
                    ),
                    maxLines: 4,
                  ),
                ),
              ),
              const SizedBox(height: 15),

              // ===== Priority =====
              Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: DropdownButtonFormField<String>(
                    initialValue: _priority,
                    decoration: const InputDecoration(
                      labelText: 'Priority',
                      border: InputBorder.none,
                    ),
                    items: ['low', 'medium', 'high']
                        .map(
                          (p) => DropdownMenuItem(
                        value: p,
                        child: Text(p.toUpperCase()),
                      ),
                    )
                        .toList(),
                    onChanged: (val) => setState(() => _priority = val),
                    validator: (val) =>
                    val == null ? 'Please select a priority' : null,
                  ),
                ),
              ),
              const SizedBox(height: 15),

              // ===== Category =====
              Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                ),
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: DropdownButtonFormField<String>(
                    initialValue: _categoryId,
                    decoration: const InputDecoration(
                      labelText: 'Category',
                      border: InputBorder.none,
                    ),
                    items: _categories
                        .map(
                          (c) => DropdownMenuItem(
                        value: c.id,
                        child: Text(c.name),
                      ),
                    )
                        .toList(),
                    onChanged: (val) => setState(() => _categoryId = val),
                    validator: (val) =>
                    val == null ? 'Please select a category' : null,
                  ),
                ),
              ),
              const SizedBox(height: 30),

              // ===== Save Button =====
              SizedBox(
                height: 50,
                child: ElevatedButton(
                  onPressed: _saveTask,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15),
                    ),
                    elevation: 2,
                  ),
                  child: const Text(
                    'Save Changes',
                    style: TextStyle(
                        fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
