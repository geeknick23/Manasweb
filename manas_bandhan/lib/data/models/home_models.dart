
class ImpactCardModel {
  final int id;
  final String title;
  final String description;
  final String imageUrl;
  final String? detailedDescription;

  ImpactCardModel({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    this.detailedDescription,
  });

  factory ImpactCardModel.fromJson(Map<String, dynamic> json) {
    return ImpactCardModel(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      detailedDescription: json['detailedDescription'],
    );
  }
}

class MediaCardModel {
  final int id;
  final String title;
  final String date;
  final String source;
  final String description;
  final String imageUrl;
  final String? detailedDescription;
  final String? articleUrl;

  MediaCardModel({
    required this.id,
    required this.title,
    required this.date,
    required this.source,
    required this.description,
    required this.imageUrl,
    this.detailedDescription,
    this.articleUrl,
  });

  factory MediaCardModel.fromJson(Map<String, dynamic> json) {
    return MediaCardModel(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      date: json['date'] ?? '',
      source: json['source'] ?? '',
      description: json['description'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      detailedDescription: json['detailedDescription'],
      articleUrl: json['articleUrl'],
    );
  }
}

class AchievementCardModel {
  final int id;
  final String icon;
  final String number;
  final String title;
  final String description;

  AchievementCardModel({
    required this.id,
    required this.icon,
    required this.number,
    required this.title,
    required this.description,
  });

  factory AchievementCardModel.fromJson(Map<String, dynamic> json) {
    return AchievementCardModel(
      id: json['id'] ?? 0,
      icon: json['icon'] ?? '',
      number: json['number'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
    );
  }
}

class SuccessStoryModel {
  final int id;
  final String quote;
  final String author;
  final String location;

  SuccessStoryModel({
    required this.id,
    required this.quote,
    required this.author,
    required this.location,
  });

  factory SuccessStoryModel.fromJson(Map<String, dynamic> json) {
    return SuccessStoryModel(
      id: json['id'] ?? 0,
      quote: json['quote'] ?? '',
      author: json['author'] ?? '',
      location: json['location'] ?? '',
    );
  }
}

class EventModel {
  final String id;
  final String title;
  final String date;
  final String startTime;
  final String endTime;
  final String location;
  final String description;
  final String month;
  final String day;
  final String registerLink;

  EventModel({
    required this.id,
    required this.title,
    required this.date,
    required this.startTime,
    required this.endTime,
    required this.location,
    required this.description,
    required this.month,
    required this.day,
    required this.registerLink,
  });

  factory EventModel.fromJson(Map<String, dynamic> json) {
    return EventModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      date: json['date']?.toString() ?? '',
      startTime: json['startTime'] ?? '',
      endTime: json['endTime'] ?? '',
      location: json['location'] ?? '',
      description: json['description'] ?? '',
      month: json['month'] ?? '',
      day: json['day'] ?? '',
      registerLink: json['registerLink'] ?? '',
    );
  }
}
