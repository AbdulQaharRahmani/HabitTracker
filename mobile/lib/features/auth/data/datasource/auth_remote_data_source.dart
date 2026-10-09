import '../../../../services/auth_service.dart';

class AuthRemoteDataSource {
  final AuthService _service;

  AuthRemoteDataSource({AuthService? service}) : _service = service ?? AuthService();

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) {
    return _service.login(email: email, password: password);
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
  }) {
    return _service.register(name: name, email: email, password: password);
  }
}
