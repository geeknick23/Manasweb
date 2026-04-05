import '../../data/models/user_model.dart';

class AuthResult {
  final String token;
  final User user;

  const AuthResult({required this.token, required this.user});
}

abstract class AuthRepository {
  Future<AuthResult> login(String phoneOrEmail, String password);
  Future<void> register(Map<String, dynamic> userData);
  Future<void> initiateSmsLogin(String phoneNumber);
  Future<AuthResult> verifySmsLogin(String phoneNumber, String otp);
  Future<void> verifyOtp(String identifier, String otp);
  Future<void> resendOtp(String identifier);
  Future<User> getCurrentUser();
  Future<void> logout();
  Future<void> forgotPassword(String email);
  Future<void> resetPassword(String email, String otp, String newPassword);
}
