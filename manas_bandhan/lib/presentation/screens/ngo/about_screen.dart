import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/constants/constants.dart';
import '../../routes/app_router.dart';
import '../../blocs/home/home_bloc.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../../data/models/home_models.dart';
import '../../../data/models/app_content_models.dart';
import '../../../data/repositories/user_repository_impl.dart';
import '../../../data/datasources/api_client.dart';

class AboutScreen extends StatefulWidget {
  const AboutScreen({super.key});

  @override
  State<AboutScreen> createState() => _AboutScreenState();
}

class _AboutScreenState extends State<AboutScreen> {
  List<MilestoneModel> _milestones = [];
  bool _milestonesLoading = true;

  @override
  void initState() {
    super.initState();
    _loadMilestones();
  }

  Future<void> _loadMilestones() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final apiClient = ApiClient(prefs);
      final repo = UserRepositoryImpl(apiClient, prefs);
      final milestones = await repo.getMilestones();
      if (mounted) {
        setState(() {
          _milestones = milestones;
          _milestonesLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _milestonesLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    // Ensure HomeBloc data is loaded
    context.read<HomeBloc>().add(LoadHomeData());

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context).about),
      ),
      body: BlocBuilder<HomeBloc, HomeState>(
        builder: (context, state) {
          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Hero header
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: const BoxDecoration(
                    gradient: AppColors.heroGradient,
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(25),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 20,
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(25),
                          child: Image.asset(
                            'assets/images/logo.png',
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Manas Foundation',
                        style: TextStyle(
                          fontFamily: AppTextStyles.fontFamily,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Est. Buldhana',
                        style: TextStyle(
                          color: Colors.white.withOpacity(0.9),
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Content
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Organization profile
                      Text(AppLocalizations.of(context).whoWeAre, style: AppTextStyles.heading3),
                      const SizedBox(height: 12),
                      Text(
                        AppLocalizations.of(context).whoWeAreText,
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textSecondary,
                          height: 1.6,
                        ),
                      ),
                      
                      const SizedBox(height: 32),
                      
                      // Mission
                      _SectionCard(
                        icon: Icons.flag,
                        title: AppLocalizations.of(context).ourMission,
                        content: AppLocalizations.of(context).missionText,
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // Vision
                      _SectionCard(
                        icon: Icons.visibility,
                        title: AppLocalizations.of(context).ourVision,
                        content: AppLocalizations.of(context).visionText,
                      ),
                      
                      const SizedBox(height: 32),
                      
                      // Founder section
                      Text(AppLocalizations.of(context).leadership, style: AppTextStyles.heading3),
                      const SizedBox(height: 16),
                      _buildTeamMember('Dattatraya Lahane', 'President', 'DL'),
                      const SizedBox(height: 12),
                      _buildTeamMember('Ganesh Nikam', 'Vice President', 'GN'),
                      const SizedBox(height: 12),
                      _buildTeamMember('Shahina Pathan', 'Treasurer', 'SP'),
                      const SizedBox(height: 12),
                      _buildTeamMember('Meena Lahane', 'Secretary', 'ML'),

                      const SizedBox(height: 32),

                      // Our Journey Section (Ported)
                      // Our Journey Section (Ported)
                      _buildOurJourneySection(context),
                      const SizedBox(height: 32),

                      // Our Impact Section (Ported)
                      if (state is HomeLoaded) _buildImpactSection(context, state.impactCards),
                      if (state is HomeLoaded) const SizedBox(height: 32),

                      // Media Coverage Section (Ported)
                      if (state is HomeLoaded) _buildMediaSection(context, state.mediaCards),
                      if (state is HomeLoaded) const SizedBox(height: 32),
                      
                      // Donate Section (Ported)
                      _buildDonateSection(context),

                      const SizedBox(height: 32),
                      
                      // Values
                      Text(AppLocalizations.of(context).ourValues, style: AppTextStyles.heading3),
                      const SizedBox(height: 16),
                      _ValueItem(icon: Icons.check_circle, text: AppLocalizations.of(context).value1),
                      _ValueItem(icon: Icons.check_circle, text: AppLocalizations.of(context).value2),
                      _ValueItem(icon: Icons.check_circle, text: AppLocalizations.of(context).value3),
                      _ValueItem(icon: Icons.check_circle, text: AppLocalizations.of(context).value4),
                      
                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildOurJourneySection(BuildContext context) {
    // Fallback data if API returns empty
    final fallbackTimeline = [
      {'date': 'Aug 2022', 'title': 'Rakshabandhan Program', 'desc': 'Fostering emotional support.'},
      {'date': 'Nov 2022', 'title': 'Entrepreneur Meet', 'desc': 'Creating employment opportunities.'},
      {'date': 'Dec 2023', 'title': 'Widow Women Parishad', 'desc': 'District-level gathering.'},
      {'date': 'Jan 2024', 'title': 'Remarriage Ceremony', 'desc': 'Dignified group remarriage event.'},
      {'date': 'Mar 2024', 'title': 'Community Ceremony', 'desc': 'Continuing the mission.'},
    ];

    final bool useFallback = _milestones.isEmpty && !_milestonesLoading;
    final int itemCount = useFallback ? fallbackTimeline.length : _milestones.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(AppLocalizations.of(context).ourJourney, style: AppTextStyles.heading3),
        const SizedBox(height: 16),
        if (_milestonesLoading)
          const Center(child: Padding(
            padding: EdgeInsets.all(16),
            child: CircularProgressIndicator(),
          ))
        else
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: itemCount,
            itemBuilder: (context, index) {
              final String date;
              final String title;
              final String desc;

              if (useFallback) {
                date = fallbackTimeline[index]['date']!;
                title = fallbackTimeline[index]['title']!;
                desc = fallbackTimeline[index]['desc']!;
              } else {
                date = _milestones[index].date;
                title = _milestones[index].title;
                desc = _milestones[index].description;
              }

              return Padding(
                padding: const EdgeInsets.only(bottom: 16.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Timeline Line & Dot
                    Column(
                      children: [
                        Container(
                          width: 12,
                          height: 12,
                          decoration: const BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                          ),
                        ),
                        if (index != itemCount - 1)
                          Container(
                            width: 2,
                            height: 50,
                            color: Colors.grey.shade300,
                          ),
                      ],
                    ),
                    const SizedBox(width: 12),
                    // Content
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.indigo.shade50,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              date,
                              style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.indigo, fontSize: 12),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            title,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          Text(
                            desc,
                            style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
      ],
    );
  }

  Widget _buildImpactSection(BuildContext context, List<ImpactCardModel> cards) {
    if (cards.isEmpty) return const SizedBox.shrink();
    return Column(
       crossAxisAlignment: CrossAxisAlignment.start,
       children: [
           Row(
             mainAxisAlignment: MainAxisAlignment.spaceBetween,
             children: [
               Text(AppLocalizations.of(context).ourImpact, style: AppTextStyles.heading3),
               TextButton(
                 onPressed: () {
                    Navigator.pushNamed(context, AppRouter.impact);
                 },
                 child: Text(AppLocalizations.of(context).viewAll),
               ),
             ],
           ),
           const SizedBox(height: 16),
           SizedBox(
             height: 220,
             child: ListView.builder(
               scrollDirection: Axis.horizontal,
               itemCount: cards.length,
               itemBuilder: (context, index) {
                 final card = cards[index];
                 return Container(
                   width: 250,
                   margin: const EdgeInsets.only(right: 12),
                   decoration: BoxDecoration(
                     color: Colors.white,
                     borderRadius: BorderRadius.circular(12),
                     boxShadow: [
                       BoxShadow(color: Colors.grey.shade200, blurRadius: 4, offset:const Offset(0,2)),
                     ],
                   ),
                   child: Column(
                     crossAxisAlignment: CrossAxisAlignment.start,
                     children: [
                        ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                          child: Image.network(
                            card.imageUrl.startsWith('http') 
                               ? card.imageUrl 
                               : '${ApiConstants.baseUrl}${card.imageUrl}',
                            height: 120,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (_,__,___) => Container(
                              height: 120, 
                              color: Colors.grey.shade200,
                              child: const Icon(Icons.image, color: Colors.grey),
                            ),
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(card.title, style: const TextStyle(fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis),
                              const SizedBox(height: 4),
                              Text(card.description, style: AppTextStyles.caption, maxLines: 2, overflow: TextOverflow.ellipsis),
                            ],
                          ),
                        ),
                     ],
                   ),
                 );
               },
             ),
           ),
       ],
    );
  }

  Widget _buildMediaSection(BuildContext context, List<MediaCardModel> cards) {
    if (cards.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
           Row(
             mainAxisAlignment: MainAxisAlignment.spaceBetween,
             children: [
               Text(AppLocalizations.of(context).mediaCoverage, style: AppTextStyles.heading3),
               TextButton(
                 onPressed: () {
                    Navigator.pushNamed(context, AppRouter.media);
                 },
                 child: Text(AppLocalizations.of(context).viewAll),
               ),
             ],
           ),
         const SizedBox(height: 16),
         SizedBox(
           height: 350,
           child: ListView.builder(
             scrollDirection: Axis.horizontal,
             itemCount: cards.length,
             itemBuilder: (context, index) {
                final card = cards[index];
                 return Container(
                  width: 250,
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(color: Colors.grey.shade200, blurRadius: 4, offset:const Offset(0,2)),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ClipRRect(
                         borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                         child: Image.network(
                           card.imageUrl.startsWith('http') 
                              ? card.imageUrl 
                              : '${ApiConstants.baseUrl}${card.imageUrl}',
                           height: 120,
                           width: double.infinity,
                           fit: BoxFit.cover,
                            errorBuilder: (_,__,___) => Container(
                              height: 120,
                              color: Colors.grey.shade200,
                              child: const Icon(Icons.newspaper, color: Colors.grey),
                            ),
                         ),
                      ),
                       Padding(
                         padding: const EdgeInsets.all(12),
                         child: Column(
                           crossAxisAlignment: CrossAxisAlignment.start,
                           children: [
                             Row(
                               mainAxisAlignment: MainAxisAlignment.spaceBetween,
                               children: [
                                 Expanded(child: Text(card.source, style: AppTextStyles.caption.copyWith(color: AppColors.primary, fontWeight: FontWeight.bold), maxLines: 1, overflow: TextOverflow.ellipsis)),
                                 const SizedBox(width: 8),
                                 Text(card.date, style: const TextStyle(fontSize: 10, color: Colors.grey)),
                               ],
                             ),
                             const SizedBox(height: 6),
                             Text(card.title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13), maxLines: 2, overflow: TextOverflow.ellipsis),
                             const SizedBox(height: 4),
                             Text(card.description, style: const TextStyle(fontSize: 10, color: Colors.grey), maxLines: 3, overflow: TextOverflow.ellipsis),
                           ],
                         ),
                       ),
                       const Spacer(),
                     ],
                   ),
                  );
             },
           ),
         ),
      ],
    );
  }

  Widget _buildDonateSection(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(28),
      decoration: BoxDecoration(
        color: AppColors.secondary,
        borderRadius: BorderRadius.circular(24),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        children: [
          const Icon(Icons.volunteer_activism, size: 48, color: Colors.white),
          const SizedBox(height: 16),
          Text(AppLocalizations.of(context).makeDifference, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(
            AppLocalizations.of(context).donateText,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.white, fontSize: 14),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, AppRouter.donate),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: AppColors.secondary,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
            ),
            child: Text(AppLocalizations.of(context).donateNow, style: const TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
  Widget _buildTeamMember(String name, String role, String initials) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.surfaceVariant, width: 2),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 30,
            backgroundColor: AppColors.primary,
            child: Text(
              initials,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: AppTextStyles.bodyLarge.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  role,
                  style: const TextStyle(color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String content;

  const _SectionCard({
    required this.icon,
    required this.title,
    required this.content,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.surfaceVariant, width: 1.5),
        boxShadow: AppColors.softShadow,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.primaryLight.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: AppColors.primary),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(
                  content,
                  style: AppTextStyles.bodySmall.copyWith(height: 1.5),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ValueItem extends StatelessWidget {
  final IconData icon;
  final String text;

  const _ValueItem({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(icon, color: AppColors.success, size: 20),
          const SizedBox(width: 12),
          Text(text, style: AppTextStyles.bodyMedium),
        ],
      ),
    );
  }
}
