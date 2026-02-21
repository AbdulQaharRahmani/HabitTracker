import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'token_storage.dart';

/// Centralized HTTP client with automatic token refresh
class AuthenticatedHttpClient {
  static const String baseUrl = "https://habit-tracker-17sr.onrender.com/api";

  // Prevent multiple simultaneous refresh calls
  static bool _isRefreshing = false;
  static final List<Function> _refreshQueue = [];

  /// Make authenticated GET request with auto-refresh
  static Future<http.Response> get(
    String endpoint, {
    Map<String, String>? headers,
  }) async {
    return _makeRequest(
      () async {
        final token = await AuthManager.getToken();
        final finalHeaders = {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
          ...?headers,
        };
        return http.get(Uri.parse('$baseUrl$endpoint'), headers: finalHeaders);
      },
    );
  }

  /// Make authenticated POST request with auto-refresh
  static Future<http.Response> post(
    String endpoint, {
    Map<String, String>? headers,
    Object? body,
  }) async {
    return _makeRequest(
      () async {
        final token = await AuthManager.getToken();
        final finalHeaders = {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
          ...?headers,
        };
        return http.post(
          Uri.parse('$baseUrl$endpoint'),
          headers: finalHeaders,
          body: body,
        );
      },
    );
  }

  /// Make authenticated PUT request with auto-refresh
  static Future<http.Response> put(
    String endpoint, {
    Map<String, String>? headers,
    Object? body,
  }) async {
    return _makeRequest(
      () async {
        final token = await AuthManager.getToken();
        final finalHeaders = {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
          ...?headers,
        };
        return http.put(
          Uri.parse('$baseUrl$endpoint'),
          headers: finalHeaders,
          body: body,
        );
      },
    );
  }

  /// Make authenticated PATCH request with auto-refresh
  static Future<http.Response> patch(
    String endpoint, {
    Map<String, String>? headers,
    Object? body,
  }) async {
    return _makeRequest(
      () async {
        final token = await AuthManager.getToken();
        final finalHeaders = {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
          ...?headers,
        };
        return http.patch(
          Uri.parse('$baseUrl$endpoint'),
          headers: finalHeaders,
          body: body,
        );
      },
    );
  }

  /// Make authenticated DELETE request with auto-refresh
  static Future<http.Response> delete(
    String endpoint, {
    Map<String, String>? headers,
    Object? body,
  }) async {
    return _makeRequest(
      () async {
        final token = await AuthManager.getToken();
        final finalHeaders = {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
          ...?headers,
        };
        return http.delete(
          Uri.parse('$baseUrl$endpoint'),
          headers: finalHeaders,
          body: body,
        );
      },
    );
  }

  /// Core request handler with automatic token refresh
  static Future<http.Response> _makeRequest(
    Future<http.Response> Function() requestFunction,
  ) async {
    try {
      // Make initial request
      final response = await requestFunction();

      // If 401, try to refresh token
      if (response.statusCode == 401) {
        debugPrint('🔄 Token expired, attempting refresh...');

        final refreshed = await _refreshToken();

        if (refreshed) {
          // Retry original request with new token
          debugPrint('✅ Token refreshed, retrying request...');
          return await requestFunction();
        } else {
          debugPrint('❌ Token refresh failed');
          return response;
        }
      }

      return response;
    } catch (e) {
      debugPrint('❌ Request error: $e');
      rethrow;
    }
  }

  /// Refresh access token using refresh token
  static Future<bool> _refreshToken() async {
    // Prevent multiple simultaneous refresh calls
    if (_isRefreshing) {
      debugPrint('⏳ Refresh already in progress, queuing...');
      // Wait for ongoing refresh to complete
      await Future.delayed(const Duration(milliseconds: 100));
      return await AuthManager.getToken() != null;
    }

    _isRefreshing = true;

    try {
      final refreshToken = await AuthManager.getRefreshToken();

      if (refreshToken == null || refreshToken.isEmpty) {
        debugPrint('❌ No refresh token available');
        await _handleRefreshFailure();
        return false;
      }

      // Call refresh endpoint
      final response = await http.post(
        Uri.parse('$baseUrl/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refreshToken': refreshToken}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);

        if (data['success'] == true && data['data'] != null) {
          final newAccessToken = data['data']['accessToken'] ?? data['data']['token'];

          if (newAccessToken != null && newAccessToken.toString().isNotEmpty) {
            await AuthManager.saveToken(newAccessToken);

            // Save new refresh token if provided
            final newRefreshToken = data['data']['refreshToken'];
            if (newRefreshToken != null && newRefreshToken.toString().isNotEmpty) {
              await AuthManager.saveRefreshToken(newRefreshToken);
            }

            debugPrint('✅ Token refresh successful');
            return true;
          }
        }
      }

      debugPrint('❌ Refresh token invalid or expired');
      await _handleRefreshFailure();
      return false;
    } catch (e) {
      debugPrint('❌ Token refresh error: $e');
      await _handleRefreshFailure();
      return false;
    } finally {
      _isRefreshing = false;
    }
  }

  /// Handle refresh failure - clear tokens
  static Future<void> _handleRefreshFailure() async {
    await AuthManager.logout();
    // Note: Navigation to login should be handled by the app's auth state listener
  }
}
