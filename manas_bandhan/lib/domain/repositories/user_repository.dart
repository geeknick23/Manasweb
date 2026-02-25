import '../../data/models/user_model.dart';
import '../../data/models/home_models.dart';
import '../../data/models/app_content_models.dart';


enum SortOption { newest, oldest, ageAsc, ageDesc }

class ProfilesResult {
  final List<User> profiles;
  final int currentPage;
  final int totalPages;
  final bool hasNextPage;

  const ProfilesResult({
    required this.profiles,
    required this.currentPage,
    required this.totalPages,
    required this.hasNextPage,
  });
}

abstract class UserRepository {
  Future<User> getProfile();
  Future<User> updateProfile(Map<String, dynamic> data);
  Future<ProfilesResult> getProfiles({
    int? ageFrom,
    int? ageTo,
    MaritalStatus? maritalStatus,
    Education? education,
    String? district,
    int page,
    SortOption? sort,
    int? limit,
  });
  Future<User> getProfileById(String id);
  Future<void> expressInterest(String targetUserId);
  Future<List<ImpactCardModel>> getImpactCards();
  Future<List<MediaCardModel>> getMediaCards();
  Future<List<AchievementCardModel>> getAchievementCards();
  Future<List<SuccessStoryModel>> getSuccessStories();
  Future<List<EventModel>> getEvents();
  Future<void> acceptInterest(String targetUserId);
  Future<void> rejectInterest(String targetUserId);
  Future<String> uploadProfilePhoto(String imagePath);
  Future<List<User>> getMatches();
  Future<void> reportUser({required String userId, required String reason, String? description});
  Future<List<ProgramModel>> getPrograms();
  Future<List<ProjectModel>> getProjects();
  Future<ContactInfoModel> getContactInfo();
  Future<DonateInfoModel> getDonateInfo();
  Future<List<MilestoneModel>> getMilestones();
  Future<List<VolunteerRoleModel>> getVolunteerRoles();
}
