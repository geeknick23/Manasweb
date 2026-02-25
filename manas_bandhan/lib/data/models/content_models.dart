import 'package:equatable/equatable.dart';

class ImpactCard extends Equatable {
  final int id;
  final String title;
  final String description;
  final String imageUrl;
  final String detailedDescription;

  const ImpactCard({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.detailedDescription,
  });

  factory ImpactCard.fromJson(Map<String, dynamic> json) {
    return ImpactCard(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      detailedDescription: json['detailedDescription'] ?? '',
    );
  }

  @override
  List<Object?> get props => [id, title, description, imageUrl, detailedDescription];
}

class SuccessStory extends Equatable {
  final int id;
  final String quote;
  final String author;
  final String location;

  const SuccessStory({
    required this.id,
    required this.quote,
    required this.author,
    required this.location,
  });

  factory SuccessStory.fromJson(Map<String, dynamic> json) {
    return SuccessStory(
      id: json['id'] ?? 0,
      quote: json['quote'] ?? '',
      author: json['author'] ?? '',
      location: json['location'] ?? '',
    );
  }

  @override
  List<Object?> get props => [id, quote, author, location];
}

class MediaCard extends Equatable {
  final int id;
  final String title;
  final String date;
  final String source;
  final String description;
  final String imageUrl;

  const MediaCard({
    required this.id,
    required this.title,
    required this.date,
    required this.source,
    required this.description,
    required this.imageUrl,
  });

  factory MediaCard.fromJson(Map<String, dynamic> json) {
    return MediaCard(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      date: json['date'] ?? '',
      source: json['source'] ?? '',
      description: json['description'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
    );
  }

  @override
  List<Object?> get props => [id, title, date, source, description, imageUrl];
}

class AchievementCard extends Equatable {
  final int id;
  final String title;
  final String count;
  final String description;

  const AchievementCard({
    required this.id,
    required this.title,
    required this.count,
    required this.description,
  });

  factory AchievementCard.fromJson(Map<String, dynamic> json) {
    return AchievementCard(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      count: json['count']?.toString() ?? '0',
      description: json['description'] ?? '',
    );
  }

  @override
  List<Object?> get props => [id, title, count, description];
}
