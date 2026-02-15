import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../services/token_storage.dart';
import 'package:dio/dio.dart';
final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: "https://habit-tracker-17sr.onrender.com",
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {
        'Content-Type': 'application/json',
      },
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await AuthManager.getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        return handler.next(error);
      },
    ),
  );

  return dio;
});
