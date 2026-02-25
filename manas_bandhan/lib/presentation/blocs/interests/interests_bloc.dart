import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

import '../../../data/models/user_model.dart';
import '../../../domain/repositories/user_repository.dart';

// Events
abstract class InterestsEvent extends Equatable {
  const InterestsEvent();

  @override
  List<Object?> get props => [];
}

class LoadInterests extends InterestsEvent {}

class AcceptInterestEvent extends InterestsEvent {
  final String userId;

  const AcceptInterestEvent({required this.userId});

  @override
  List<Object?> get props => [userId];
}

class RejectInterestEvent extends InterestsEvent {
  final String userId;

  const RejectInterestEvent({required this.userId});

  @override
  List<Object?> get props => [userId];
}

// States
abstract class InterestsState extends Equatable {
  final List<Interest> receivedInterests;
  final List<Interest> sentInterests;

  const InterestsState({
    this.receivedInterests = const [],
    this.sentInterests = const [],
  });

  @override
  List<Object?> get props => [receivedInterests, sentInterests];
}

class InterestsInitial extends InterestsState {}

class InterestsLoading extends InterestsState {
  const InterestsLoading({super.receivedInterests, super.sentInterests});
}

class InterestsLoaded extends InterestsState {
  const InterestsLoaded({
    required super.receivedInterests,
    required super.sentInterests,
  });
}

class InterestsError extends InterestsState {
  final String message;

  const InterestsError({
    required this.message,
    super.receivedInterests,
    super.sentInterests,
  });

  @override
  List<Object?> get props => [message, receivedInterests, sentInterests];
}

class InterestActionSuccess extends InterestsState {
  final String message;

  const InterestActionSuccess({
    required this.message,
    required super.receivedInterests,
    required super.sentInterests,
  });

  @override
  List<Object?> get props => [message, receivedInterests, sentInterests];
}

// BLoC
class InterestsBloc extends Bloc<InterestsEvent, InterestsState> {
  final UserRepository _userRepository;

  InterestsBloc(this._userRepository) : super(InterestsInitial()) {
    on<LoadInterests>(_onLoadInterests);
    on<AcceptInterestEvent>(_onAcceptInterest);
    on<RejectInterestEvent>(_onRejectInterest);
  }

  Future<void> _onLoadInterests(
    LoadInterests event,
    Emitter<InterestsState> emit,
  ) async {
    emit(const InterestsLoading());

    try {
      // Get user's profile which includes interests
      final user = await _userRepository.getProfile();
      
      emit(InterestsLoaded(
        receivedInterests: user.receivedInterests ?? [],
        sentInterests: user.expressedInterests ?? [],
      ));
    } catch (e) {
      emit(InterestsError(message: e.toString()));
    }
  }

  Future<void> _onAcceptInterest(
    AcceptInterestEvent event,
    Emitter<InterestsState> emit,
  ) async {
    try {
      await _userRepository.acceptInterest(event.userId);
      
      // Update local state
      final updatedReceived = state.receivedInterests.map((interest) {
        if (interest.user.id == event.userId) {
          return Interest(
            user: interest.user,
            sentAt: interest.sentAt,
            status: InterestStatus.accepted,
          );
        }
        return interest;
      }).toList();

      emit(InterestActionSuccess(
        message: 'Interest accepted! You can now view contact details.',
        receivedInterests: updatedReceived,
        sentInterests: state.sentInterests,
      ));
    } catch (e) {
      emit(InterestsError(
        message: e.toString(),
        receivedInterests: state.receivedInterests,
        sentInterests: state.sentInterests,
      ));
    }
  }

  Future<void> _onRejectInterest(
    RejectInterestEvent event,
    Emitter<InterestsState> emit,
  ) async {
    try {
      await _userRepository.rejectInterest(event.userId);
      
      // Update local state
      final updatedReceived = state.receivedInterests.map((interest) {
        if (interest.user.id == event.userId) {
          return Interest(
            user: interest.user,
            sentAt: interest.sentAt,
            status: InterestStatus.rejected,
          );
        }
        return interest;
      }).toList();

      emit(InterestActionSuccess(
        message: 'Interest declined.',
        receivedInterests: updatedReceived,
        sentInterests: state.sentInterests,
      ));
    } catch (e) {
      emit(InterestsError(
        message: e.toString(),
        receivedInterests: state.receivedInterests,
        sentInterests: state.sentInterests,
      ));
    }
  }
}
