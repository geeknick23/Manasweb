class ApiConstants {
  // Base URL - configurable via environment variable
  // For production: Use --dart-define=API_URL=https://your-api.vercel.app
  // For Android emulator: Use --dart-define=API_URL=http://10.0.2.2:5000
  // For local development: Use --dart-define=API_URL=http://localhost:5001
  static const String baseUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://192.168.1.16:5001', // Local Development URL (LAN IP)
  );
  static const String apiUrl = '$baseUrl/api';
  
  // Auth endpoints
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String verifyOtp = '/auth/verify-otp';
  static const String resendOtp = '/auth/resend-otp';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';
  
  // User endpoints
  static const String profile = '/users/profile';
  static const String profiles = '/users/profiles';
  static const String matches = '/users/matches';
  static const String profilePhoto = '/users/profile/picture';
  static const String uploadPhoto = '/users/upload-photo';
  
  // Interest endpoints
  static const String expressInterest = '/users/express-interest';
  static const String acceptInterest = '/users/accept-interest';
  static const String rejectInterest = '/users/reject-interest';
  static const String removeInterest = '/users/remove-interest';
  
  // Content endpoints
  static const String impactCards = '/users/impact-cards';
  static const String achievementCards = '/users/achievement-cards';
  static const String successStories = '/users/success-stories';
  static const String mediaCards = '/users/media-cards';
  static const String events = '/users/events';
  static const String contact = '/users/contact';
  static const String volunteer = '/volunteer';
  
  // New content endpoints
  static const String programs = '/users/programs';
  static const String projects = '/users/projects';
  static const String contactInfo = '/users/contact-info';
  static const String donateInfo = '/users/donate-info';
  static const String milestones = '/users/milestones';
  static const String volunteerRoles = '/users/volunteer-roles';
  
  // Timeouts
  static const int connectTimeout = 60000;
  static const int receiveTimeout = 60000;
}

class AppConstants {
  // App info
  static const String appName = 'Manas Bandhan';
  static const String appNameMarathi = 'मानस बंधन';
  static const String appVersion = '1.0.0';
  
  // NGO Info
  static const String ngoName = 'Manas Foundation';
  static const String ngoNameMarathi = 'मानस फाउंडेशन';
  static const String founderName = 'Prof. D.S. Lahane';
  
  // Contact
  static const String address = 'Shivsai Patsanstha, Tulsi Nagar, Sagwan, Buldhana, Maharashtra - 443001';
  static const String phone = '+91 7767806527';
  static const String email = 'manasfoundation2025@gmail.com';
  static const double officeLatitude = 20.5303; // Estimated Buldhana latitude
  static const double officeLongitude = 76.1833; // Estimated Buldhana longitude
  
  // Bank Details for Donations
  static const String bankName = 'State Bank of India';
  static const String accountName = 'Manas Foundation';
  static const String accountNumber = 'XXXXXXXXXXXX'; // To be filled
  static const String ifscCode = 'SBIN0XXXXXX'; // To be filled
  static const String upiId = 'manasfoundation@sbi'; // To be filled
  
  // Storage keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  static const String localeKey = 'app_locale';
  static const String onboardingKey = 'onboarding_complete';
}
