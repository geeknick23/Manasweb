import 'package:flutter/material.dart';
import '../../data/models/user_model.dart';
import '../../presentation/blocs/locale/locale_cubit.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    // This allows fallback if locale isn't found, though typically handled by LocalizationsDelegate
    final locale = context.read<LocaleCubit>().state;
    return AppLocalizations(locale);
  }
  
  bool get isMarathi => locale.languageCode == 'mr';

  static final Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'sent': 'Sent',
      'received': 'Received',
      'viewAllInterests': 'View All Interests',
      'aboutMe': 'About Me',
      'interests': 'Interests & Hobbies',
      'background': 'Background & Family',
      'religion': 'Religion',
      'caste': 'Caste',
      'guardian': 'Guardian',
      'children': 'Children',
      'personalInfo': 'Personal Information',
      'birthDate': 'Birth Date',
      'gender': 'Gender',
      'education': 'Education',
      'profession': 'Profession',
      'contactDetails': 'Contact Details',
      'email': 'Email',
      'phone': 'Phone',
      'location': 'Location',
      'village': 'Village',
      'tehsil': 'Tehsil',
      'district': 'District',
      'signOut': 'Sign Out',
      'verifiedProfile': 'VERIFIED PROFILE',
      'years': 'years',
      'findMatch': 'Find Your Match',
      'sendInterest': 'Send Interest',
      'noProfiles': 'No Profiles Found',
      'adjustFilters': 'Adjust Filters',
      'tryAdjusting': 'Try adjusting your filters',
      'somethingWrong': 'Something went wrong',
      'tryAgain': 'Try Again',
      'yourMatches': 'Your Matches',
      'noMatchesYet': 'No matches found yet',
      'matchesDescription': 'Interest accepted by both sides will appear here.',
      'refresh': 'Refresh',
      'yourTurn': 'Your turn',
      'tapToChat': 'Tap to chat',
      'about': 'About',
      'personalDetails': 'Personal Details',
      'dateOfBirth': 'Date of Birth',
      'age': 'Age',
      'state': 'State',
      'interestSent': 'Interest Sent',
      'interestSentSuccess': 'Interest sent successfully!',
      'child': 'child',
      'yrs': 'yrs',
    },
    'mr': {
      'sent': 'पाठवले',
      'received': 'प्राप्त झाले',
      'viewAllInterests': 'सर्व आवडी पहा',
      'aboutMe': 'माझ्याबद्दल',
      'interests': 'आवडी आणि छंद',
      'background': 'कौटुंबिक माहिती',
      'religion': 'धर्म',
      'caste': 'जात',
      'guardian': 'पालक',
      'children': 'मुले',
      'personalInfo': 'वैयक्तिक माहिती',
      'birthDate': 'जन्म तारीख',
      'gender': 'लिंग',
      'education': 'शिक्षण',
      'profession': 'व्यवसाय',
      'contactDetails': 'संपर्क तपशील',
      'email': 'ईमेल',
      'phone': 'फोन',
      'location': 'ठिकाण',
      'village': 'गाव',
      'tehsil': 'तालुका',
      'district': 'जिल्हा',
      'signOut': 'बाहेर पडा',
      'verifiedProfile': 'सत्यापित प्रोफाइल',
      'years': 'वर्षे',
      'findMatch': 'तुमच्यासाठी जोडी शोधा',
      'sendInterest': 'स्वारस्य पाठवा',
      'noProfiles': 'कोणतीही प्रोफाइल आढळली नाही',
      'adjustFilters': 'फिल्टर बदला',
      'tryAdjusting': 'फिल्टर बदलून पहा',
      'somethingWrong': 'काहीतरी चूक झाली',
      'tryAgain': 'पुन्हा प्रयत्न करा',
      'yourMatches': 'तुमचे जुळलेले जोडीदार',
      'noMatchesYet': 'अद्याप काहीही जुळले नाही',
      'matchesDescription': 'दोन्ही बाजूंनी स्वीकारलेले स्वारस्य येथे दिसेल',
      'refresh': 'रिफ्रेश करा',
      'yourTurn': 'तुमची पाळी',
      'tapToChat': 'चॅट करण्यासाठी टॅप करा',
      'about': 'माहिती',
      'personalDetails': 'वैयक्तिक तपशील',
      'dateOfBirth': 'जन्म तारीख',
      'age': 'वय',
      'state': 'राज्य',
      'interestSent': 'स्वारस्य पाठवले',
      'interestSentSuccess': 'स्वारस्य यशस्वीरित्या पाठवले!',
      'child': 'मूल',
      'yrs': 'वर्षे',
    },
  };

  String get(String key) {
    return _localizedValues[locale.languageCode]?[key] ?? key;
  }

  // Enum Translations
  
  String getMaritalStatus(MaritalStatus status) {
    if (isMarathi) {
      switch (status) {
        case MaritalStatus.single: return 'अविवाहित';
        case MaritalStatus.divorcee: return 'घटस्फोटित';
        case MaritalStatus.widow: return 'विधवा/विधुर';
        case MaritalStatus.separated: return 'विभक्त';
        case MaritalStatus.neverMarried: return 'कधीही लग्न न झालेले';
      }
    }
    return status.name.toUpperCase();
  }

  String getEducation(Education education) {
    if (isMarathi) {
      switch (education) {
        case Education.none: return 'शिक्षण नाही';
        case Education.primarySchool: return 'प्राथमिक शिक्षण';
        case Education.highSchool: return 'हायस्कूल';
        case Education.bachelors: return 'पदवीधर';
        case Education.masters: return 'पदव्युत्तर';
        case Education.phd: return 'पीएचडी';
      }
    }
    return education.name.toUpperCase();
  }

  String getGender(Gender gender) {
    if (isMarathi) {
      switch (gender) {
        case Gender.male: return 'पुरुष';
        case Gender.female: return 'स्त्री';
      }
    }
    return gender.name.toUpperCase();
  }
}
