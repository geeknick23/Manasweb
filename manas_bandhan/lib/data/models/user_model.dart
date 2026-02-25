import 'dart:convert';
import 'package:equatable/equatable.dart';

enum Gender { male, female }

enum MaritalStatus { 
  divorcee, 
  widow, 
  single,
  // Note: 'separated' and 'neverMarried' are frontend-only values
  // They will be mapped to 'single' when sent to backend
  separated, 
  neverMarried 
}

enum Education { none, primarySchool, highSchool, bachelors, masters, phd }

enum Religion { hindu, muslim, christian, sikh, buddhist, jain, other }

enum Caste { general, obc, sc, st, other }

enum InterestStatus { pending, accepted, rejected }

class Child extends Equatable {
  final String gender;
  final int age;

  const Child({required this.gender, required this.age});

  factory Child.fromJson(Map<String, dynamic> json) {
    return Child(
      gender: json['gender'] ?? 'boy',
      age: json['age'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
        'gender': gender,
        'age': age,
      };

  @override
  List<Object?> get props => [gender, age];
}

class Guardian extends Equatable {
  final String name;
  final String contact;

  const Guardian({required this.name, required this.contact});

  factory Guardian.fromJson(Map<String, dynamic> json) {
    return Guardian(
      name: json['name'] ?? '',
      contact: json['contact'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'contact': contact,
      };

  @override
  List<Object?> get props => [name, contact];
}

class Location extends Equatable {
  final String village;
  final String tehsil;
  final String district;
  final String state;

  const Location({
    required this.village,
    required this.tehsil,
    required this.district,
    required this.state,
  });

  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      village: json['village'] ?? '',
      tehsil: json['tehsil'] ?? '',
      district: json['district'] ?? '',
      state: json['state'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'village': village,
        'tehsil': tehsil,
        'district': district,
        'state': state,
      };

  String get displayLocation {
    final parts = [village, tehsil, district].where((s) => s.isNotEmpty);
    return parts.join(', ');
  }

  @override
  List<Object?> get props => [village, tehsil, district, state];
}

class Interest extends Equatable {
  final User user;
  final DateTime sentAt;
  final InterestStatus status;

  const Interest({
    required this.user,
    required this.sentAt,
    required this.status,
  });

  factory Interest.fromJson(Map<String, dynamic> json) {
    var userData = json['user'];
    if (userData is String) {
      try {
        userData = jsonDecode(userData);
      } catch (_) {}
    }

    // If we still don't have a map (e.g. just an ID string), create a minimal user placeholder
    // or let it throw to be caught by _parseInterests
    User userObj;
    if (userData is Map<String, dynamic>) {
      userObj = User.fromJson(userData);
    } else {
       // Create a dummy user with the ID if userData is a String ID, otherwise throw
       if (userData is String) {
          userObj = User.empty(id: userData);
       } else {
          throw const FormatException("Invalid user data in Interest");
       }
    }

    return Interest(
      user: userObj,
      sentAt: DateTime.tryParse(json['sentAt'] ?? '') ?? DateTime.now(),
      status: _parseInterestStatus(json['status']),
    );
  }

  static InterestStatus _parseInterestStatus(String? value) {
    switch (value?.toLowerCase()) {
      case 'accepted':
        return InterestStatus.accepted;
      case 'rejected':
        return InterestStatus.rejected;
      default:
        return InterestStatus.pending;
    }
  }

  @override
  List<Object?> get props => [user, sentAt, status];
}

class User extends Equatable {
  // ... existing fields ...
  // Add a Named Constructor for empty/minimal user
  factory User.empty({String id = ''}) {
    return User(
      id: id,
      fullName: 'Unknown User',
      email: '',
      dateOfBirth: DateTime.now(),
      gender: Gender.female,
      maritalStatus: MaritalStatus.single,
      education: Education.none,
      childrenCount: 0,
      isVerified: false,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
  }
// ... existing User code ...
  final String id;
  final String fullName;
  final String email;
  final String? phoneNumber;
  final DateTime dateOfBirth;
  final Gender gender;
  final MaritalStatus maritalStatus;
  final Education education;
  final String? profession;
  final String? interestsHobbies;
  final String? briefPersonalDescription;
  final Location? location;
  final Guardian? guardian;
  final Caste? caste;
  final Religion? religion;
  final bool? divorceFinalized;
  final List<Child> children;
  final int childrenCount;
  final String? profilePhoto;
  final bool isVerified;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<Interest>? expressedInterests;
  final List<Interest>? receivedInterests;

  const User({
    required this.id,
    required this.fullName,
    required this.email,
    this.phoneNumber,
    required this.dateOfBirth,
    required this.gender,
    required this.maritalStatus,
    required this.education,
    this.profession,
    this.interestsHobbies,
    this.briefPersonalDescription,
    this.location,
    this.guardian,
    this.caste,
    this.religion,
    this.divorceFinalized,
    this.children = const [],
    required this.childrenCount,
    this.profilePhoto,
    required this.isVerified,
    required this.createdAt,
    required this.updatedAt,
    this.expressedInterests,
    this.receivedInterests,
  });

  int get age {
    final now = DateTime.now();
    int age = now.year - dateOfBirth.year;
    if (now.month < dateOfBirth.month ||
        (now.month == dateOfBirth.month && now.day < dateOfBirth.day)) {
      age--;
    }
    return age;
  }

  factory User.fromJson(Map<String, dynamic> json) {
    try {
      // print('DEBUG: User.fromJson input: $json');
      return User(
        id: json['_id'] ?? json['id'] ?? '',
        fullName: json['full_name'] ?? 'Unknown',
        email: json['email'] ?? '',
        phoneNumber: json['phone_number'],
        dateOfBirth: DateTime.tryParse(json['date_of_birth'] ?? '') ?? DateTime.now(),
        gender: _parseGender(json['gender']),
        maritalStatus: _parseMaritalStatus(json['marital_status']),
        education: _parseEducation(json['education']),
        profession: json['profession'],
        interestsHobbies: json['interests_hobbies'],
        briefPersonalDescription: json['brief_personal_description'],
        location: _parseLocation(json['location']),
        guardian: _parseGuardian(json['guardian']),
        caste: _parseCaste(json['caste']),
        religion: _parseReligion(json['religion']),
        divorceFinalized: json['divorce_finalized'],
        children: _parseChildren(json['children']),
        childrenCount: _parseInt(json['children_count']),
        profilePhoto: json['profile_photo'],
        isVerified: _parseBool(json['is_verified']),
        createdAt: DateTime.tryParse(json['createdAt'] ?? json['created_at'] ?? '') ?? DateTime.now(),
        updatedAt: DateTime.tryParse(json['updatedAt'] ?? json['updated_at'] ?? '') ?? DateTime.now(),
        expressedInterests: _parseInterests(json['expressed_interests']),
        receivedInterests: _parseInterests(json['received_interests']),
      );
    } catch (e, stack) {
      // In debug mode, errors are logged via Flutter's error handling
      // In release, parsing errors are silently rethrown
      rethrow;
    }
  }

  static dynamic _parseJsonField(dynamic value) {
    if (value is String) {
      try {
        return jsonDecode(value);
      } catch (e) {
        return null;
      }
    }
    return value;
  }

  static Location? _parseLocation(dynamic value) {
    final parsed = _parseJsonField(value);
    if (parsed != null && parsed is Map<String, dynamic>) {
      return Location.fromJson(parsed);
    }
    return null;
  }

  static Guardian? _parseGuardian(dynamic value) {
    final parsed = _parseJsonField(value);
    if (parsed != null && parsed is Map<String, dynamic>) {
      return Guardian.fromJson(parsed);
    }
    return null;
  }

  static List<Child> _parseChildren(dynamic value) {
    if (value == null) return [];
    
    final parsed = _parseJsonField(value);
    if (parsed is List) {
      return parsed.map((c) {
        final childData = _parseJsonField(c);
        if (childData is Map<String, dynamic>) {
          return Child.fromJson(childData);
        }
        return const Child(gender: 'unknown', age: 0);
      }).toList();
    }
    return [];
  }

  static int _parseInt(dynamic value) {
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? 0;
    return 0;
  }

  static bool _parseBool(dynamic value) {
    if (value is bool) return value;
    if (value is String) return value.toLowerCase() == 'true';
    if (value is int) return value == 1;
    return false;
  }

  static List<Interest>? _parseInterests(dynamic value) {
    if (value == null) return null;
    
    final parsed = _parseJsonField(value);
    if (parsed is List) {
      return parsed.map((i) {
        try {
          final interestData = _parseJsonField(i);
          if (interestData is Map<String, dynamic>) {
            return Interest.fromJson(interestData);
          }
        } catch (e) {
          // Silently skip malformed interests
        }
        return null;
      }).whereType<Interest>().toList();
    }
    return null;
  }

  Map<String, dynamic> toJson() => {
        'full_name': fullName,
        'email': email,
        'phone_number': phoneNumber,
        'date_of_birth': dateOfBirth.toIso8601String(),
        'gender': gender.name,
        'marital_status': maritalStatusToBackend(maritalStatus),
        'education': education.name,
        'profession': profession,
        'interests_hobbies': interestsHobbies,
        'brief_personal_description': briefPersonalDescription,
        'location': location?.toJson(),
        'guardian': guardian?.toJson(),
        'caste': caste?.name,
        'religion': religion?.name,
        'divorce_finalized': divorceFinalized,
        'children': children.map((c) => c.toJson()).toList(),
        'children_count': childrenCount,
        'profile_photo': profilePhoto,
      };

  /// Maps MaritalStatus to backend-compatible string values
  static String maritalStatusToBackend(MaritalStatus status) {
    switch (status) {
      case MaritalStatus.divorcee:
        return 'divorcee';
      case MaritalStatus.widow:
        return 'widow';
      case MaritalStatus.single:
      case MaritalStatus.separated:
      case MaritalStatus.neverMarried:
        // Backend only supports: divorcee, widow, single
        return 'single';
    }
  }

  static String educationToBackend(Education education) {
    switch (education) {
      case Education.none:
        return 'none';
      case Education.primarySchool:
        return 'primary school';
      case Education.highSchool:
        return 'high school';
      case Education.bachelors:
        return "bachelor's";
      case Education.masters:
        return "master's";
      case Education.phd:
        return 'phd';
    }
  }

  static Gender _parseGender(String? value) {
    switch (value?.toLowerCase()) {
      case 'male':
        return Gender.male;
      case 'female':
        return Gender.female;
      default:
        return Gender.female;
    }
  }

  static MaritalStatus _parseMaritalStatus(String? value) {
    switch (value?.toLowerCase()) {
      case 'divorcee':
        return MaritalStatus.divorcee;
      case 'widow':
        return MaritalStatus.widow;
      case 'single':
        return MaritalStatus.single;
      case 'separated':
        return MaritalStatus.separated;
      case 'never_married':
      case 'nevermarried':
        return MaritalStatus.neverMarried;
      default:
        return MaritalStatus.single;
    }
  }

  static Education _parseEducation(String? value) {
    switch (value?.toLowerCase()) {
      case 'none':
        return Education.none;
      case 'primary school':
      case 'primaryschool':
        return Education.primarySchool;
      case 'high school':
      case 'highschool':
        return Education.highSchool;
      case "bachelor's":
      case 'bachelors':
        return Education.bachelors;
      case "master's":
      case 'masters':
        return Education.masters;
      case 'phd':
        return Education.phd;
      default:
        return Education.none;
    }
  }

  static Caste? _parseCaste(String? value) {
    switch (value?.toLowerCase()) {
      case 'general':
        return Caste.general;
      case 'obc':
        return Caste.obc;
      case 'sc':
        return Caste.sc;
      case 'st':
        return Caste.st;
      case 'other':
        return Caste.other;
      default:
        return null;
    }
  }

  static Religion? _parseReligion(String? value) {
    switch (value?.toLowerCase()) {
      case 'hindu':
        return Religion.hindu;
      case 'muslim':
        return Religion.muslim;
      case 'christian':
        return Religion.christian;
      case 'sikh':
        return Religion.sikh;
      case 'buddhist':
        return Religion.buddhist;
      case 'jain':
        return Religion.jain;
      case 'other':
        return Religion.other;
      default:
        return null;
    }
  }

  @override
  List<Object?> get props => [id, fullName, email, dateOfBirth, gender, maritalStatus];
}
