import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/constants/constants.dart';
import '../../../data/models/user_model.dart';
import '../../../domain/repositories/auth_repository.dart';

// Events
abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class CheckAuthStatus extends AuthEvent {}

class LoginRequested extends AuthEvent {
  final String phoneOrEmail;
  final String password;

  const LoginRequested({required this.phoneOrEmail, required this.password});

  @override
  List<Object?> get props => [phoneOrEmail, password];
}

class RegisterRequested extends AuthEvent {
  final Map<String, dynamic> userData;

  const RegisterRequested({required this.userData});

  @override
  List<Object?> get props => [userData];
}

class WhatsAppLoginRequested extends AuthEvent {
  final String phoneNumber;
  const WhatsAppLoginRequested({required this.phoneNumber});
  @override
  List<Object?> get props => [phoneNumber];
}

class VerifyWhatsAppLoginRequested extends AuthEvent {
  final String phoneNumber;
  final String otp;
  const VerifyWhatsAppLoginRequested({required this.phoneNumber, required this.otp});
  @override
  List<Object?> get props => [phoneNumber, otp];
}

class VerifyOtpRequested extends AuthEvent {
  final String identifier; // email or phone
  final String otp;

  const VerifyOtpRequested({required this.identifier, required this.otp});

  @override
  List<Object?> get props => [identifier, otp];
}

class ResendOtpRequested extends AuthEvent {
  final String identifier; // email or phone

  const ResendOtpRequested({required this.identifier});

  @override
  List<Object?> get props => [identifier];
}

class ForgotPasswordRequested extends AuthEvent {
  final String email;

  const ForgotPasswordRequested({required this.email});

  @override
  List<Object?> get props => [email];
}

class ResetPasswordRequested extends AuthEvent {
  final String email;
  final String otp;
  final String newPassword;

  const ResetPasswordRequested({
    required this.email,
    required this.otp,
    required this.newPassword,
  });

  @override
  List<Object?> get props => [email, otp, newPassword];
}

class LogoutRequested extends AuthEvent {}

class RefreshUserRequested extends AuthEvent {}

class DemoLoginRequested extends AuthEvent {}

// States
abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class Authenticated extends AuthState {
  final User user;

  const Authenticated({required this.user});

  @override
  List<Object?> get props => [user];
}

class Unauthenticated extends AuthState {}

class AuthNeedsOtpVerification extends AuthState {
  final String identifier; // email or phone

  const AuthNeedsOtpVerification({required this.identifier});

  @override
  List<Object?> get props => [identifier];
}

class OtpVerificationSuccess extends AuthState {}

class OtpResent extends AuthState {
  final String identifier; // email or phone

  const OtpResent({required this.identifier});

  @override
  List<Object?> get props => [identifier];
}

class MessageSent extends AuthState {
  final String message;
  final String? phoneNumber;
  
  const MessageSent({required this.message, this.phoneNumber});
  
  @override
  List<Object?> get props => [message, phoneNumber];
}

class AuthError extends AuthState {
  final String message;

  const AuthError({required this.message});

  @override
  List<Object?> get props => [message];
}

class PasswordResetOtpSent extends AuthState {
  final String email;

  const PasswordResetOtpSent({required this.email});

  @override
  List<Object?> get props => [email];
}

class PasswordResetSuccess extends AuthState {}

