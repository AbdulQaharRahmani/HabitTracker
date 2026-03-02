class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? message;
  final String? code;

  const ApiResponse({
    required this.success,
    this.data,
    this.message,
    this.code,
  });

  factory ApiResponse.success(T data, {String? message}) {
    return ApiResponse<T>(success: true, data: data, message: message);
  }

  factory ApiResponse.failure({String? message, String? code}) {
    return ApiResponse<T>(success: false, message: message, code: code);
  }
}
