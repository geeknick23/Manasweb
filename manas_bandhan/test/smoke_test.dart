import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:get_it/get_it.dart';
import 'package:mocktail/mocktail.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:manas_bandhan/app.dart';
import 'package:manas_bandhan/core/di/injection_container.dart' as di;
import 'package:manas_bandhan/presentation/blocs/auth/auth_bloc.dart';
import 'package:manas_bandhan/presentation/blocs/locale/locale_cubit.dart';
import 'package:manas_bandhan/presentation/blocs/discovery/discovery_bloc.dart';
import 'package:manas_bandhan/presentation/blocs/profile/profile_bloc.dart';
import 'package:manas_bandhan/presentation/blocs/interests/interests_bloc.dart';
import 'package:manas_bandhan/presentation/blocs/content/content_bloc.dart';
import 'package:manas_bandhan/presentation/blocs/home/home_bloc.dart';
import 'package:manas_bandhan/domain/repositories/chat_repository.dart';
import 'package:manas_bandhan/data/models/chat_message_model.dart';
import 'package:manas_bandhan/data/services/notification_service.dart';

// Mocks
class MockAuthBloc extends Mock implements AuthBloc {}
class MockLocaleCubit extends Mock implements LocaleCubit {}
class MockDiscoveryBloc extends Mock implements DiscoveryBloc {}
class MockProfileBloc extends Mock implements ProfileBloc {}
class MockInterestsBloc extends Mock implements InterestsBloc {}
class MockContentBloc extends Mock implements ContentBloc {}
class MockHomeBloc extends Mock implements HomeBloc {}
class MockChatRepository extends Mock implements ChatRepository {}
class MockSharedPreferences extends Mock implements SharedPreferences {}
class MockNotificationService extends Mock implements NotificationService {}

// Fake States
class FakeAuthEvent extends Fake implements AuthEvent {}
class FakeAuthState extends Fake implements AuthState {}
class FakeLocale extends Fake implements Locale {}
class FakeDiscoveryEvent extends Fake implements DiscoveryEvent {}
class FakeDiscoveryState extends Fake implements DiscoveryState {}
class FakeProfileEvent extends Fake implements ProfileEvent {}
class FakeProfileState extends Fake implements ProfileState {}
class FakeInterestsEvent extends Fake implements InterestsEvent {}
class FakeInterestsState extends Fake implements InterestsState {}
class FakeContentEvent extends Fake implements ContentEvent {}
class FakeContentState extends Fake implements ContentState {}
class FakeHomeEvent extends Fake implements HomeEvent {}
class FakeHomeState extends Fake implements HomeState {}

void main() {
  setUpAll(() {
    registerFallbackValue(FakeAuthEvent());
    registerFallbackValue(FakeAuthState());
    registerFallbackValue(FakeLocale());
    registerFallbackValue(FakeDiscoveryEvent());
    registerFallbackValue(FakeDiscoveryState());
    registerFallbackValue(FakeProfileEvent());
    registerFallbackValue(FakeProfileState());
    registerFallbackValue(FakeInterestsEvent());
    registerFallbackValue(FakeInterestsState());
    registerFallbackValue(FakeContentEvent());
    registerFallbackValue(FakeContentState());
    registerFallbackValue(FakeHomeEvent());
    registerFallbackValue(FakeHomeState());
  });

  tearDown(() {
    di.sl.reset();
  });

  testWidgets('Smoke Test: App renders without exploding', (WidgetTester tester) async {
    // 1. Setup DI Mocks
    final mockAuthBloc = MockAuthBloc();
    final mockLocaleCubit = MockLocaleCubit();
    final mockDiscoveryBloc = MockDiscoveryBloc();
    final mockProfileBloc = MockProfileBloc();
    final mockInterestsBloc = MockInterestsBloc();
    final mockContentBloc = MockContentBloc();
    final mockHomeBloc = MockHomeBloc();
    final mockChatRepository = MockChatRepository();
    final mockSharedPreferences = MockSharedPreferences();
    final mockNotificationService = MockNotificationService();

    // Register mocks
    di.sl.registerFactory<AuthBloc>(() => mockAuthBloc);
    di.sl.registerFactory<LocaleCubit>(() => mockLocaleCubit);
    di.sl.registerFactory<DiscoveryBloc>(() => mockDiscoveryBloc);
    di.sl.registerFactory<ProfileBloc>(() => mockProfileBloc);
    di.sl.registerFactory<InterestsBloc>(() => mockInterestsBloc);
    di.sl.registerFactory<ContentBloc>(() => mockContentBloc);
    di.sl.registerFactory<HomeBloc>(() => mockHomeBloc);
    di.sl.registerFactory<ChatRepository>(() => mockChatRepository);
    di.sl.registerFactory<SharedPreferences>(() => mockSharedPreferences);
    di.sl.registerFactory<NotificationService>(() => mockNotificationService);

    // 2. Stub BLoC Streams and States
    when(() => mockAuthBloc.stream).thenAnswer((_) => Stream.value(AuthInitial()));
    when(() => mockAuthBloc.state).thenReturn(AuthInitial());
    when(() => mockAuthBloc.close()).thenAnswer((_) async {});
    when(() => mockAuthBloc.add(any())).thenReturn(null);

    when(() => mockLocaleCubit.stream).thenAnswer((_) => Stream.value(const Locale('en', 'US')));
    when(() => mockLocaleCubit.state).thenReturn(const Locale('en', 'US'));
    when(() => mockLocaleCubit.close()).thenAnswer((_) async {});

    when(() => mockDiscoveryBloc.stream).thenAnswer((_) => Stream.value(DiscoveryInitial()));
    when(() => mockDiscoveryBloc.state).thenReturn(DiscoveryInitial());
    when(() => mockDiscoveryBloc.close()).thenAnswer((_) async {});

    when(() => mockProfileBloc.stream).thenAnswer((_) => Stream.value(ProfileInitial()));
    when(() => mockProfileBloc.state).thenReturn(ProfileInitial());
    when(() => mockProfileBloc.close()).thenAnswer((_) async {});

    when(() => mockInterestsBloc.stream).thenAnswer((_) => Stream.value(InterestsInitial()));
    when(() => mockInterestsBloc.state).thenReturn(InterestsInitial());
    when(() => mockInterestsBloc.close()).thenAnswer((_) async {});

    when(() => mockContentBloc.stream).thenAnswer((_) => Stream.value(ContentInitial()));
    when(() => mockContentBloc.state).thenReturn(ContentInitial());
    when(() => mockContentBloc.close()).thenAnswer((_) async {});
    when(() => mockContentBloc.add(any())).thenReturn(null);

    when(() => mockHomeBloc.stream).thenAnswer((_) => Stream.value(HomeInitial()));
    when(() => mockHomeBloc.state).thenReturn(HomeInitial());
    when(() => mockHomeBloc.close()).thenAnswer((_) async {});
    when(() => mockHomeBloc.add(any())).thenReturn(null);
    
    // Stub Repositories
    when(() => mockChatRepository.disconnect()).thenAnswer((_) async {});
    
    // 3. Pump Widget
    await tester.pumpWidget(const ManasBandhanApp());
    await tester.pump(); // Allow microtasks to complete

    // 4. Verify
    expect(find.byType(MaterialApp), findsOneWidget);
    // Should show Splash Screen initially
    // Check for title or something generic
    expect(find.text('Manas Bandhan'), findsOneWidget); // Title in MaterialApp context typically isn't found by text unless used in UI
    
    // Check if initial route is Splash (assuming splash screen has some specific widget)
    // For now, just confirming it pumped without error is checking for MaterialApp or a Container
  });
}
