import '../../../../core/network/api_response.dart';
import '../../../../utils/category/category_model.dart';
import '../../../../utils/taskpage_components/tasks_model.dart';

abstract class TasksRepository {
  Future<ApiResponse<List<Task>>> fetchTasks({
    required int page,
    required int limit,
    String? searchTerm,
    String? categoryId,
  });

  Future<ApiResponse<List<CategoryModel>>> fetchCategories();

  Future<ApiResponse<void>> toggleTaskStatus({
    required String taskId,
    required String currentStatus,
  });
}
