import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/theme/app_theme.dart';
import '../../routes/app_router.dart';
import '../../blocs/matches/matches_bloc.dart';
import '../../../core/di/injection_container.dart' as di;
import '../../../core/constants/constants.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../blocs/locale/locale_cubit.dart';

class MatchesScreen extends StatelessWidget {
  const MatchesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    context.watch<LocaleCubit>();
    final loc = AppLocalizations.of(context);
    return BlocProvider(
      create: (context) => di.sl<MatchesBloc>()..add(LoadMatches()),
      child: Scaffold(
        appBar: AppBar(
          title: Text(loc.get('yourMatches')),
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: () => context.read<MatchesBloc>().add(LoadMatches()),
            ),
          ],
        ),
        body: BlocBuilder<MatchesBloc, MatchesState>(
          builder: (context, state) {
            if (state is MatchesLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is MatchesError) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error_outline, size: 48, color: AppColors.error),
                      const SizedBox(height: 16),
                      Text(
                        "${loc.get('somethingWrong')}: ${state.message}",
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: AppColors.error),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () => context.read<MatchesBloc>().add(LoadMatches()),
                        child: Text(loc.get('tryAgain')),
                      ),
                    ],
                  ),
                ),
              );
            } else if (state is MatchesLoaded) {
              final matches = state.matches;

              if (matches.isEmpty) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.people_outline, size: 64, color: Colors.grey[400]),
                      const SizedBox(height: 16),
                      Text(
                        loc.get('noMatchesYet'),
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        loc.get('matchesDescription'),
                        style: const TextStyle(color: Colors.grey),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: () => context.read<MatchesBloc>().add(LoadMatches()),
                        child: Text(loc.get('refresh')),
                      ),
                    ],
                  ),
                );
              }

              return RefreshIndicator(
                onRefresh: () async {
                   context.read<MatchesBloc>().add(LoadMatches());
                },
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(loc.get('yourTurn'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(color: Colors.grey.shade200, borderRadius: BorderRadius.circular(12)),
                            child: Text('${matches.length}', style: const TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Expanded(
                        child: ListView.separated(
                          itemCount: matches.length,
                          separatorBuilder: (_, __) => const Divider(),
                          itemBuilder: (context, index) {
                            final match = matches[index];
                            final name = match.fullName ?? 'Unknown';
                            final image = match.profilePhoto ?? '';
                            
                            return ListTile(
                              contentPadding: EdgeInsets.zero,
                              leading: CircleAvatar(
                                radius: 30,
                                backgroundColor: Colors.grey.shade300,
                                backgroundImage: (image.startsWith('http') || image.startsWith('uploads'))
                                    ? NetworkImage(image.startsWith('http') ? image : '${ApiConstants.baseUrl}/$image')
                                    : null,
                                child: (image.startsWith('http') || image.startsWith('uploads'))
                                    ? null
                                    : const Icon(Icons.person, size: 30, color: Colors.grey),
                              ),
                              title: Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                              subtitle: Text(loc.get('tapToChat'), maxLines: 1, overflow: TextOverflow.ellipsis),
                              onTap: () {
                                 Navigator.pushNamed(
                                   context, 
                                   AppRouter.chat,
                                   arguments: {
                                     'userId': match.id,
                                     'name': name, 
                                     'image': image.startsWith('http') ? image : 'assets/images/user_placeholder.png'
                                   }
                                 );
                              },
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }
            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }
}
