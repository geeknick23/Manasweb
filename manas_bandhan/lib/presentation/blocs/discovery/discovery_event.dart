import 'package:equatable/equatable.dart';
import '../../../domain/repositories/user_repository.dart';
import '../../../data/models/user_model.dart';

abstract class DiscoveryEvent extends Equatable {
  const DiscoveryEvent();

  @override
  List<Object?> get props => [];
}

class LoadProfiles extends DiscoveryEvent {
  final int? ageFrom;
  final int? ageTo;
  final MaritalStatus? maritalStatus;
  final Education? education;
  final String? district;
  final SortOption? sort;
  final int page;

  const LoadProfiles({
    this.ageFrom,
    this.ageTo,
    this.maritalStatus,
    this.education,
    this.district,
    this.sort,
    this.page = 1,
  });

  @override
  List<Object?> get props => [ageFrom, ageTo, maritalStatus, education, district, sort, page];
}

class LoadMoreProfiles extends DiscoveryEvent {}

class ExpressInterestEvent extends DiscoveryEvent {
  final String targetUserId;

  const ExpressInterestEvent({required this.targetUserId});

  @override
  List<Object?> get props => [targetUserId];
}

class LoadDemoProfiles extends DiscoveryEvent {}
