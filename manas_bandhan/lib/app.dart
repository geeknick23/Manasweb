import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'main.dart' show navigatorKey;
import 'core/theme/app_theme.dart';
import 'core/l10n/app_localizations.dart';
import 'presentation/blocs/auth/auth_bloc.dart';
import 'presentation/blocs/locale/locale_cubit.dart';
import 'presentation/blocs/discovery/discovery_bloc.dart';
import 'presentation/blocs/profile/profile_bloc.dart';
import 'presentation/blocs/interests/interests_bloc.dart';
import 'presentation/blocs/content/content_bloc.dart';
import 'presentation/blocs/home/home_bloc.dart';

import 'presentation/routes/app_router.dart';
import 'core/di/injection_container.dart' as di;
import 'domain/repositories/chat_repository.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'core/constants/constants.dart';

class ManasBandhanApp extends StatelessWidget {
  const ManasBandhanApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => di.sl<AuthBloc>()..add(CheckAuthStatus())),
        BlocProvider(create: (_) => di.sl<LocaleCubit>()),
        BlocProvider(create: (_) => di.sl<DiscoveryBloc>()),
        BlocProvider(create: (_) => di.sl<ProfileBloc>()),
        BlocProvider(create: (_) => di.sl<InterestsBloc>()),
        BlocProvider(create: (_) => di.sl<ContentBloc>()..add(LoadContent())),
        BlocProvider(create: (_) => di.sl<HomeBloc>()..add(LoadHomeData())),
      ],
      child: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) async {
          if (state is Authenticated) {
            // Connect to chat socket when user is authenticated
            final prefs = await di.sl<SharedPreferences>();
            final token = prefs.getString(AppConstants.tokenKey);
            if (token != null) {
              di.sl<ChatRepository>().connect(token);
            }
          } else if (state is Unauthenticated) {
            // Disconnect when logout
            di.sl<ChatRepository>().disconnect();
            // Navigate to login page
            navigatorKey.currentState?.pushNamedAndRemoveUntil(
              AppRouter.login,
              (route) => false,
            );
          }
        },
        child: BlocBuilder<LocaleCubit, Locale>(
          builder: (context, locale) {
            return MaterialApp(
              title: 'Manas Bandhan',
              debugShowCheckedModeBanner: false,
              navigatorKey: navigatorKey,
              
              // Theme
              theme: AppTheme.lightTheme,
              darkTheme: AppTheme.darkTheme,
              themeMode: ThemeMode.light,
              
              // Localization
              locale: locale,
              supportedLocales: const [
                Locale('en', 'US'),
                Locale('mr', 'IN'),
              ],
              localizationsDelegates: const [
                AppLocalizations.delegate,
                GlobalMaterialLocalizations.delegate,
                GlobalWidgetsLocalizations.delegate,
                GlobalCupertinoLocalizations.delegate,
              ],
              
              // Routing
              onGenerateRoute: AppRouter.onGenerateRoute,
              initialRoute: AppRouter.splash,
            );
          },
        ),
      ),
    );
  }
}
