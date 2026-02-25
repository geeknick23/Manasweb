import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../data/datasources/api_client.dart';
import '../../data/datasources/local_datasource.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../data/repositories/user_repository_impl.dart';
import '../../data/repositories/content_repository_impl.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/repositories/user_repository.dart';
import '../../domain/repositories/content_repository.dart';
import '../../presentation/blocs/auth/auth_bloc.dart';
import '../../presentation/blocs/locale/locale_cubit.dart';
import '../../presentation/blocs/profile/profile_bloc.dart';
import '../../presentation/blocs/discovery/discovery_bloc.dart';
import '../../presentation/blocs/interests/interests_bloc.dart';
import '../../presentation/blocs/content/content_bloc.dart';
import '../../presentation/blocs/home/home_bloc.dart';
import '../../presentation/blocs/chat/chat_bloc.dart';
import '../../presentation/blocs/matches/matches_bloc.dart';
import '../../data/services/chat_service.dart';
import '../../data/repositories/chat_repository_impl.dart';
import '../../domain/repositories/chat_repository.dart';
import '../../data/services/notification_service.dart';


final sl = GetIt.instance;

Future<void> init() async {
  //! External
  final sharedPreferences = await SharedPreferences.getInstance();
  sl.registerLazySingleton(() => sharedPreferences);

  //! Data sources
  sl.registerLazySingleton(() => ApiClient(sl()));
  sl.registerLazySingleton(() => LocalDataSource(sl()));

  //! Repositories
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(sl(), sl()),
  );
  sl.registerLazySingleton<UserRepository>(
    () => UserRepositoryImpl(sl(), sl()),
  );
  sl.registerLazySingleton<ContentRepository>(
    () => ContentRepositoryImpl(sl()),
  );
  sl.registerLazySingleton<ChatRepository>(
    () => ChatRepositoryImpl(sl(), sl(), sl(), sl()),
  );

  //! Services
  sl.registerLazySingleton(() => ChatService());
  sl.registerLazySingleton(() => NotificationService());

  //! BLoCs
  sl.registerFactory(() => AuthBloc(sl(), sl()));
  sl.registerFactory(() => LocaleCubit(sl()));
  sl.registerFactory(() => ProfileBloc(sl()));
  sl.registerFactory(() => DiscoveryBloc(sl()));
  sl.registerFactory(() => InterestsBloc(sl()));
  sl.registerFactory(() => ContentBloc(sl()));
  sl.registerFactory(() => HomeBloc(sl()));
  sl.registerFactory(() => ChatBloc(sl()));
  sl.registerFactory(() => MatchesBloc(sl()));
}
