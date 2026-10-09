import 'data/repositories/auth_repository_impl.dart';
import 'domain/usecases/is_logged_in_usecase.dart';
import 'domain/usecases/login_usecase.dart';
import 'domain/usecases/logout_usecase.dart';
import 'domain/usecases/register_usecase.dart';
import 'presentation/state/auth_view_model.dart';

class AuthInjection {
  const AuthInjection._();

  static AuthViewModel createViewModel() {
    final repository = AuthRepositoryImpl();
    return AuthViewModel(
      login: LoginUseCase(repository),
      register: RegisterUseCase(repository),
      logout: LogoutUseCase(repository),
      isLoggedIn: IsLoggedInUseCase(repository),
    );
  }
}
