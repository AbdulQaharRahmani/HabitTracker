import '../../../../core/network/api_response.dart';
import '../entities/auth_user.dart';
import '../repositories/auth_repository.dart';

class LoginUseCase {
  final AuthRepository _repository;

  const LoginUseCase(this._repository);

  Future<ApiResponse<AuthUser>> call({
    required String email,
    required String password,
  }) {
    return _repository.login(email: email, password: password);
  }
}