// BLoC
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;
  final SharedPreferences _prefs;

  AuthBloc(this._authRepository, this._prefs) : super(AuthInitial()) {
    on<CheckAuthStatus>(_onCheckAuthStatus);
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<WhatsAppLoginRequested>(_onWhatsAppLoginRequested);
    on<VerifyWhatsAppLoginRequested>(_onVerifyWhatsAppLoginRequested);
    on<VerifyOtpRequested>(_onVerifyOtpRequested);
    on<ResendOtpRequested>(_onResendOtpRequested);
    on<ForgotPasswordRequested>(_onForgotPasswordRequested);
    on<ResetPasswordRequested>(_onResetPasswordRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<RefreshUserRequested>(_onRefreshUserRequested);
    on<DemoLoginRequested>(_onDemoLoginRequested);
  }

  // ... existing checkAuthStatus ...

  Future<void> _onCheckAuthStatus(
    CheckAuthStatus event,
    Emitter<AuthState> emit,
  ) async {
    final token = _prefs.getString(AppConstants.tokenKey);
    
    if (token != null && token.isNotEmpty) {
      try {
        final user = await _authRepository.getCurrentUser();
        emit(Authenticated(user: user));
      } catch (e) {
        // Token expired or invalid
        await _prefs.remove(AppConstants.tokenKey);
        emit(Unauthenticated());
      }
    } else {
      emit(Unauthenticated());
    }
  }

  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    
    try {
      final result = await _authRepository.login(
        event.phoneOrEmail,
        event.password,
      );
      
      // Save token
      await _prefs.setString(AppConstants.tokenKey, result.token);
      
      emit(Authenticated(user: result.user));
    } catch (e) {
      if (e.toString().contains('verify your email')) {
        emit(AuthNeedsOtpVerification(identifier: event.phoneOrEmail));
      } else {
        emit(AuthError(message: e.toString()));
      }
    }
  }

  Future<void> _onWhatsAppLoginRequested(
    WhatsAppLoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      await _authRepository.initiateWhatsAppLogin(event.phoneNumber);
      emit(AuthNeedsOtpVerification(identifier: event.phoneNumber));
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onVerifyWhatsAppLoginRequested(
    VerifyWhatsAppLoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final result = await _authRepository.verifyWhatsAppLogin(
        event.phoneNumber,
        event.otp,
      );
      await _prefs.setString(AppConstants.tokenKey, result.token);
      emit(Authenticated(user: result.user));
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onRegisterRequested(
    RegisterRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    
    try {
      await _authRepository.register(event.userData);
      
      // After registration, user needs to verify OTP
      final identifier = event.userData['verification_method'] == 'whatsapp' 
        ? event.userData['phone_number'] 
        : event.userData['email'] ?? event.userData['phone_number'];

      emit(AuthNeedsOtpVerification(identifier: identifier));
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onVerifyOtpRequested(
    VerifyOtpRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    
    try {
      await _authRepository.verifyOtp(event.identifier, event.otp);
      emit(OtpVerificationSuccess());
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onResendOtpRequested(
    ResendOtpRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      await _authRepository.resendOtp(event.identifier);
      emit(OtpResent(identifier: event.identifier));
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onForgotPasswordRequested(
    ForgotPasswordRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    
    try {
      await _authRepository.forgotPassword(event.email);
      emit(PasswordResetOtpSent(email: event.email));
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onResetPasswordRequested(
    ResetPasswordRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    
    try {
      await _authRepository.resetPassword(event.email, event.otp, event.newPassword);
      emit(PasswordResetSuccess());
    } catch (e) {
      emit(AuthError(message: e.toString()));
    }
  }

  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    await _prefs.remove(AppConstants.tokenKey);
    await _prefs.remove(AppConstants.userKey);
    emit(Unauthenticated());
  }

  Future<void> _onRefreshUserRequested(
    RefreshUserRequested event,
    Emitter<AuthState> emit,
  ) async {
    try {
      final user = await _authRepository.getCurrentUser();
      emit(Authenticated(user: user));
    } catch (e) {
      // Keep current state if refresh fails
    }
  }

  Future<void> _onDemoLoginRequested(
    DemoLoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    
    // Create a demo user
    final demoUser = User(
      id: 'demo_user_001',
      fullName: 'Demo User',
      email: 'demo@manasbandhan.org',
      phoneNumber: '+91 9876543210',
      dateOfBirth: DateTime(1990, 5, 15),
      gender: Gender.female,
      maritalStatus: MaritalStatus.divorcee,
      education: Education.bachelors,
      profession: 'Teacher',
      interestsHobbies: 'Reading, Cooking, Traveling',
      briefPersonalDescription: 'A kind-hearted person looking for a compatible life partner.',
      location: const Location(
        village: 'Demo Village',
        tehsil: 'Demo Tehsil',
        district: 'Demo District',
        state: 'Madhya Pradesh',
      ),
      guardian: const Guardian(
        name: 'Demo Guardian',
        contact: '+91 9876543211',
      ),
      caste: Caste.general,
      religion: Religion.hindu,
      divorceFinalized: true,
      children: const [],
      childrenCount: 0,
      profilePhoto: null,
      isVerified: true,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    
    // Save demo token
    await _prefs.setString(AppConstants.tokenKey, 'demo_token_12345');
    
    emit(Authenticated(user: demoUser));
  }
}
