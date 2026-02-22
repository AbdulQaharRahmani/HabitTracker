import 'package:shared_preferences/shared_preferences.dart';

class AuthManager {
  static const String _key = 'jwt_token';
  static const String _refreshKey = 'refresh_token';
  static const String _isLoggedInKey = 'is_logged_in';
  static const String _userNameKey = 'user_name';
  static const String _userEmailKey = 'user_email';


  // -----------------------------
  // SAVE TOKEN (LOGIN)
  // -----------------------------
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, token);
    await prefs.setBool(_isLoggedInKey, true);
  }

  // -----------------------------
  // SAVE REFRESH TOKEN
  // -----------------------------
  static Future<void> saveRefreshToken(String refreshToken) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_refreshKey, refreshToken);
  }

  // -----------------------------
  // GET REFRESH TOKEN
  // -----------------------------
  static Future<String?> getRefreshToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_refreshKey);
  }
  /// Save user data after login
  static Future<void> saveUserData(String name, String email) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userNameKey, name);
    await prefs.setString(_userEmailKey, email);
  }
  // -----------------------------
  // GET TOKEN (FOR API HEADERS)
  // -----------------------------
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_key);
  }

  // -----------------------------
  // CHECK LOGIN STATUS
  // -----------------------------
  static Future<bool> isUserLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_key);
    return token != null && token.isNotEmpty;
  }

  // -----------------------------
  // LOGOUT / CLEAR TOKEN
  // -----------------------------
  /// Clear auth data (logout)
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
    await prefs.remove(_refreshKey);
    await prefs.remove(_userNameKey);
    await prefs.remove(_userEmailKey);
    await prefs.remove(_isLoggedInKey);
  }
  // -----------------------------
// GET USER NAME
// -----------------------------
  static Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userNameKey);
  }
// -----------------------------
// GET USER EMAIL
// -----------------------------
  static Future<String?> getUserEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_userEmailKey);
  }
// -----------------------------
// GET USER DATA (NAME + EMAIL)
// -----------------------------
  static Future<Map<String, String>?> getUserData() async {
    final prefs = await SharedPreferences.getInstance();

    final name = prefs.getString(_userNameKey);
    final email = prefs.getString(_userEmailKey);

    if ((name == null || name.isEmpty) &&
        (email == null || email.isEmpty)) {
      return null;
    }

    return {
      'name': name ?? '',
      'email': email ?? '',
    };
  }

}