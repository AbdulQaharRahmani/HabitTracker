import 'dart:io';

import 'app_exception.dart';
import 'app_failure.dart';

class ErrorMapper {
  const ErrorMapper._();

  static AppFailure toFailure(Object error) {
    if (error is AppException) {
      return AppFailure(error.message, code: error.code);
    }

    if (error is SocketException) {
      return const AppFailure('No internet connection', code: 'network_unavailable');
    }

    return AppFailure(error.toString(), code: 'unknown_error');
  }
}
