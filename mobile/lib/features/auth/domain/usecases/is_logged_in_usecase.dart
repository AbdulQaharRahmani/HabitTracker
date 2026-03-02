import '../repositories/auth_repository.dart';

class IsLoggedInUseCase {
  final AuthRepository _repository;

  const IsLoggedInUseCase(this._repository);

  Future<bool> call() => _repository.isLoggedIn();
}
