abstract class ContentRepository {
  Future<List<dynamic>> getImpactCards();
  Future<List<dynamic>> getAchievementCards();
  Future<List<dynamic>> getSuccessStories();
  Future<List<dynamic>> getMediaCards();
  Future<List<dynamic>> getEvents();
  Future<void> submitContactForm(Map<String, dynamic> data);
  Future<void> registerVolunteer(Map<String, dynamic> data);
}
