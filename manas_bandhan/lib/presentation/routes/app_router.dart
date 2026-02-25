import 'package:flutter/material.dart';

import '../screens/splash/splash_screen.dart';
import '../screens/auth/language_select_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/auth/otp_verification_screen.dart';
import '../screens/auth/forgot_password_screen.dart';
import '../screens/auth/reset_password_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/home/main_navigation.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/profile/edit_profile_screen.dart';
import '../screens/profile/view_profile_screen.dart';
import '../screens/discovery/discovery_screen.dart';
import '../screens/ngo/about_screen.dart';
import '../screens/ngo/projects_screen.dart';
import '../screens/ngo/donate_screen.dart';
import '../screens/ngo/contact_screen.dart';
import '../screens/ngo/media_screen.dart';
import '../screens/ngo/impact_screen.dart'; // [TRY 2]
import '../screens/ngo/volunteer_screen.dart'; // [TRY 2]
import '../screens/ngo/programs_screen.dart'; // [NEW]
import '../screens/chat/chat_screen.dart'; // [NEW]
import '../screens/matches/matches_screen.dart'; // [NEW]
import '../screens/interests/interests_screen.dart';
import '../screens/notifications/notification_screen.dart'; // [NEW]

class AppRouter {
  // Route names
  static const String splash = '/';
  static const String languageSelect = '/language-select';
  static const String login = '/login';
  static const String register = '/register';
  static const String otpVerification = '/otp-verification';
  static const String forgotPassword = '/forgot-password';
  static const String resetPassword = '/reset-password';
  static const String main = '/main';
  static const String home = '/home';
  static const String discovery = '/discovery';
  static const String profile = '/profile';
  static const String editProfile = '/edit-profile';
  static const String viewProfile = '/view-profile';
  static const String interests = '/interests';
  static const String about = '/about';
  static const String projects = '/projects';
  static const String donate = '/donate';
  static const String contact = '/contact';
  static const String media = '/media';
  static const String impact = '/impact'; // [NEW]
  static const String volunteer = '/volunteer'; // [NEW] // [NEW]
  static const String programs = '/programs'; // [NEW] // [NEW] // [NEW]
  static const String chat = '/chat'; // [NEW]
  static const String matches = '/matches'; // [NEW]
  static const String notifications = '/notifications'; // [NEW]


  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case splash:
        return _buildRoute(const SplashScreen(), settings);
      
      case languageSelect:
        return _buildRoute(const LanguageSelectScreen(), settings);
      
      case login:
        return _buildRoute(const LoginScreen(), settings);
      
      case register:
        return _buildRoute(const RegisterScreen(), settings);
      
      case otpVerification:
        final args = settings.arguments as Map<String, dynamic>?;
        return _buildRoute(
          OtpVerificationScreen(identifier: args?['email'] ?? ''),
          settings,
        );
      
      case forgotPassword:
        return _buildRoute(const ForgotPasswordScreen(), settings);
      
      case resetPassword:
        final args = settings.arguments as Map<String, dynamic>?;
        return _buildRoute(
          ResetPasswordScreen(email: args?['email'] ?? ''),
          settings,
        );
      
      case main:
        return _buildRoute(const MainNavigation(), settings);
      
      case home:
        return _buildRoute(const HomeScreen(), settings);
      
      case discovery:
        return _buildRoute(const DiscoveryScreen(), settings);
      
      case profile:
        return _buildRoute(const ProfileScreen(), settings);
      
      case editProfile:
        return _buildRoute(const EditProfileScreen(), settings);
      
      case viewProfile:
        final args = settings.arguments as Map<String, dynamic>?;
        return _buildRoute(
          ViewProfileScreen(userId: args?['userId'] ?? ''),
          settings,
        );
      
      case interests:
        return _buildRoute(const InterestsScreen(), settings);
      
      case about:
        return _buildRoute(const AboutScreen(), settings);
      
      case projects:
        return _buildRoute(const ProjectsScreen(), settings);
      
      case donate:
        return _buildRoute(const DonateScreen(), settings);
      
      case contact:
        return _buildRoute(const ContactScreen(), settings);

      case media: // [NEW]
        return _buildRoute(const MediaScreen(), settings);

      case impact: // [NEW]
        return _buildRoute(const ImpactScreen(), settings);

      case volunteer: // [NEW]
        return _buildRoute(const VolunteerScreen(), settings);

      case programs: // [NEW]
        return _buildRoute(const ProgramsScreen(), settings);

      case matches: // [NEW]
        return _buildRoute(const MatchesScreen(), settings);

      case notifications: // [NEW]
        return _buildRoute(const NotificationScreen(), settings);

      case chat:
        final args = settings.arguments as Map<String, dynamic>? ?? {};
        return _buildRoute(
          ChatScreen(
            userId: args['userId'] ?? '',
            userName: args['name'] ?? 'User', 
            userImage: args['image'] ?? 'assets/images/placeholder.png'
          ), 
          settings
        );

      default:
        return _buildRoute(const SplashScreen(), settings);
    }
  }

  static MaterialPageRoute _buildRoute(Widget page, RouteSettings settings) {
    return MaterialPageRoute(
      builder: (_) => page,
      settings: settings,
    );
  }
}
