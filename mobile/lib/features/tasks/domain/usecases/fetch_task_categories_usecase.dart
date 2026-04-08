import '../../../../core/network/api_response.dart';
import '../../../../utils/category/category_model.dart';
import '../repositories/tasks_repository.dart';

class FetchTaskCategoriesUseCase {
  final TasksRepository _repository;

  const FetchTaskCategoriesUseCase(this._repository);

  Future<ApiResponse<List<CategoryModel>>> call() => _repository.fetchCategories();
}
