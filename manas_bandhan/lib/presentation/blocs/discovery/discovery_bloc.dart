import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

import '../../../data/models/user_model.dart';
import '../../../domain/repositories/user_repository.dart';

// Events
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
  final int page;
  final SortOption? sort;
  final int? limit;

  const LoadProfiles({
    this.ageFrom,
    this.ageTo,
    this.maritalStatus,
    this.education,
    this.district,
    this.page = 1,
    this.sort,
    this.limit,
  });

  @override
  List<Object?> get props => [ageFrom, ageTo, maritalStatus, education, district, page, sort, limit];
}

class LoadMoreProfiles extends DiscoveryEvent {}

class ExpressInterestEvent extends DiscoveryEvent {
  final String targetUserId;

  const ExpressInterestEvent({required this.targetUserId});

  @override
  List<Object?> get props => [targetUserId];
}

// States
abstract class DiscoveryState extends Equatable {
  final List<User> profiles;
  final int currentPage;
  final int totalPages;
  final bool hasMorePages;

  const DiscoveryState({
    this.profiles = const [],
    this.currentPage = 1,
    this.totalPages = 1,
    this.hasMorePages = true,
  });

  @override
  List<Object?> get props => [profiles, currentPage, totalPages, hasMorePages];
}

class DiscoveryInitial extends DiscoveryState {}

class DiscoveryLoading extends DiscoveryState {
  const DiscoveryLoading({
    super.profiles,
    super.currentPage,
    super.totalPages,
    super.hasMorePages,
  });
}

class DiscoveryLoaded extends DiscoveryState {
  const DiscoveryLoaded({
    required super.profiles,
    required super.currentPage,
    required super.totalPages,
    required super.hasMorePages,
  });
}

class DiscoveryError extends DiscoveryState {
  final String message;

  const DiscoveryError({required this.message, super.profiles});

  @override
  List<Object?> get props => [message, profiles];
}

class InterestExpressed extends DiscoveryState {
  final String targetUserId;

  const InterestExpressed({
    required this.targetUserId,
    required super.profiles,
    required super.currentPage,
    required super.totalPages,
    required super.hasMorePages,
  });

  @override
  List<Object?> get props => [targetUserId, profiles, currentPage, totalPages, hasMorePages];
}

// BLoC
class DiscoveryBloc extends Bloc<DiscoveryEvent, DiscoveryState> {
  final UserRepository _userRepository;
  
  int? _lastAgeFrom;
  int? _lastAgeTo;
  MaritalStatus? _lastMaritalStatus;
  Education? _lastEducation;
  String? _lastDistrict;
  SortOption? _lastSort;
  int? _lastLimit;

  DiscoveryBloc(this._userRepository) : super(DiscoveryInitial()) {
    on<LoadProfiles>(_onLoadProfiles);
    on<LoadMoreProfiles>(_onLoadMoreProfiles);
    on<ExpressInterestEvent>(_onExpressInterest);
  }

