import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('mr'),
  ];

  // Translations
  static final Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'appName': 'Manas Bandhan',
      'welcome': 'Welcome',
      'login': 'Login',
      'register': 'Register',
      'logout': 'Logout',
      'profile': 'Profile',
      'home': 'Home',
      'search': 'Search',
      'about': 'About',
      'donate': 'Donate',
      'contact': 'Contact',
      'findMatch': 'Find Match',
      'sendInterest': 'Send Interest',
      'age': 'Age',
      'maritalStatus': 'Marital Status',
      'education': 'Education',
      'profession': 'Profession',
      'location': 'Location',
      'phone': 'Phone',
      'email': 'Email',
      'password': 'Password',
      'verifyOtp': 'Verify OTP',
      'resendOtp': 'Resend OTP',
      'next': 'Next',
      'previous': 'Previous',
      'apply': 'Apply',
      'filter': 'Filter',
      'noResults': 'No results found',
      'loading': 'Loading...',
      'error': 'Something went wrong',
      'tryAgain': 'Try Again',
      'exploreManas': 'Explore Manas',
      'programsAndEvents': 'Programs\n& Events',
      'volunteer': 'Volunteer',
      'missionVision': 'Mission & Vision',
      'ourMission': 'Our Mission',
      'ourVision': 'Our Vision',
      'whoWeAre': 'Who We Are',
      'leadership': 'Leadership',
      'ourValues': 'Our Values',
      'ourJourney': 'Our Journey',
      'ourImpact': 'Our Impact',
      'mediaCoverage': 'Media Coverage',
      'makeDifference': 'Make a Difference',
      'donateNow': 'Donate Now',
      'getInvolved': 'Get Involved',
      'joinCommunity': 'Join our community of volunteers and changemakers.',
      'language': 'Language',
      'english': 'English',
      'marathi': 'Marathi',
      'viewAll': 'View All',
      'missionText': 'To empower widows, divorced, and abandoned women by providing dignified pathways to remarriage and companionship. We aim to free women from traditional constraints, make them economically and emotionally self-reliant, and help them regain dignity and respect in society.',
      'visionText': 'A society where every woman, regardless of her past, can find love, companionship, and support in a judgment-free environment. We strive to eliminate the stigma around widowhood and remarriage, ensuring every woman can live with respect, purpose, and equal opportunity.',
      'whoWeAreText': 'Manas Foundation was established to address the social and economic challenges faced by widowed, divorced, and separated women. In 2022, our team organized a district-level Rakshabandhan program for widowed women, which strengthened our resolve to launch structured programs for their remarriage, rehabilitation, and social reintegration. Since then, we have guided hundreds of women through employment opportunities, skill development, counseling, and community support.',
      'aboutDesc': 'Learn who we are and what drives our mission',
      'profileDesc': 'Browse profiles and find your ideal match',
      'volunteerDesc': 'Join our team and make a difference today',
      'programsDesc': 'Explore our initiatives and upcoming events',
      'donateText': 'Your contribution can help us organize more melavas and support more women.',
      'value1': 'Zero Dowry Policy',
      'value2': 'Dignity for All Women',
      'value3': 'Social Equality',
      'value4': 'Community Support',
      // Volunteer screen
      'getInvolvedTitle': 'Get Involved',
      'joinTheMovement': 'Join the Movement',
      'volunteerHeroCTA': 'Your time and skills can bring hope to those who need it most. Become a volunteer today.',
      'waysToVolunteer': 'Ways to Volunteer',
      'contactUsToJoin': 'Contact Us to Join',
      'roleTeaching': 'Teaching',
      'roleTeachingDesc': 'Teach subjects or skills at our Ashram Schools.',
      'roleEvents': 'Event Management',
      'roleEventsDesc': 'Help organize and manage Punarvivah Melavas.',
      'roleAwareness': 'Awareness',
      'roleAwarenessDesc': 'Spread awareness about our key social initiatives.',
      'roleCounselling': 'Counselling',
      'roleCounsellingDesc': 'Provide emotional support and guidance.',
      // Donate screen
      'donateTitle': 'Donate',
      'yourDonationCan': 'Your Donation Can',
      'bankTransfer': 'Bank Transfer',
      'upiPayment': 'UPI Payment',
      'scanToPay': 'Scan to Pay',
      'accountName': 'Account Name',
      'bank': 'Bank',
      'accountNumber': 'Account Number',
      'ifscCode': 'IFSC Code',
      'copiedToClipboard': 'copied to clipboard',
      'notInstalled': 'is not installed',
      'impactCard1Title': '₹1,000',
      'impactCard1Subtitle': "Support a widow's wedding expenses",
      'impactCard2Title': '₹500',
      'impactCard2Subtitle': "Sponsor a tribal child's meal",
      'supportOurCause': 'Support Our Cause',
      'donateHeaderSubtitle': 'Your contribution helps us create more meaningful connections',
      'taxNote': 'All donations are eligible for 80G tax exemption. Receipt will be emailed after donation confirmation.',
      // Projects screen
      'ourProjectsTitle': 'Our Projects',
      'project1Title': 'Widow Remarriage (Punarvivah)',
      'project1Desc': 'Our flagship initiative facilitates dignified remarriages for widows and divorcees. We organize Punarvivah Melavas where eligible individuals can meet and find compatible life partners.',
      'project1Highlight1': 'Zero Dowry Policy - All marriages are conducted without any dowry',
      'project1Highlight2': 'Satyashodhak Ceremonies - Simple, dignified wedding rituals',
      'project1Highlight3': 'Success Stories - Over 500 successful marriages',
      'project1Highlight4': 'Upcoming Melavas in Buldhana region',
      
      'project2Title': 'Tribal Welfare (Adivasi Vikas)',
      'project2Desc': 'We run Ashram Schools for tribal children in the Vidarbha region, providing education, nutrition, and a safe environment for their overall development.',
      'project2Highlight1': 'Free Education for underprivileged tribal children',
      'project2Highlight2': 'Nutritious Meals - Mid-day meal program',
      'project2Highlight3': 'Skill Development - Vocational training',
      'project2Highlight4': 'Cultural Preservation - Celebrating tribal heritage',
      
      'project3Title': 'Old Age Home',
      'project3Desc': 'Our proposed facility will provide shelter, care and companionship to destitute elderly individuals who have no family support.',
      'project3Highlight1': 'Safe and caring environment',
      'project3Highlight2': 'Medical care and support',
      'project3Highlight3': 'Community activities',
      'project3Highlight4': 'Currently seeking donations for construction',
      
      'upcomingEventsTitle': 'Upcoming Events',
      'event1Title': 'District Remarriage Melava',
      'event1Loc': 'Buldhana',
      'event2Title': 'Family Counseling Camp',
      'event2Loc': 'Akola',
      'event3Title': 'Skill Development Workshop',
      'event3Loc': 'Amravati',
      'monthMay': 'MAY',
      'monthJun': 'JUN',
    },
    'mr': {
      'appName': 'मानस बंधन',
      'welcome': 'स्वागत आहे',
      'login': 'लॉग इन',
      'register': 'नोंदणी',
      'logout': 'बाहेर पडा',
      'profile': 'प्रोफाइल',
      'home': 'मुख्यपृष्ठ',
      'search': 'शोधा',
      'about': 'आमच्याबद्दल',
      'donate': 'दान करा',
      'contact': 'संपर्क',
      'findMatch': 'जोडीदार शोधा',
      'sendInterest': 'आवड पाठवा',
      'age': 'वय',
      'maritalStatus': 'वैवाहिक स्थिती',
      'education': 'शिक्षण',
      'profession': 'व्यवसाय',
      'location': 'स्थान',
      'phone': 'फोन',
      'email': 'ईमेल',
      'password': 'पासवर्ड',
      'verifyOtp': 'OTP सत्यापित करा',
      'resendOtp': 'OTP पुन्हा पाठवा',
      'next': 'पुढे',
      'previous': 'मागे',
      'apply': 'लागू करा',
      'filter': 'फिल्टर',
      'noResults': 'कोणतेही परिणाम नाहीत',
      'loading': 'लोड होत आहे...',
      'error': 'काहीतरी चूक झाली',
      'tryAgain': 'पुन्हा प्रयत्न करा',
      'exploreManas': 'माणस एक्सप्लोर करा',
      'programsAndEvents': 'कार्यक्रम\nआणि उपक्रम',
      'volunteer': 'स्वयंसेवक',
      'missionVision': 'ध्येय आणि दृष्टीकोन',
      'ourMission': 'आमचे ध्येय',
      'ourVision': 'आमचा दृष्टीकोन',
      'whoWeAre': 'आम्ही कोण आहोत',
      'leadership': 'नेतृत्व',
      'ourValues': 'आमची मूल्ये',
      'ourJourney': 'आमचा प्रवास',
      'ourImpact': 'आमचा प्रभाव',
      'mediaCoverage': 'मीडिया कव्हरेज',
      'makeDifference': 'फरक करा',
      'donateNow': 'आता दान करा',
      'getInvolved': 'सहभागी व्हा',
      'joinCommunity': 'स्वयंसेवक आणि बदल घडवणाऱ्यांच्या समाजात सामील व्हा.',
      'language': 'भाषा',
      'english': 'इंग्रजी',
      'marathi': 'मराठी',
      'viewAll': 'सर्व पहा',
      'missionText': 'विधवा, घटस्फोटित आणि परित्यक्त महिलांना पुनर्विवाहाचे सन्मानजनक मार्ग देऊन सक्षम करणे हे आमचे उद्दिष्ट आहे. महिलांना पारंपारिक बंधनातून मुक्त करून त्यांना आर्थिक व भावनिकदृष्ट्या स्वावलंबी बनवणे आणि समाजात सन्मान मिळवून देणे यासाठी आम्ही कटिबद्ध आहोत.',
      'visionText': 'असा समाज निर्माण करणे जिथे प्रत्येक स्त्रीला, तिच्या भूतकाळाकडे दुर्लक्ष करून, निर्णयमुक्त वातावरणात प्रेम आणि आधार मिळेल. वैधव्य व पुनर्विवाहाशी जोडलेला कलंक दूर करून प्रत्येक महिलेला आदर, उद्दिष्ट आणि समान संधी मिळवून देणे हे आमचे ध्येय आहे.',
      'whoWeAreText': 'मानस फाउंडेशनची स्थापना विधवा, घटस्फोटित आणि विभक्त महिलांच्या सामाजिक व आर्थिक आव्हानांना सामोरे जाण्यासाठी झाली. २०२२ मध्ये आम्ही आयोजित केलेल्या जिल्हा-स्तरीय रक्षाबंधन कार्यक्रमाच्या यशाने आम्हाला या महिलांच्या पुनर्विवाह, पुनर्वसन आणि सामाजिक पुनर्एकीकरणासाठी संरचित कार्यक्रम सुरू करण्यास प्रेरित केले. तेव्हापासून आम्ही शेकडो महिलांना रोजगार, कौशल्य विकास, समुपदेशन आणि समुदाय आधाराद्वारे नवीन जीवन सुरू करण्यास मदत केली आहे.',
      'aboutDesc': 'आम्ही कोण आहोत आणि आमचे ध्येय काय आहे ते जाणून घ्या',
      'profileDesc': 'प्रोफाईल पहा आणि योग्य जोडीदार शोधा',
      'volunteerDesc': 'आमच्या टीममध्ये सामील व्हा आणि बदल घडवा',
      'programsDesc': 'आमचे उपक्रम आणि आगामी कार्यक्रम पहा',
      'donateText': 'तुमचे योगदान आम्हाला अधिक मेळावे आयोजित करण्यास आणि अधिक महिलांना मदत करण्यास मदत करू शकते.',
      'value1': 'शून्य हुंडा धोरण',
      'value2': 'सर्व महिलांसाठी सन्मान',
      'value3': 'सामाजिक समानता',
      'value4': 'समुदाय सहाय्य',
      // Volunteer screen
      'getInvolvedTitle': 'सहभागी व्हा',
      'joinTheMovement': 'चळवळीत सामील व्हा',
      'volunteerHeroCTA': 'तुमचा वेळ आणि कौशल्ये गरजूंना आशा देऊ शकतात. आज स्वयंसेवक व्हा.',
      'waysToVolunteer': 'स्वयंसेवा करण्याचे मार्ग',
      'contactUsToJoin': 'सामील होण्यासाठी संपर्क करा',
      'roleTeaching': 'शिकवणे',
      'roleTeachingDesc': 'आमच्या आश्रम शाळांमध्ये विषय किंवा कौशल्ये शिकवा.',
      'roleEvents': 'कार्यक्रम व्यवस्थापन',
      'roleEventsDesc': 'पुनर्विवाह मेळावे आयोजित करण्यात मदत करा.',
      'roleAwareness': 'जनजागृती',
      'roleAwarenessDesc': 'आमच्या प्रमुख सामाजिक उपक्रमांबद्दल जनजागृती पसरवा.',
      'roleCounselling': 'समुपदेशन',
      'roleCounsellingDesc': 'भावनिक आधार आणि मार्गदर्शन द्या.',
      // Donate screen
      'donateTitle': 'दान करा',
      'yourDonationCan': 'तुमचे दान करू शकते',
      'bankTransfer': 'बँक हस्तांतरण',
      'upiPayment': 'UPI पेमेंट',
      'scanToPay': 'पैसे देण्यासाठी स्कॅन करा',
      'accountName': 'खाते नाव',
      'bank': 'बँक',
      'accountNumber': 'खाते क्रमांक',
      'ifscCode': 'IFSC कोड',
      'copiedToClipboard': 'क्लिपबोर्डवर कॉपी केले',
      'notInstalled': 'इन्स्टॉल केलेले नाही',
      'impactCard1Title': '₹१,०००',
      'impactCard1Subtitle': 'विधवेच्या लग्नाच्या खर्चास मदत करा',
      'impactCard2Title': '₹५००',
      'impactCard2Subtitle': 'आदिवासी मुलाच्या जेवणाचे प्रायोजक व्हा',
      'supportOurCause': 'आमच्या कार्याला पाठिंबा द्या',
      'donateHeaderSubtitle': 'तुमचे योगदान आम्हाला अधिक अर्थपूर्ण नाते निर्माण करण्यास मदत करते',
      'taxNote': 'सर्व देणग्या 80G कर सवलतीसाठी पात्र आहेत. दान पुष्टीनंतर पावती ईमेल केली जाईल.',
      // Projects screen
      'ourProjectsTitle': 'आमचे प्रकल्प',
      'project1Title': 'विधवा पुनर्विवाह',
      'project1Desc': 'आमचा मुख्य उपक्रम विधवा आणि घटस्फोटित महिलांसाठी सन्मानजनक पुनर्विवाहाची सोय करतो. आम्ही पुनर्विवाह मेळावे आयोजित करतो जिथे पात्र व्यक्ती भेटू शकतात आणि योग्य जीवनसाथी शोधू शकतात.',
      'project1Highlight1': 'शून्य हुंडा धोरण - सर्व विवाह कोणत्याही हुंड्याशिवाय केले जातात',
      'project1Highlight2': 'सत्यशोधक समारंभ - साधे, सन्माननीय विवाह विधी',
      'project1Highlight3': 'यशस्वी कथा - ५०० हून अधिक यशस्वी विवाह',
      'project1Highlight4': 'बुलढाणा जिल्ह्यात आगामी मेळावे',
      
      'project2Title': 'आदिवासी विकास',
      'project2Desc': 'आम्ही विदर्भ भागात आदिवासी मुलांसाठी आश्रम शाळा चालवतो, त्यांच्या सर्वांगीण विकासासाठी शिक्षण, पोषण आणि सुरक्षित वातावरण प्रदान करतो.',
      'project2Highlight1': 'वंचित आदिवासी मुलांसाठी मोफत शिक्षण',
      'project2Highlight2': 'पौष्टिक आहार - माध्यान्ह भोजन कार्यक्रम',
      'project2Highlight3': 'कौशल्य विकास - व्यावसायिक प्रशिक्षण',
      'project2Highlight4': 'सांस्कृतिक जतन - आदिवासी वारसा साजरा करणे',
      
      'project3Title': 'वृद्धाश्रम',
      'project3Desc': 'आमची प्रस्तावित सुविधा निराधार वृद्धांना निवारा, काळजी आणि सोबत देईल ज्यांना कोणताही कौटुंबिक आधार नाही.',
      'project3Highlight1': 'सुरक्षित आणि काळजीपूर्ण वातावरण',
      'project3Highlight2': 'वैद्यकीय काळजी आणि आधार',
      'project3Highlight3': 'सामुदायिक उपक्रम',
      'project3Highlight4': 'सध्या बांधकामासाठी देणग्या मागत आहोत',
      
      'upcomingEventsTitle': 'आगामी कार्यक्रम',
      'event1Title': 'जिल्हा पुनर्विवाह मेळावा',
      'event1Loc': 'बुलढाणा',
      'event2Title': 'कौटुंबिक समुपदेशन शिबिर',
      'event2Loc': 'अकोला',
      'event3Title': 'कौशल्य विकास कार्यशाळा',
      'event3Loc': 'अमरावती',
      'monthMay': 'मे',
      'monthJun': 'जून',
    },
  };

  String get(String key) {
    return _localizedValues[locale.languageCode]?[key] ??
        _localizedValues['en']?[key] ??
        key;
  }

  String get appName => get('appName');
  String get welcome => get('welcome');
  String get login => get('login');
  String get register => get('register');
  String get logout => get('logout');
  String get profile => get('profile');
  String get home => get('home');
  String get search => get('search');
  String get about => get('about');
  String get donate => get('donate');
  String get contact => get('contact');
  String get findMatch => get('findMatch');
  String get sendInterest => get('sendInterest');
  String get exploreManas => get('exploreManas');
  String get programsAndEvents => get('programsAndEvents');
  String get volunteer => get('volunteer');
  String get missionVision => get('missionVision');
  String get ourMission => get('ourMission');
  String get ourVision => get('ourVision');
  String get whoWeAre => get('whoWeAre');
  String get leadership => get('leadership');
  String get ourValues => get('ourValues');
  String get ourJourney => get('ourJourney');
  String get ourImpact => get('ourImpact');
  String get mediaCoverage => get('mediaCoverage');
  String get makeDifference => get('makeDifference');
  String get donateNow => get('donateNow');
  String get getInvolved => get('getInvolved');
  String get joinCommunity => get('joinCommunity');
  String get language => get('language');
  String get english => get('english');
  String get marathi => get('marathi');
  String get viewAll => get('viewAll');
  String get missionText => get('missionText');
  String get visionText => get('visionText');
  String get whoWeAreText => get('whoWeAreText');
  String get aboutDesc => get('aboutDesc');
  String get profileDesc => get('profileDesc');
  String get volunteerDesc => get('volunteerDesc');
  String get programsDesc => get('programsDesc');
  String get donateText => get('donateText');
  String get value1 => get('value1');
  String get value2 => get('value2');
  String get value3 => get('value3');
  String get value4 => get('value4');
  // Volunteer
  String get getInvolvedTitle => get('getInvolvedTitle');
  String get joinTheMovement => get('joinTheMovement');
  String get volunteerHeroCTA => get('volunteerHeroCTA');
  String get waysToVolunteer => get('waysToVolunteer');
  String get contactUsToJoin => get('contactUsToJoin');
  String get roleTeaching => get('roleTeaching');
  String get roleTeachingDesc => get('roleTeachingDesc');
  String get roleEvents => get('roleEvents');
  String get roleEventsDesc => get('roleEventsDesc');
  String get roleAwareness => get('roleAwareness');
  String get roleAwarenessDesc => get('roleAwarenessDesc');
  String get roleCounselling => get('roleCounselling');
  String get roleCounsellingDesc => get('roleCounsellingDesc');
  // Donate
  String get donateTitle => get('donateTitle');
  String get yourDonationCan => get('yourDonationCan');
  String get bankTransfer => get('bankTransfer');
  String get upiPayment => get('upiPayment');
  String get scanToPay => get('scanToPay');
  String get accountNameLabel => get('accountName');
  String get bankLabel => get('bank');
  String get accountNumberLabel => get('accountNumber');
  String get ifscCodeLabel => get('ifscCode');
  String get copiedToClipboard => get('copiedToClipboard');
  String get notInstalled => get('notInstalled');
  String get impactCard1Title => get('impactCard1Title');
  String get impactCard1Subtitle => get('impactCard1Subtitle');
  String get impactCard2Title => get('impactCard2Title');
  String get impactCard2Subtitle => get('impactCard2Subtitle');
  String get supportOurCause => get('supportOurCause');
  String get donateHeaderSubtitle => get('donateHeaderSubtitle');
  String get taxNote => get('taxNote');
  // Projects
  String get ourProjectsTitle => get('ourProjectsTitle');
  String get project1Title => get('project1Title');
  String get project1Desc => get('project1Desc');
  String get project1Highlight1 => get('project1Highlight1');
  String get project1Highlight2 => get('project1Highlight2');
  String get project1Highlight3 => get('project1Highlight3');
  String get project1Highlight4 => get('project1Highlight4');
  String get project2Title => get('project2Title');
  String get project2Desc => get('project2Desc');
  String get project2Highlight1 => get('project2Highlight1');
  String get project2Highlight2 => get('project2Highlight2');
  String get project2Highlight3 => get('project2Highlight3');
  String get project2Highlight4 => get('project2Highlight4');
  String get project3Title => get('project3Title');
  String get project3Desc => get('project3Desc');
  String get project3Highlight1 => get('project3Highlight1');
  String get project3Highlight2 => get('project3Highlight2');
  String get project3Highlight3 => get('project3Highlight3');
  String get project3Highlight4 => get('project3Highlight4');
  String get upcomingEventsTitle => get('upcomingEventsTitle');
  String get event1Title => get('event1Title');
  String get event1Loc => get('event1Loc');
  String get event2Title => get('event2Title');
  String get event2Loc => get('event2Loc');
  String get event3Title => get('event3Title');
  String get event3Loc => get('event3Loc');
  String get monthMay => get('monthMay');
  String get monthJun => get('monthJun');
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(AppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) {
    return ['en', 'mr'].contains(locale.languageCode);
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
