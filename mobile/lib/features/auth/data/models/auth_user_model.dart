import '../../domain/entities/auth_user.dart';

class AuthUserModel extends AuthUser {
  const AuthUserModel({required super.name, required super.email});

  factory AuthUserModel.fromApi(Map<String, dynamic> json) {
    final data = (json['data'] as Map<String, dynamic>?) ?? <String, dynamic>{};
    final name = (data['username'] ?? data['name'] ?? '').toString();
    final email = (data['email'] ?? '').toString();
    return AuthUserModel(name: name, email: email);
  }
}