  Future<void> _onLoadProfiles(
    LoadProfiles event,
    Emitter<DiscoveryState> emit,
  ) async {
    emit(const DiscoveryLoading());
    
    _lastAgeFrom = event.ageFrom;
    _lastAgeTo = event.ageTo;
    _lastMaritalStatus = event.maritalStatus;
    _lastEducation = event.education;
    _lastDistrict = event.district;
    _lastSort = event.sort;
    _lastLimit = 10; // Default limit if not provided via event props (LoadProfiles doesn't have limit field in original code but was using event.limit?)
    // Ah, wait, LoadProfiles definition in event file I saw above DID NOT have limit. 
    // But discovery_bloc.dart line 22/31/35/139/149 showed `limit`.
    // My previous view of discovery_event.dart (Step 626) did NOT show limit. 
    // BUT discovery_bloc.dart (Step 625) Line 22: final int? limit; 
    // There is a mismatch between my view of discovery_event.dart and discovery_bloc.dart?
    // Wait, Step 626 showed `class LoadProfiles` lines 12-31. No `limit`.
    // Step 625 showed `class LoadProfiles` lines 15-36 WITH `limit`.
    // Oh, I see. `discovery_bloc.dart` contains the events at the top in the file I viewed? 
    // Ah, Step 625 viewed `discovery_bloc.dart` but the content shows `class LoadProfiles` at the top?
    // YES. `discovery_bloc.dart` file content I saw in Step 625 INCLUDED the events in the same file?
    // NO. Line 1 says `import 'package:flutter_bloc/flutter_bloc.dart';`.
    // Line 8 `abstract class DiscoveryEvent`.
    // So `discovery_bloc.dart` defines events internally?
    // BUT Step 626 viewed `discovery_event.dart`.
    // So there might be duplicate definitions or I misread the file path in Step 625 output?
    // Step 625 output says `File Path: .../discovery_bloc.dart`.
    // And it SHOWS `class LoadProfiles`.
    // Step 626 output says `File Path: .../discovery_event.dart`.
    // And it SHOWS `class LoadProfiles`.
    // This implies `discovery_bloc.dart` MIGHT HAVE COPY-PASTED EVENTS inside it (bad practice) OR I am misinterpreting.
    // Wait, look at imports in `discovery_bloc.dart`: It does NOT import `discovery_event.dart`.
    // It defines them.
    // BUT `discovery_event.dart` ALSO exists.
    // This is confusing.
    // `discovery_screen.dart` imports `discovery_bloc.dart`.
    // Does it import `discovery_event.dart`? No.
    // So `discovery_bloc.dart` IS the source of truth for events used by the Bloc?
    // Wait, if `DiscoveryBloc` class is in `discovery_bloc.dart`, and it uses `LoadProfiles`.
    // If `LoadProfiles` is defined in the same file, it uses that one.
    // If `discovery_event.dart` is unused, I should ignore it?
    // BUT `discovery_bloc.dart` content shows `part` or imports?
    // It does NOT show `part 'discovery_event.dart';`.
    // It defines `LoadProfiles` on line 15.
    
    // HOWEVER, I just edited `discovery_event.dart` in Step 634.
    // If `discovery_bloc.dart` defines its own events, then my edit to `discovery_event.dart` was useless or only affected files that import IT.
    // `discovery_screen.dart` imports `../../blocs/discovery/discovery_bloc.dart`.
    // Does it import `discovery_event.dart`?
    // Let's check imports of `discovery_screen.dart` (Step 584/622).
    // It imports `../../blocs/discovery/discovery_bloc.dart`.
    // It does NOT import `discovery_event.dart`.
    // So `discovery_screen.dart` uses the classes exported by `discovery_bloc.dart`.
    // WHICH ARE DEFINED IN `discovery_bloc.dart` according to Step 625 view.
    
    // SO, I MUST EDIT `discovery_bloc.dart` to add `education` to `LoadProfiles` class definition inside it, AND to the Bloc logic.
    // AND I should probably delete `discovery_event.dart` if it is unused/duplicate, but I won't touch it to avoid breaking unseen refs.
    
    // I will primarily edit `discovery_bloc.dart`.
    
    // Wait, is it possible `discovery_bloc.dart` output I saw was actually a concatenation of files? 
    // "The above content shows the entire, complete file contents".
    // It shows imports, then `abstract class DiscoveryEvent`.
    // Yes, it seems the events are defined in the bloc file in the user's project (or a copy-paste mess).
    // I will edit `discovery_bloc.dart`.

    _lastLimit = event.limit;

    try {
      final result = await _userRepository.getProfiles(
        ageFrom: event.ageFrom,
        ageTo: event.ageTo,
        maritalStatus: event.maritalStatus,
        education: event.education,
        district: event.district,
        page: event.page,
        sort: event.sort,
        limit: event.limit,
      );

      emit(DiscoveryLoaded(
        profiles: result.profiles,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasMorePages: result.hasNextPage,
      ));
    } catch (e) {
      emit(DiscoveryError(message: e.toString()));
    }
  }

  Future<void> _onLoadMoreProfiles(
    LoadMoreProfiles event,
    Emitter<DiscoveryState> emit,
  ) async {
    if (!state.hasMorePages || state is DiscoveryLoading) return;

    final currentProfiles = state.profiles;
    final nextPage = state.currentPage + 1;

    emit(DiscoveryLoading(
      profiles: currentProfiles,
      currentPage: state.currentPage,
      totalPages: state.totalPages,
      hasMorePages: state.hasMorePages,
    ));

    try {
      final result = await _userRepository.getProfiles(
        ageFrom: _lastAgeFrom,
        ageTo: _lastAgeTo,
        maritalStatus: _lastMaritalStatus,
        education: _lastEducation,
        district: _lastDistrict,
        page: nextPage,
        sort: _lastSort,
        limit: _lastLimit,
      );

      // Deduplicate based on content (Name + DOB + Gender)
      final existingKeys = currentProfiles.map((p) => _generateContentKey(p)).toSet();
      final List<User> newUniqueProfiles = [];

      for (var profile in result.profiles) {
        final key = _generateContentKey(profile);
        if (!existingKeys.contains(key)) {
          existingKeys.add(key);
          newUniqueProfiles.add(profile);
        }
      }

      emit(DiscoveryLoaded(
        profiles: [...currentProfiles, ...newUniqueProfiles],
        currentPage: nextPage,
        totalPages: result.totalPages,
        hasMorePages: result.hasNextPage,
      ));
    } catch (e) {
      emit(DiscoveryError(message: e.toString(), profiles: currentProfiles));
    }
  }

  String _generateContentKey(User user) {
    return "${user.fullName.toLowerCase()}|${user.dateOfBirth.toIso8601String()}|${user.gender.name}|${user.caste?.name ?? ''}";
  }

  Future<void> _onExpressInterest(
    ExpressInterestEvent event,
    Emitter<DiscoveryState> emit,
  ) async {
    try {
      await _userRepository.expressInterest(event.targetUserId);
      
      emit(InterestExpressed(
        targetUserId: event.targetUserId,
        profiles: state.profiles,
        currentPage: state.currentPage,
        totalPages: state.totalPages,
        hasMorePages: state.hasMorePages,
      ));
    } catch (e) {
      emit(DiscoveryError(message: e.toString(), profiles: state.profiles));
    }
  }
}
