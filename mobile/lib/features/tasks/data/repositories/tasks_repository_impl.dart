import '../../../../core/network/api_response.dart';
import '../../../../services/taskpage_api/category_api.dart';
import '../../../../services/taskpage_api/tasks_api.dart';
import '../../../../services/token_storage.dart';
import '../../../../utils/category/category_model.dart';
import '../../../../utils/taskpage_components/tasks_model.dart';
import '../../domain/repositories/tasks_repository.dart';

class TasksRepositoryImpl implements TasksRepository {
  final TaskApiService _taskApi;
  final CategoryApiService _categoryApi;

  TasksRepositoryImpl({
    TaskApiService? taskApi,
    CategoryApiService? categoryApi,
  })  : _taskApi = taskApi ?? TaskApiService(),
        _categoryApi = categoryApi ?? CategoryApiService();

  @override
  Future<ApiResponse<List<Task>>> fetchTasks({
    required int page,
    required int limit,
    String? searchTerm,
    String? categoryId,
  }) async {
    final token = await AuthManager.getToken();
    if (token == null) {
      return ApiResponse<List<Task>>.failure(message: 'Session expired');
    }

    try {
      final tasks = await _taskApi.fetchTasks(
        token: token,
        page: page,
        limit: limit,
        searchTerm: searchTerm,
        categoryId: categoryId,
      );
      return ApiResponse<List<Task>>.success(tasks);
    } catch (e) {
      return ApiResponse<List<Task>>.failure(message: 'Failed to load tasks: $e');
    }
  }

  @override
  Future<ApiResponse<List<CategoryModel>>> fetchCategories() async {
    try {
      final categories = await _categoryApi.fetchCategories();
      return ApiResponse<List<CategoryModel>>.success(categories);
    } catch (e) {
      return ApiResponse<List<CategoryModel>>.failure(
        message: 'Failed to load categories: $e',
      );
    }
  }

  @override
  Future<ApiResponse<void>> toggleTaskStatus({
    required String taskId,
    required String currentStatus,
  }) async {
    final token = await AuthManager.getToken();
    if (token == null) {
      return ApiResponse<void>.failure(message: 'Session expired');
    }

    try {
      await _taskApi.toggleTaskStatus(
        taskId: taskId,
        currentStatus: currentStatus,
        token: token,
      );
      return const ApiResponse<void>(success: true);
    } catch (e) {
      return ApiResponse<void>.failure(message: 'Failed to update task: $e');
    }
  }
}
