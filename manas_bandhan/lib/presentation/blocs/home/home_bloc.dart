import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../data/models/home_models.dart';
import '../../../domain/repositories/user_repository.dart';

// Events
abstract class HomeEvent extends Equatable {
  const HomeEvent();

  @override
  List<Object?> get props => [];
}

class LoadHomeData extends HomeEvent {}

// States
abstract class HomeState extends Equatable {
  const HomeState();

  @override
  List<Object?> get props => [];
}

class HomeInitial extends HomeState {}

class HomeLoading extends HomeState {}

class HomeLoaded extends HomeState {
  final List<ImpactCardModel> impactCards;
  final List<MediaCardModel> mediaCards;
  final List<AchievementCardModel> achievementCards;
  final List<SuccessStoryModel> successStories;
  final List<EventModel> events;

  const HomeLoaded({
    required this.impactCards,
    required this.mediaCards,
    required this.achievementCards,
    required this.successStories,
    required this.events,
  });

  @override
  List<Object?> get props => [impactCards, mediaCards, achievementCards, successStories, events];
}

class HomeError extends HomeState {
  final String message;

  const HomeError(this.message);

  @override
  List<Object?> get props => [message];
}

// BLoC
class HomeBloc extends Bloc<HomeEvent, HomeState> {
  final UserRepository _userRepository;

  HomeBloc(this._userRepository) : super(HomeInitial()) {
    on<LoadHomeData>(_onLoadHomeData);
  }

  Future<void> _onLoadHomeData(
    LoadHomeData event,
    Emitter<HomeState> emit,
  ) async {
    emit(HomeLoading());
    try {
      final results = await Future.wait([
        _userRepository.getImpactCards(),
        _userRepository.getMediaCards(),
        _userRepository.getAchievementCards(),
        _userRepository.getSuccessStories(),
        _userRepository.getEvents(),
      ]);

      emit(HomeLoaded(
        impactCards: results[0] as List<ImpactCardModel>,
        mediaCards: results[1] as List<MediaCardModel>,
        achievementCards: results[2] as List<AchievementCardModel>,
        successStories: results[3] as List<SuccessStoryModel>,
        events: results[4] as List<EventModel>,
      ));
    } catch (e) {
      emit(HomeError(e.toString()));
    }
  }
}
