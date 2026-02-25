import 'package:equatable/equatable.dart';
import '../../../data/models/user_model.dart';

abstract class DiscoveryState extends Equatable {
  final List<User> profiles;
  final int currentPage;
  final bool hasMorePages;

  const DiscoveryState({
    this.profiles = const [],
    this.currentPage = 1,
    this.hasMorePages = true,
  });

  @override
  List<Object?> get props => [profiles, currentPage, hasMorePages];
}

class DiscoveryInitial extends DiscoveryState {}

class DiscoveryLoading extends DiscoveryState {
  const DiscoveryLoading({
    super.profiles,
    super.currentPage,
    super.hasMorePages,
  });
}

class DiscoveryLoaded extends DiscoveryState {
  const DiscoveryLoaded({
    required List<User> profiles,
    required int currentPage,
    required bool hasMorePages,
  }) : super(
          profiles: profiles,
          currentPage: currentPage,
          hasMorePages: hasMorePages,
        );
}

class DiscoveryError extends DiscoveryState {
  final String message;

  const DiscoveryError({
    required this.message,
    super.profiles,
    super.currentPage,
    super.hasMorePages,
  });

  @override
  List<Object?> get props => [message, ...super.props];
}

class InterestExpressed extends DiscoveryState {
  final String targetUserId;

  const InterestExpressed({
    required this.targetUserId,
    required List<User> profiles,
    required int currentPage,
    required bool hasMorePages,
  }) : super(
          profiles: profiles,
          currentPage: currentPage,
          hasMorePages: hasMorePages,
        );

  @override
  List<Object?> get props => [targetUserId, ...super.props];
}
