import '../../../../core/network/api_response.dart';
import '../../../../utils/taskpage_components/tasks_model.dart';
import '../repositories/tasks_repository.dart';

class FetchTasksUseCase {
  final TasksRepository _repository;

  const FetchTasksUseCase(this._repository);

  Future<ApiResponse<List<Task>>> call({
    required int page,
    required int limit,
    String? searchTerm,
    String? categoryId,
  }) {
    return _repository.fetchTasks(
      page: page,
      limit: limit,
      searchTerm: searchTerm,
      categoryId: categoryId,
    );
  }
}
