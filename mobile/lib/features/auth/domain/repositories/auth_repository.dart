import '../../../../core/network/api_response.dart';
import '../entities/auth_user.dart';

abstract class AuthRepository {
  Future<ApiResponse<AuthUser>> login({
    required String email,
    required String password,
  });

  Future<ApiResponse<void>> register({
    required String name,
    required String email,
    required String password,
  });

  Future<void> logout();
  Future<bool> isLoggedIn();
}
