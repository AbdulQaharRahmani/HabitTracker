import 'package:flutter/material.dart';
import '../utils/profile/profile_model.dart';
import 'auth_service.dart';
import 'token_storage.dart';

/// Global app state manager for preloading and caching data
class AppState extends ChangeNotifier {
  static final AppState _instance = AppState._internal();
  factory AppState() => _instance;
  AppState._internal();

  final AuthService _api = AuthService();

  // Profile data cache
  HabitsData? _habitsData;
  UserData? _userData;
  String? _displayName;
  bool _profileLoaded = false;
  bool _profileLoading = false;

  // Getters
  HabitsData? get habitsData => _habitsData;
  UserData? get userData => _userData;
  String? get displayName => _displayName;
  bool get isProfileLoaded => _profileLoaded;
  bool get isProfileLoading => _profileLoading;

  /// Preload profile data in background
  Future<void> preloadProfileData() async {
    if (_profileLoaded || _profileLoading) {
      debugPrint('📦 Profile already loaded or loading');
      return;
    }

    _profileLoading = true;
    notifyListeners();

    try {
      debugPrint('🔄 Preloading profile data...');

      // Load dashboard and profile in parallel
      final results = await Future.wait([
        _api.fetchHabitsDashboard(),
        _api.getUserProfile(),
      ]);

      final welcome = results[0] as Welcome;
      final profileRes = results[1] as Map<String, dynamic>;

      _habitsData = welcome.habitsData;
      _userData = profileRes['data'] != null
          ? UserData.fromJson(profileRes['data'])
          : null;

      // Get display name from storage or API
      final savedName = await getDisplayName();
      _displayName = savedName;

      _profileLoaded = true;
      debugPrint('✅ Profile preloaded successfully');
    } catch (e) {
      debugPrint('❌ Profile preload error: $e');
      _profileLoaded = false;
    } finally {
      _profileLoading = false;
      notifyListeners();
    }
  }

  /// Refresh profile data
  Future<void> refreshProfileData() async {
    _profileLoaded = false;
    await preloadProfileData();
  }

  /// Resolve display name with local cache + API/storage fallbacks
  Future<String> getDisplayName() async {
    if (_displayName != null && _displayName!.trim().isNotEmpty) {
      return _displayName!;
    }

    if (_userData != null && _userData!.userId.trim().isNotEmpty) {
      return _userData!.userId;
    }

    final storedUser = await AuthManager.getUserData();
    if (storedUser != null) {
      final name = storedUser['name']?.toString();
      if (name != null && name.trim().isNotEmpty) {
        return name;
      }

      final email = storedUser['email']?.toString();
      if (email != null && email.contains('@')) {
        return email.split('@').first;
      }
    }

    final profileRes = await _api.getUserProfile();
    if (profileRes['success'] == true && profileRes['data'] is Map<String, dynamic>) {
      final data = profileRes['data'] as Map<String, dynamic>;
      final username = data['username']?.toString();
      if (username != null && username.trim().isNotEmpty) {
        return username;
      }

      final email = data['email']?.toString();
      if (email != null && email.contains('@')) {
        return email.split('@').first;
      }
    }

    return 'Habit Tracker User';
  }

  /// Clear cached profile data (on logout)
  void clearProfileData() {
    _habitsData = null;
    _userData = null;
    _displayName = null;
    _profileLoaded = false;
    _profileLoading = false;
    notifyListeners();
  }
}
