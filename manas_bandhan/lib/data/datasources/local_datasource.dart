import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

import '../models/user_model.dart';
import '../../core/constants/constants.dart';

class LocalDataSource {
  final SharedPreferences _prefs;

  LocalDataSource(this._prefs);

  // Token management
  Future<void> saveToken(String token) async {
    await _prefs.setString(AppConstants.tokenKey, token);
  }

  String? getToken() {
    return _prefs.getString(AppConstants.tokenKey);
  }

  Future<void> removeToken() async {
    await _prefs.remove(AppConstants.tokenKey);
  }

  // User data caching
  Future<void> saveUser(User user) async {
    final json = jsonEncode(user.toJson());
    await _prefs.setString(AppConstants.userKey, json);
  }

  User? getUser() {
    final json = _prefs.getString(AppConstants.userKey);
    if (json == null) return null;
    return User.fromJson(jsonDecode(json));
  }

  Future<void> removeUser() async {
    await _prefs.remove(AppConstants.userKey);
  }

  // Locale
  Future<void> saveLocale(String locale) async {
    await _prefs.setString(AppConstants.localeKey, locale);
  }

  String? getLocale() {
    return _prefs.getString(AppConstants.localeKey);
  }

  // Onboarding
  Future<void> setOnboardingComplete() async {
    await _prefs.setBool(AppConstants.onboardingKey, true);
  }

  bool isOnboardingComplete() {
    return _prefs.getBool(AppConstants.onboardingKey) ?? false;
  }

  // Clear all data
  Future<void> clearAll() async {
    await _prefs.clear();
  }
}
