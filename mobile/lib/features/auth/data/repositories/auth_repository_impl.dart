import '../../../../core/network/api_response.dart';
import '../../../../services/token_storage.dart';
import '../../domain/entities/auth_user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasource/auth_remote_data_source.dart';
import '../models/auth_user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remote;

  AuthRepositoryImpl({AuthRemoteDataSource? remote})
      : _remote = remote ?? AuthRemoteDataSource();

  @override
  Future<ApiResponse<AuthUser>> login({
    required String email,
    required String password,
  }) async {
    final result = await _remote.login(email: email, password: password);
    if (result['success'] == true) {
      return ApiResponse<AuthUser>.success(AuthUserModel.fromApi(result));
    }
    return ApiResponse<AuthUser>.failure(
      message: (result['message'] ?? 'Login failed').toString(),
    );
  }

  @override
  Future<ApiResponse<void>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    final result = await _remote.register(
      name: name,
      email: email,
      password: password,
    );
    if (result['success'] == true) {
      return const ApiResponse<void>(success: true);
    }
    return ApiResponse<void>.failure(
      message: (result['message'] ?? 'Registration failed').toString(),
    );
  }

  @override
  Future<void> logout() => AuthManager.logout();

  @override
  Future<bool> isLoggedIn() => AuthManager.isUserLoggedIn();
}
