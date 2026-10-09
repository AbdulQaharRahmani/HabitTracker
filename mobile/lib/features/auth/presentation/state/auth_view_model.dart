import 'package:flutter/material.dart';

import '../../../../core/network/api_response.dart';
import '../../domain/entities/auth_user.dart';
import '../../domain/usecases/is_logged_in_usecase.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/logout_usecase.dart';
import '../../domain/usecases/register_usecase.dart';

class AuthViewModel extends ChangeNotifier {
  final LoginUseCase _login;
  final RegisterUseCase _register;
  final LogoutUseCase _logout;
  final IsLoggedInUseCase _isLoggedIn;

  AuthViewModel({
    required LoginUseCase login,
    required RegisterUseCase register,
    required LogoutUseCase logout,
    required IsLoggedInUseCase isLoggedIn,
  })  : _login = login,
        _register = register,
        _logout = logout,
        _isLoggedIn = isLoggedIn;

  bool _loading = false;
  String? _error;

  bool get loading => _loading;
  String? get error => _error;

  Future<ApiResponse<AuthUser>> login({
    required String email,
    required String password,
  }) async {
    _setLoading(true);
    _error = null;

    final result = await _login(email: email, password: password);
    if (!result.success) {
      _error = result.message;
    }

    _setLoading(false);
    return result;
  }

  Future<ApiResponse<void>> register({
    required String name,
    required String email,
    required String password,
  }) async {
    _setLoading(true);
    _error = null;

    final result = await _register(name: name, email: email, password: password);
    if (!result.success) {
      _error = result.message;
    }

    _setLoading(false);
    return result;
  }

  Future<void> logout() => _logout();
  Future<bool> isLoggedIn() => _isLoggedIn();

  void _setLoading(bool value) {
    _loading = value;
    notifyListeners();
  }
}
