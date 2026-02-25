import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../data/models/user_model.dart';
import '../../../domain/repositories/user_repository.dart';

// Events
abstract class MatchesEvent extends Equatable {
  const MatchesEvent();
  @override
  List<Object> get props => [];
}

class LoadMatches extends MatchesEvent {}

// States
abstract class MatchesState extends Equatable {
  const MatchesState();
  @override
  List<Object> get props => [];
}

class MatchesInitial extends MatchesState {}

class MatchesLoading extends MatchesState {}

class MatchesLoaded extends MatchesState {
  final List<User> matches;
  const MatchesLoaded(this.matches);
  @override
  List<Object> get props => [matches];
}

class MatchesError extends MatchesState {
  final String message;
  const MatchesError(this.message);
  @override
  List<Object> get props => [message];
}

// Bloc
class MatchesBloc extends Bloc<MatchesEvent, MatchesState> {
  final UserRepository _userRepository;

  MatchesBloc(this._userRepository) : super(MatchesInitial()) {
    on<LoadMatches>(_onLoadMatches);
  }

  Future<void> _onLoadMatches(LoadMatches event, Emitter<MatchesState> emit) async {
    emit(MatchesLoading());
    try {
      final matches = await _userRepository.getMatches();
      emit(MatchesLoaded(matches));
    } catch (e) {
      emit(MatchesError(e.toString()));
    }
  }
}
