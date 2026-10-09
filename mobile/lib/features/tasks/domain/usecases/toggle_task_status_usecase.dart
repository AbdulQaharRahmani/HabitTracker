import '../../../../core/network/api_response.dart';
import '../repositories/tasks_repository.dart';

class ToggleTaskStatusUseCase {
  final TasksRepository _repository;

  const ToggleTaskStatusUseCase(this._repository);

  Future<ApiResponse<void>> call({
    required String taskId,
    required String currentStatus,
  }) {
    return _repository.toggleTaskStatus(
      taskId: taskId,
      currentStatus: currentStatus,
    );
  }
}
