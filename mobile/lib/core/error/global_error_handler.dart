import 'package:flutter/foundation.dart';

class GlobalErrorHandler {
  const GlobalErrorHandler._();

  static void initialize() {
    FlutterError.onError = (FlutterErrorDetails details) {
      FlutterError.presentError(details);
      debugPrint('FlutterError: ${details.exceptionAsString()}');
    };

    PlatformDispatcher.instance.onError = (Object error, StackTrace stack) {
      debugPrint('PlatformError: $error');
      debugPrintStack(stackTrace: stack);
      return true;
    };
  }
}
