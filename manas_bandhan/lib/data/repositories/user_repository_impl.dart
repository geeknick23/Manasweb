import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/constants/constants.dart';
import '../../domain/repositories/user_repository.dart';
import '../models/home_models.dart';
import '../models/app_content_models.dart';

import '../datasources/api_client.dart';
import '../models/user_model.dart';

class UserRepositoryImpl implements UserRepository {
  final ApiClient _apiClient;
  final SharedPreferences _prefs;

  UserRepositoryImpl(this._apiClient, this._prefs);

  @override
  Future<User> getProfile() async {
    try {
      final response = await _apiClient.get(ApiConstants.profile);
      return User.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to get profile: ${e.toString()}');
    }
  }

  @override
  Future<User> updateProfile(Map<String, dynamic> data) async {
    try {
      final response = await _apiClient.put(
        ApiConstants.profile,
        data: data,
      );
      return User.fromJson(response.data);
    } on DioException catch (e) {
      if (kDebugMode) {
        debugPrint('[User] Update profile error: ${e.response?.data}');
      }
      throw Exception('Failed to update profile: ${e.message}');
    } catch (e) {
      throw Exception('Failed to update profile: ${e.toString()}');
    }
  }

  @override
  Future<ProfilesResult> getProfiles({
    int? ageFrom,
    int? ageTo,
    MaritalStatus? maritalStatus,
    Education? education,
    String? district,
    int page = 1,
    SortOption? sort,
    int? limit,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit ?? 10,
      };

      if (ageFrom != null) {
        final yearTo = DateTime.now().year - ageFrom;
        queryParams['yearOfBirthTo'] = yearTo.toString();
      }
      if (ageTo != null) {
        final yearFrom = DateTime.now().year - ageTo;
        queryParams['yearOfBirthFrom'] = yearFrom.toString();
      }
      if (maritalStatus != null) {
        queryParams['marital_status'] = User.maritalStatusToBackend(maritalStatus);
      }
      if (education != null) {
        queryParams['education'] = User.educationToBackend(education);
      }
      if (district != null) {
        queryParams['location'] = district;
      }
      
      if (sort != null) {
        queryParams['sort'] = _sortOptionToBackend(sort);
      }

      final response = await _apiClient.get(
        ApiConstants.profiles,
        queryParameters: queryParams,
      );

      final data = response.data;
      final profiles = (data['profiles'] as List).map((p) {
        if (p is String) {
          return User.fromJson(jsonDecode(p));
        }
        return User.fromJson(p as Map<String, dynamic>);
      }).toList();
      
      final pagination = data['pagination'];
      
      return ProfilesResult(
        profiles: profiles,
        currentPage: pagination['currentPage'] ?? page,
        totalPages: pagination['totalPages'] ?? 1,
        hasNextPage: pagination['hasNextPage'] ?? false,
      );
    } catch (e) {
      throw Exception('Failed to get profiles: ${e.toString()}');
    }
  }

  @override
  Future<User> getProfileById(String id) async {
    try {
      final response = await _apiClient.get('${ApiConstants.profile}/$id');
      return User.fromJson(response.data);
    } catch (e) {
      throw Exception('Failed to get profile: ${e.toString()}');
    }
  }

  @override
  Future<void> expressInterest(String targetUserId) async {
    try {
      await _apiClient.post(
        ApiConstants.expressInterest,
        data: {'targetUserId': targetUserId},
      );
    } catch (e) {
      throw Exception('Failed to express interest: ${e.toString()}');
    }
  }

  @override
  Future<void> acceptInterest(String targetUserId) async {
    try {
      await _apiClient.post(
        ApiConstants.acceptInterest,
        data: {'targetUserId': targetUserId},
      );
    } catch (e) {
      throw Exception('Failed to accept interest: ${e.toString()}');
    }
  }

  @override
  Future<void> rejectInterest(String targetUserId) async {
    try {
      await _apiClient.post(
        ApiConstants.rejectInterest,
        data: {'targetUserId': targetUserId},
      );
    } catch (e) {
      throw Exception('Failed to reject interest: ${e.toString()}');
    }
  }

  @override
  Future<String> uploadProfilePhoto(String imagePath) async {
    try {
      final file = await MultipartFile.fromFile(
        imagePath,
        filename: imagePath.split('/').last,
      );
      final formData = FormData.fromMap({
        'photo': file,
      });
      final response = await _apiClient.uploadFilePut(
        ApiConstants.profilePhoto,
        formData,
      );
      return response.data['profile_photo'] ?? response.data['photo_url'] ?? '';
    } on DioException catch (e) {
      if (kDebugMode) {
        debugPrint('[User] Photo upload error: ${e.message}');
      }
      throw Exception('Failed to upload photo: ${e.message}');
    } catch (e) {
      throw Exception('Failed to upload photo: ${e.toString()}');
    }
  }

  String _sortOptionToBackend(SortOption sort) {
    switch (sort) {
      case SortOption.newest:
        return 'newest';
      case SortOption.oldest:
        return 'oldest';
      case SortOption.ageAsc:
        return 'age_asc';
      case SortOption.ageDesc:
        return 'age_desc';
    }
  }

  @override
  Future<List<ImpactCardModel>> getImpactCards() async {
    try {
      final response = await _apiClient.get('/users/impact-cards');
      
      final List<dynamic> data = response.data;
      if (kDebugMode) {
        debugPrint('[User] Impact Cards Raw Data: $data');
      }
      return data.map((json) => ImpactCardModel.fromJson(json)).toList();
    } catch (e) {
      // Return empty list instead of throwing to prevent app crash on home screen
      if (kDebugMode) {
        debugPrint('[User] Error fetching impact cards: $e');
      }
      return [];
    }
  }

  @override
  Future<List<MediaCardModel>> getMediaCards() async {
    try {
      final response = await _apiClient.get('/users/media-cards');
      
      final List<dynamic> data = response.data;
      if (kDebugMode) {
        debugPrint('[User] Media Cards Raw Data: $data');
      }
      return data.map((json) => MediaCardModel.fromJson(json)).toList();
    } catch (e) {
      if (kDebugMode) {
        debugPrint('[User] Error fetching media cards: $e');
      }
      return [];
    }
  }

  @override
  Future<List<AchievementCardModel>> getAchievementCards() async {
    try {
      final response = await _apiClient.get('/users/achievement-cards');
      final List<dynamic> data = response.data;
      return data.map((json) => AchievementCardModel.fromJson(json)).toList();
    } catch (e) {
      if (kDebugMode) debugPrint('[User] Error fetching achievements: $e');
      return [];
    }
  }

  @override
  Future<List<SuccessStoryModel>> getSuccessStories() async {
    try {
      final response = await _apiClient.get('/users/success-stories');
      final List<dynamic> data = response.data;
      return data.map((json) => SuccessStoryModel.fromJson(json)).toList();
    } catch (e) {
      if (kDebugMode) debugPrint('[User] Error fetching success stories: $e');
      return [];
    }
  }

  @override
  Future<List<EventModel>> getEvents() async {
    try {
      final response = await _apiClient.get('/users/events');
      final List<dynamic> data = response.data;
      // Filter out invalid events if necessary
      return data.map((json) => EventModel.fromJson(json)).toList();
    } catch (e) {
      if (kDebugMode) debugPrint('[User] Error fetching events: $e');
      return [];
    }
  }

  @override
  Future<List<User>> getMatches() async {
    try {
      final response = await _apiClient.get(ApiConstants.matches); 
      if (response.data is! List) {
        if (kDebugMode) {
          debugPrint('[User] Matches response is not a list: ${response.data.runtimeType}');
        }
        return [];
      }
      final List<dynamic> data = response.data;
      return data.map((json) => User.fromJson(json)).toList();
    } catch (e) {
      if (kDebugMode) {
        debugPrint('[User] Error fetching matches: $e');
      }
      throw Exception('Failed to fetch matches: ${e.toString()}');
    }
  }
  @override
  Future<void> reportUser({required String userId, required String reason, String? description}) async {
    try {
      await _apiClient.post(
        '/users/report',
        data: {
          'reportedUserId': userId,
          'reason': reason,
          'description': description,
        },
      );
    } catch (e) {
      if (kDebugMode) {
        debugPrint('[User] Error reporting user: $e');
      }
      throw Exception('Failed to report user: ${e.toString()}');
    }
  }

  @override
  Future<List<ProgramModel>> getPrograms() async {
    try {
      final response = await _apiClient.get(ApiConstants.programs);
      final List<dynamic> data = response.data;
      return data.map((json) => ProgramModel.fromJson(json)).toList();
    } catch (e) {
      if (kDebugMode) debugPrint('[User] Error fetching programs: $e');
      return [];
    }
  }

  @override
  Future<List<ProjectModel>> getProjects() async {
    try {
      final response = await _apiClient.get(ApiConstants.projects);
      final List<dynamic> data = response.data;
      return data.map((json) => ProjectModel.fromJson(json)).toList();
    } catch (e) {
      if (kDebugMode) debugPrint('[User] Error fetching projects: $e');
      return [];
    }
  }

  @override
  Future<ContactInfoModel> getContactInfo() async {
    try {
      final response = await _apiClient.get(ApiConstants.contactInfo);
      return ContactInfoModel.fromJson(response.data);
    } catch (e) {
      if (kDebugMode) debugPrint('[User] Error fetching contact info: $e');
      // Return defaults from AppConstants as fallback
      return ContactInfoModel(
        phone: AppConstants.phone,
        email: AppConstants.email,
        address: AppConstants.address,
        latitude: AppConstants.officeLatitude,
        longitude: AppConstants.officeLongitude,
        officeHours: [
          OfficeHourModel(day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM'),
          OfficeHourModel(day: 'Saturday', hours: '10:00 AM - 2:00 PM'),
          OfficeHourModel(day: 'Sunday', hours: 'Closed'),
        ],
      );
    }
  }

  @override
  Future<DonateInfoModel> getDonateInfo() async {
    try {
      final response = await _apiClient.get(ApiConstants.donateInfo);
      return DonateInfoModel.fromJson(response.data);
    } catch (e) {
      if (kDebugMode) debugPrint('[User] Error fetching donate info: $e');
      return DonateInfoModel(
        bankName: AppConstants.bankName,
        accountName: AppConstants.accountName,
        accountNumber: AppConstants.accountNumber,
        ifscCode: AppConstants.ifscCode,
        upiId: AppConstants.upiId,
        taxExemptionNote: '',
        headerTitle: 'Support Our Cause',
        headerSubtitle: 'Your contribution helps us create more meaningful connections',
      );
    }
  }

  @override
  Future<List<MilestoneModel>> getMilestones() async {
    try {
      final response = await _apiClient.get(ApiConstants.milestones);
      final List<dynamic> data = response.data;
      return data.map((json) => MilestoneModel.fromJson(json)).toList();
    } catch (e) {
      if (kDebugMode) debugPrint('[User] Error fetching milestones: $e');
      return [];
    }
  }

  @override
  Future<List<VolunteerRoleModel>> getVolunteerRoles() async {
    try {
      final response = await _apiClient.get(ApiConstants.volunteerRoles);
      final List<dynamic> data = response.data;
      return data.map((json) => VolunteerRoleModel.fromJson(json)).toList();
    } catch (e) {
      if (kDebugMode) debugPrint('[User] Error fetching volunteer roles: $e');
      return [];
    }
  }
}
