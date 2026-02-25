import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../data/models/content_models.dart';
import '../../../domain/repositories/content_repository.dart';

// Events
abstract class ContentEvent extends Equatable {
  const ContentEvent();

  @override
  List<Object?> get props => [];
}

class LoadContent extends ContentEvent {}

// States
abstract class ContentState extends Equatable {
  const ContentState();

  @override
  List<Object?> get props => [];
}

class ContentInitial extends ContentState {}

class ContentLoading extends ContentState {}

class ContentLoaded extends ContentState {
  final List<ImpactCard> impactCards;
  final List<AchievementCard> achievementCards;
  final List<SuccessStory> successStories;
  final List<MediaCard> mediaCards;

  const ContentLoaded({
    this.impactCards = const [],
    this.achievementCards = const [],
    this.successStories = const [],
    this.mediaCards = const [],
  });

  @override
  List<Object?> get props => [impactCards, achievementCards, successStories, mediaCards];
}

class ContentError extends ContentState {
  final String message;

  const ContentError({required this.message});

  @override
  List<Object?> get props => [message];
}

// BLoC
class ContentBloc extends Bloc<ContentEvent, ContentState> {
  final ContentRepository _contentRepository;

  ContentBloc(this._contentRepository) : super(ContentInitial()) {
    on<LoadContent>(_onLoadContent);
  }

  Future<void> _onLoadContent(
    LoadContent event,
    Emitter<ContentState> emit,
  ) async {
    emit(ContentLoading());
    try {
      // Fetch all content in parallel
      final results = await Future.wait([
        _contentRepository.getImpactCards(),
        _contentRepository.getAchievementCards(),
        _contentRepository.getSuccessStories(),
        _contentRepository.getMediaCards(),
      ]);

      final impactCards = (results[0] as List)
          .map((e) => ImpactCard.fromJson(e as Map<String, dynamic>))
          .toList();
      final achievementCards = (results[1] as List)
          .map((e) => AchievementCard.fromJson(e as Map<String, dynamic>))
          .toList();
      final successStories = (results[2] as List)
          .map((e) => SuccessStory.fromJson(e as Map<String, dynamic>))
          .toList();
      final mediaCards = (results[3] as List)
          .map((e) => MediaCard.fromJson(e as Map<String, dynamic>))
          .toList();

      emit(ContentLoaded(
        impactCards: impactCards,
        achievementCards: achievementCards,
        successStories: successStories,
        mediaCards: mediaCards,
      ));
    } catch (e) {
      emit(ContentError(message: e.toString()));
    }
  }
}
