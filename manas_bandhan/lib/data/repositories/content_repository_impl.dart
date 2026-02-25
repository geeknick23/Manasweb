import '../../core/constants/constants.dart';
import '../../domain/repositories/content_repository.dart';
import '../datasources/api_client.dart';

class ContentRepositoryImpl implements ContentRepository {
  final ApiClient _apiClient;

  ContentRepositoryImpl(this._apiClient);

  @override
  Future<List<dynamic>> getImpactCards() async {
    try {
      final response = await _apiClient.get(ApiConstants.impactCards);
      return response.data as List;
    } catch (e) {
      throw Exception('Failed to get impact cards: ${e.toString()}');
    }
  }

  @override
  Future<List<dynamic>> getAchievementCards() async {
    try {
      final response = await _apiClient.get(ApiConstants.achievementCards);
      return response.data as List;
    } catch (e) {
      throw Exception('Failed to get achievement cards: ${e.toString()}');
    }
  }

  @override
  Future<List<dynamic>> getSuccessStories() async {
    try {
      final response = await _apiClient.get(ApiConstants.successStories);
      return response.data as List;
    } catch (e) {
      throw Exception('Failed to get success stories: ${e.toString()}');
    }
  }

  @override
  Future<List<dynamic>> getMediaCards() async {
    try {
      final response = await _apiClient.get(ApiConstants.mediaCards);
      return response.data as List;
    } catch (e) {
      throw Exception('Failed to get media cards: ${e.toString()}');
    }
  }

  @override
  Future<List<dynamic>> getEvents() async {
    try {
      final response = await _apiClient.get(ApiConstants.events);
      return response.data as List;
    } catch (e) {
      throw Exception('Failed to get events: ${e.toString()}');
    }
  }

  @override
  Future<void> submitContactForm(Map<String, dynamic> data) async {
    try {
      await _apiClient.post(ApiConstants.contact, data: data);
    } catch (e) {
      throw Exception('Failed to submit contact form: ${e.toString()}');
    }
  }

  @override
  Future<void> registerVolunteer(Map<String, dynamic> data) async {
    try {
      await _apiClient.post(ApiConstants.volunteer, data: data);
    } catch (e) {
      throw Exception('Failed to register volunteer: ${e.toString()}');
    }
  }
}
