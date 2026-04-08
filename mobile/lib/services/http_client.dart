import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import 'token_storage.dart';

/// Centralized HTTP client with automatic token refresh.
class AuthenticatedHttpClient {
  static const String baseUrl = 'https://habit-tracker-17sr.onrender.com/api';

  // Prevent multiple simultaneous refresh calls.
  static Future<bool>? _refreshingTask;

  static Future<http.Response> get(
    String endpoint, {
    Map<String, String>? headers,
  }) async {
    return _makeRequest(
      () async => _sendWithAuth(
        method: 'GET',
        endpoint: endpoint,
        headers: headers,
      ),
    );
  }

  static Future<http.Response> post(
    String endpoint, {
    Map<String, String>? headers,
    Object? body,
  }) async {
    return _makeRequest(
      () async => _sendWithAuth(
        method: 'POST',
        endpoint: endpoint,
        headers: headers,
        body: body,
      ),
    );
  }

  static Future<http.Response> put(
    String endpoint, {
    Map<String, String>? headers,
    Object? body,
  }) async {
    return _makeRequest(
      () async => _sendWithAuth(
        method: 'PUT',
        endpoint: endpoint,
        headers: headers,
        body: body,
      ),
    );
  }

  static Future<http.Response> patch(
    String endpoint, {
    Map<String, String>? headers,
    Object? body,
  }) async {
    return _makeRequest(
      () async => _sendWithAuth(
        method: 'PATCH',
        endpoint: endpoint,
        headers: headers,
        body: body,
      ),
    );
  }

  static Future<http.Response> delete(
    String endpoint, {
    Map<String, String>? headers,
    Object? body,
  }) async {
    return _makeRequest(
      () async => _sendWithAuth(
        method: 'DELETE',
        endpoint: endpoint,
        headers: headers,
        body: body,
      ),
    );
  }

  static Future<http.Response> _sendWithAuth({
    required String method,
    required String endpoint,
    Map<String, String>? headers,
    Object? body,
  }) async {
    final token = await AuthManager.getToken();
    final finalHeaders = {
      'Content-Type': 'application/json',
      if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
      ...?headers,
    };

    final uri = Uri.parse('$baseUrl$endpoint');
    switch (method) {
      case 'GET':
        return http.get(uri, headers: finalHeaders);
      case 'POST':
        return http.post(uri, headers: finalHeaders, body: body);
      case 'PUT':
        return http.put(uri, headers: finalHeaders, body: body);
      case 'PATCH':
        return http.patch(uri, headers: finalHeaders, body: body);
      case 'DELETE':
        return http.delete(uri, headers: finalHeaders, body: body);
      default:
        throw UnsupportedError('Unsupported HTTP method: $method');
    }
  }

  /// Core request handler with automatic token refresh.
  static Future<http.Response> _makeRequest(
    Future<http.Response> Function() requestFunction,
  ) async {
    try {
      final response = await requestFunction();

      if (response.statusCode == 401) {
        debugPrint('Token expired, attempting refresh');
        final refreshed = await _refreshToken();
        if (refreshed) {
          debugPrint('Token refreshed, retrying request');
          return requestFunction();
        }
      }

      return response;
    } catch (e) {
      debugPrint('Request error: $e');
      rethrow;
    }
  }

  static Future<bool> _refreshToken() async {
    if (_refreshingTask != null) {
      debugPrint('Waiting for ongoing refresh');
      return _refreshingTask!;
    }

    _refreshingTask = _performRefresh();
    try {
      return await _refreshingTask!;
    } finally {
      _refreshingTask = null;
    }
  }

  static Future<bool> _performRefresh() async {
    try {
      final refreshToken = (await AuthManager.getRefreshToken())?.trim();
      if (refreshToken == null || refreshToken.isEmpty) {
        debugPrint('No refresh token available');
        await _handleRefreshFailure();
        return false;
      }

      final response = await http.post(
        Uri.parse('$baseUrl/auth/refresh'),
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'refreshToken=$refreshToken',
        },
        body: jsonEncode({
          'refreshToken': refreshToken,
          // Backend variants may expect `token` as request field.
          'token': refreshToken,
        }),
      );

      if (response.statusCode != 200) {
        debugPrint('Refresh failed: ${response.statusCode} ${response.body}');
        await _handleRefreshFailure();
        return false;
      }

      final data = jsonDecode(response.body) as Map<String, dynamic>;
      final newAccessToken =
          data['data']?['accessToken'] ??
          data['data']?['token'] ??
          data['accessToken'] ??
          data['token'];

      if (newAccessToken is! String || newAccessToken.isEmpty) {
        debugPrint('Refresh response did not contain a usable access token');
        await _handleRefreshFailure();
        return false;
      }

      await AuthManager.saveToken(newAccessToken);

      final newRefreshToken =
          data['data']?['refreshToken'] ?? data['refreshToken'];
      if (newRefreshToken is String && newRefreshToken.isNotEmpty) {
        await AuthManager.saveRefreshToken(newRefreshToken);
      }

      debugPrint('Token refresh successful');
      return true;
    } catch (e) {
      debugPrint('Token refresh error: $e');
      await _handleRefreshFailure();
      return false;
    }
  }

  static Future<void> _handleRefreshFailure() async {
    await AuthManager.logout();
  }
}
