import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/constants/constants.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/api_client.dart';
import '../models/user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final ApiClient _apiClient;
  final SharedPreferences _prefs;

  AuthRepositoryImpl(this._apiClient, this._prefs);

  @override
  Future<AuthResult> login(String phoneOrEmail, String password) async {
    try {
      final response = await _apiClient.post(
        ApiConstants.login,
        data: {
          'username_or_email': phoneOrEmail,
          'password': password,
        },
      );

      final token = response.data['token'] as String;
      final user = User.fromJson(response.data['user']);
      
      if (kDebugMode) {
        debugPrint('[Auth] Login successful for: ${user.fullName}');
      }
      
      return AuthResult(token: token, user: user);
    } on DioException catch (e) {
      if (kDebugMode) {
        debugPrint('[Auth] Login error: ${e.response?.data}');
      }
      final message = e.response?.data?['message'] ?? 'Login failed';
      throw Exception(message);
    } catch (e) {
      throw Exception('Login failed: ${e.toString()}');
    }
  }

  @override
  Future<void> register(Map<String, dynamic> userData) async {
    try {
      await _apiClient.post(
        ApiConstants.register,
        data: userData,
      );
    } on DioException catch (e) {
      if (kDebugMode) {
        debugPrint('[Auth] Registration error: ${e.response?.data}');
      }
      final message = e.response?.data?['message'] ?? 'Registration failed';
      throw Exception(message);
    } catch (e) {
      throw Exception('Registration failed: ${e.toString()}');
    }
  }

  @override
  Future<void> initiateWhatsAppLogin(String phoneNumber) async {
    try {
      await _apiClient.post(
        '/auth/whatsapp/login',
        data: {'phone_number': phoneNumber},
      );
    } on DioException catch (e) {
      final message = e.response?.data?['message'] ?? 'Failed to initiate WhatsApp login';
      throw Exception(message);
    } catch (e) {
      throw Exception('WhatsApp login failed: ${e.toString()}');
    }
  }

  @override
  Future<AuthResult> verifyWhatsAppLogin(String phoneNumber, String otp) async {
    try {
      final response = await _apiClient.post(
        '/auth/whatsapp/verify',
        data: {
          'phone_number': phoneNumber,
          'code': otp,
        },
      );

      final token = response.data['token'] as String;
      final user = User.fromJson(response.data['user']);
      
      return AuthResult(token: token, user: user);
    } on DioException catch (e) {
      final message = e.response?.data?['message'] ?? 'WhatsApp verification failed';
      throw Exception(message);
    } catch (e) {
      throw Exception('Verification failed: ${e.toString()}');
    }
  }

  @override
  Future<void> verifyOtp(String identifier, String otp) async {
    try {
      // Determine if identifier is email or phone
      final isEmail = identifier.contains('@');
      final data = isEmail 
          ? {'email': identifier, 'code': otp}
          : {'phone_number': identifier, 'code': otp};

      await _apiClient.post(
        ApiConstants.verifyOtp,
        data: data,
      );
    } catch (e) {
      throw Exception('OTP verification failed: ${e.toString()}');
    }
  }

  @override
  Future<void> resendOtp(String identifier) async {
    try {
       final isEmail = identifier.contains('@');
       final data = isEmail 
          ? {'email': identifier}
          : {'phone_number': identifier};

      await _apiClient.post(
        ApiConstants.resendOtp,
        data: data,
      );
    } catch (e) {
      throw Exception('Failed to resend OTP: ${e.toString()}');
    }
  }

  @override
  Future<User> getCurrentUser() async {
    try {
      final response = await _apiClient.get(ApiConstants.profile);
      return User.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to get current user: ${e.toString()}');
    }
  }

  @override
  Future<void> logout() async {
    await _prefs.remove(AppConstants.tokenKey);
    await _prefs.remove(AppConstants.userKey);
  }

  @override
  Future<void> forgotPassword(String email) async {
    try {
      await _apiClient.post(
        ApiConstants.forgotPassword,
        data: {'email': email},
      );
    } on DioException catch (e) {
      if (kDebugMode) {
        debugPrint('[Auth] Forgot password error: ${e.response?.data}');
      }
      final message = e.response?.data?['message'] ?? 'Failed to send reset email';
      throw Exception(message);
    } catch (e) {
      throw Exception('Failed to send reset email: ${e.toString()}');
    }
  }

  @override
  Future<void> resetPassword(String email, String otp, String newPassword) async {
    try {
      await _apiClient.post(
        ApiConstants.resetPassword,
        data: {
          'email': email,
          'otp': otp,
          'newPassword': newPassword,
        },
      );
    } on DioException catch (e) {
      if (kDebugMode) {
        debugPrint('[Auth] Reset password error: ${e.response?.data}');
      }
      final message = e.response?.data?['message'] ?? 'Failed to reset password';
      throw Exception(message);
    } catch (e) {
      throw Exception('Failed to reset password: ${e.toString()}');
    }
  }
}
