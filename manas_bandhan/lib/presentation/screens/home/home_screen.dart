import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/constants/constants.dart';
import '../../routes/app_router.dart';
import '../../blocs/home/home_bloc.dart';
import '../../blocs/auth/auth_bloc.dart';
import '../../blocs/locale/locale_cubit.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../../data/models/home_models.dart';

class HomeScreen extends StatelessWidget {
  final VoidCallback? onFindMatch;

  const HomeScreen({
    super.key,
    this.onFindMatch,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: _buildDrawer(context),
      body: BlocBuilder<HomeBloc, HomeState>(
        builder: (context, state) {
          final isLoading = state is HomeLoading || state is HomeInitial;
          
          List<ImpactCardModel> impactCards = [];
          List<MediaCardModel> mediaCards = [];
          List<AchievementCardModel> achievementCards = [];
          List<SuccessStoryModel> successStories = [];

          if (state is HomeLoaded) {
            impactCards = state.impactCards;
            mediaCards = state.mediaCards;
            achievementCards = state.achievementCards;
            successStories = state.successStories;
          }

          return Skeletonizer(
            enabled: isLoading,
            child: CustomScrollView(
              slivers: [
                // App Bar & Hero Carousel
                SliverAppBar(
                  expandedHeight: 300,
                  floating: false,
                  pinned: true,
                  flexibleSpace: FlexibleSpaceBar(
                    background: _buildHeroCarousel(impactCards),
                    title: isLoading ? null : null,
                  ),
                  title: Text(
                    'मानस बंधन',
                    style: TextStyle(
                      fontFamily: AppTextStyles.fontFamily,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  centerTitle: true,
                  backgroundColor: AppColors.primary,
                  actions: [
                    IconButton(
                      icon: const Icon(Icons.notifications_outlined),
                      onPressed: () {
                        Navigator.pushNamed(context, AppRouter.notifications);
                      },
                    ),
                  ],
                ),
                
                // Explore Section Header
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 32, 20, 16),
                    child: Text(
                      AppLocalizations.of(context).exploreManas,
                      style: AppTextStyles.heading2,
                    ).animate(target: isLoading ? 0 : 1).fadeIn().slideX(),
                  ),
                ),

                // 4 Main Banners — Equal 2×2 Grid
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  sliver: SliverToBoxAdapter(
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: _buildProMaxCard(
                                context,
                                title: AppLocalizations.of(context).about,
                                description: AppLocalizations.of(context).aboutDesc,
                                iconData: Icons.auto_awesome,
                                iconColor: AppColors.primary,
                                backgroundColor: const Color(0xFFFAF5FF),
                                onTap: () => Navigator.pushNamed(context, AppRouter.about),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: _buildProMaxCard(
                                context,
                                title: AppLocalizations.of(context).profile,
                                description: AppLocalizations.of(context).profileDesc,
                                iconData: Icons.favorite_rounded,
                                iconColor: const Color(0xFFE11D48),
                                backgroundColor: const Color(0xFFFFF1F2),
                                onTap: () => onFindMatch?.call(),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        Row(
                          children: [
                            Expanded(
                              child: _buildProMaxCard(
                                context,
                                title: AppLocalizations.of(context).volunteer,
                                description: AppLocalizations.of(context).volunteerDesc,
                                iconData: Icons.handshake_outlined,
                                iconColor: const Color(0xFF059669),
                                backgroundColor: const Color(0xFFECFDF5),
                                onTap: () => Navigator.pushNamed(context, AppRouter.volunteer),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: _buildProMaxCard(
                                context,
                                title: AppLocalizations.of(context).programsAndEvents,
                                description: AppLocalizations.of(context).programsDesc,
                                iconData: Icons.celebration,
                                iconColor: const Color(0xFFD97706),
                                backgroundColor: const Color(0xFFFFFBEB),
                                onTap: () => Navigator.pushNamed(context, AppRouter.projects),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                // Sections removed as per request (Achievements, Impact, Success, Media)

                // Contact Section
                SliverToBoxAdapter(
                   child: _buildContactSection(context).animate(target: isLoading ? 0 : 1).fadeIn(delay: 800.ms),
                ),
                
                const SliverToBoxAdapter(
                  child: SizedBox(height: 100),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildProMaxCard(
    BuildContext context, {
    required String title,
    required String description,
    required IconData iconData,
    required Color iconColor,
    required Color backgroundColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        height: 160,
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.white, width: 2),
          boxShadow: AppColors.softShadow,
        ),
        clipBehavior: Clip.hardEdge,
        child: Stack(
          children: [
            // Ghosted background icon
            Positioned(
              right: -20,
              bottom: -20,
              child: Opacity(
                opacity: 0.07,
                child: Icon(iconData, size: 110, color: iconColor),
              ),
            ),
            // Content
            Padding(
              padding: const EdgeInsets.all(18.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Icon chip at top
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(
                          color: iconColor.withOpacity(0.18),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Icon(iconData, color: iconColor, size: 22),
                  ),
                  // Title + description at bottom
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontFamily: AppTextStyles.fontFamily,
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF1E293B),
                          height: 1.2,
                          letterSpacing: -0.3,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        description,
                        style: TextStyle(
                          fontFamily: AppTextStyles.fontFamily,
                          fontSize: 11,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF64748B),
                          height: 1.4,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.1, end: 0);
  }

  Widget _buildDrawer(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: const BoxDecoration(
              color: AppColors.primary,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                   width: 60,
                   height: 60,
                   decoration: const BoxDecoration(
                     color: Colors.white,
                     shape: BoxShape.circle,
                     image: DecorationImage(
                       image: AssetImage('assets/images/logo.png'),
                       fit: BoxFit.cover,
                     ),
                   ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Manas Bandhan',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const Text(
                  'Empowering Lives',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: Text(AppLocalizations.of(context).home),
            onTap: () => Navigator.pop(context),
          ),
          ListTile(
            leading: const Icon(Icons.chat_bubble_outline), // Chat/Matches icon
            title: Text(AppLocalizations.of(context).findMatch),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRouter.matches);
            },
          ),

           ListTile(
            leading: const Icon(Icons.volunteer_activism),
            title: Text(AppLocalizations.of(context).getInvolved),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRouter.volunteer);
            },
          ),
           ListTile(
            leading: const Icon(Icons.event),
            title: Text(AppLocalizations.of(context).programsAndEvents),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRouter.projects);
            },
          ),
          ListTile(
            leading: const Icon(Icons.favorite),
            title: Text(AppLocalizations.of(context).donate),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRouter.donate);
            },
          ),
          ListTile(
             leading: const Icon(Icons.analytics), // Impact icon
             title: Text(AppLocalizations.of(context).ourImpact),
             onTap: () {
               Navigator.pop(context);
               Navigator.pushNamed(context, AppRouter.impact);
             },
          ),
          ListTile(
             leading: const Icon(Icons.newspaper),
             title: Text(AppLocalizations.of(context).mediaCoverage),
             onTap: () {
               Navigator.pop(context);
               Navigator.pushNamed(context, AppRouter.media);
             },
          ),
          ListTile(
            leading: const Icon(Icons.contact_phone),
            title: Text(AppLocalizations.of(context).contact),
            onTap: () {
              Navigator.pop(context);
              Navigator.pushNamed(context, AppRouter.contact);
            },
          ),
          const Divider(),
          // Language Toggle
          ListTile(
            leading: const Icon(Icons.language),
            title: Text(AppLocalizations.of(context).language),
            subtitle: Text(AppLocalizations.of(context).english + ' / ' + AppLocalizations.of(context).marathi),
            trailing: BlocBuilder<LocaleCubit, Locale>(
              builder: (context, locale) {
                return Switch(
                  value: locale.languageCode == 'mr',
                  onChanged: (isMarathi) {
                     if (isMarathi) {
                       context.read<LocaleCubit>().setMarathi();
                     } else {
                       context.read<LocaleCubit>().setEnglish();
                     }
                  },
                  activeColor: AppColors.primary,
                );
              },
            ),
          ),
          // Logout
          ListTile(
            leading: const Icon(Icons.logout),
            title: Text(AppLocalizations.of(context).logout),
            onTap: () {
              Navigator.pop(context);
              context.read<AuthBloc>().add(LogoutRequested());
            },
          ),
        ],
      ),
    );
  }

  Widget _buildHeroCarousel(List<ImpactCardModel> impactCards) {
    // Fallback static slides if no data
    final List<Map<String, String>> staticSlides = [
      {
        'title': 'Punarvivah Melava',
        'subtitle': 'Empowering widows through remarriage',
        'image': 'assets/images/carousel_wedding.jpg',
      },
      {
        'title': 'Tribal Welfare',
        'subtitle': 'Education for tribal children',
        'image': 'assets/images/carousel_children.jpg',
      },
      {
        'title': 'Zero Dowry',
        'subtitle': 'Satyashodhak marriages',
        'image': 'assets/images/carousel_community.jpg',
      },
    ];

    final hasData = impactCards.isNotEmpty;
    final itemCount = hasData ? impactCards.length : staticSlides.length;

    return CarouselSlider.builder(
      itemCount: itemCount,
      options: CarouselOptions(
        height: 280,
        viewportFraction: 1.0,
        autoPlay: true,
        autoPlayInterval: const Duration(seconds: 5),
      ),
      itemBuilder: (context, index, _) {
        String title, subtitle, imagePath;
        bool isNetworkImage = false;

        if (hasData) {
          final card = impactCards[index];
          title = card.title;
          subtitle = card.description;
          imagePath = card.imageUrl;
          isNetworkImage = true;
        } else {
          final slide = staticSlides[index];
          title = slide['title']!;
          subtitle = slide['subtitle']!;
          imagePath = slide['image']!;
        }

        return Container(
          decoration: const BoxDecoration(
            color: AppColors.primary, // Fallback
          ),
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Background Image
              if (isNetworkImage)
                CachedNetworkImage(
                  imageUrl: imagePath,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    decoration: const BoxDecoration(gradient: AppColors.heroGradient),
                  ),
                  errorWidget: (context, url, error) => Container(
                    decoration: const BoxDecoration(gradient: AppColors.heroGradient),
                    child: const Icon(Icons.error, color: Colors.white),
                  ),
                )
              else
                Image.asset(
                  imagePath,
                  fit: BoxFit.cover,
                  errorBuilder: (_,__,___) => Container(
                     decoration: const BoxDecoration(
                        gradient: AppColors.heroGradient,
                     ),
                  ),
                ),
              // Gradient Overlay
              Container(
                 decoration: BoxDecoration(
                   gradient: LinearGradient(
                     begin: Alignment.topCenter,
                     end: Alignment.bottomCenter,
                     colors: [
                       Colors.transparent,
                       Colors.black.withOpacity(0.4),
                       Colors.black.withOpacity(0.85),
                     ],
                     stops: const [0.0, 0.6, 1.0],
                   ),
                 ),
              ),
              Stack(
                children: [
              // Decorative circles
              Positioned(
                top: -50,
                right: -50,
                child: Container(
                  width: 200,
                  height: 200,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white.withOpacity(0.1),
                  ),
                ),
              ),
              // Content
              Positioned(
                bottom: 40,
                left: 24,
                right: 24,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontFamily: AppTextStyles.fontFamily,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: -0.5,
                        shadows: const [
                          Shadow(
                            offset: Offset(0, 2),
                            blurRadius: 4,
                            color: Colors.black45,
                          ),
                        ],
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontFamily: AppTextStyles.fontFamily,
                        fontSize: 16,
                        color: Colors.white.withOpacity(0.95),
                         shadows: const [
                          Shadow(
                            offset: Offset(0, 1),
                            blurRadius: 2,
                            color: Colors.black45,
                          ),
                        ],
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildAchievementsSection(List<AchievementCardModel> cards) {
    if (cards.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 32, 20, 16),
          child: Text('Our Achievements', style: AppTextStyles.heading2),
        ),
        SizedBox(
          height: 140,
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: cards.length,
            itemBuilder: (context, index) {
              final card = cards[index];
              return Container(
                width: 160,
                margin: const EdgeInsets.only(right: 16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
                  ],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      card.number,
                      style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.primary),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      card.title,
                      style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w500, color: Colors.black87),
                      textAlign: TextAlign.center,
                      maxLines: 2,
                    ),
                    if (card.description.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(
                        card.description,
                        style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey),
                        textAlign: TextAlign.center,
                        maxLines: 2,
                      ),
                    ],
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildImpactSection(BuildContext context, List<ImpactCardModel> cards) {
    if (cards.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 32, 20, 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(AppLocalizations.of(context).ourImpact, style: AppTextStyles.heading2),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, AppRouter.impact),
                child: Text('View All'),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 280,
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: cards.length,
            itemBuilder: (context, index) {
              final card = cards[index];
              return Container(
                width: 280,
                margin: const EdgeInsets.only(right: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                      child: CachedNetworkImage(
                        imageUrl: card.imageUrl,
                        height: 160,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorWidget: (context, url, error) => Container(color: Colors.grey[200], child: const Icon(Icons.error)),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            card.title,
                            style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.bold),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            card.description,
                            style: GoogleFonts.poppins(fontSize: 12, color: Colors.grey[600]),
                            maxLines: 3,
                            overflow: TextOverflow.ellipsis,
                          ),
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
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 32, 20, 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(AppLocalizations.of(context).mediaCoverage, style: AppTextStyles.heading2),
              TextButton(
                onPressed: () => Navigator.pushNamed(context, AppRouter.media),
                child: Text('View All'),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 200,
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: cards.length,
            itemBuilder: (context, index) {
              final card = cards[index];
              return Container(
                width: 200,
                margin: const EdgeInsets.only(right: 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
                  ],
                ),
                child: Column(
                  children: [
                    ClipRRect(
                      borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                      child: CachedNetworkImage(
                        imageUrl: card.imageUrl,
                        height: 120,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        errorWidget: (context, url, error) => Container(color: Colors.grey[200], child: const Icon(Icons.error)),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            card.title,
                            style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.bold),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                             card.date,
                             style: GoogleFonts.poppins(fontSize: 10, color: Colors.grey),
                          ),
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

  Widget _buildSuccessStoriesSection(List<SuccessStoryModel> stories) {
    if (stories.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 32, 20, 16),
          child: Text('Success Stories', style: AppTextStyles.heading2),
        ),
        CarouselSlider.builder(
          itemCount: stories.length,
          options: CarouselOptions(
            height: 180,
            viewportFraction: 0.9,
            enableInfiniteScroll: false,
          ),
          itemBuilder: (context, index, _) {
            final story = stories[index];
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.primaryLight.withOpacity(0.3),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.primary.withOpacity(0.1)),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.format_quote, color: AppColors.primary, size: 30),
                  const SizedBox(height: 8),
                  Text(
                    story.quote,
                    style: GoogleFonts.poppins(fontSize: 14, fontStyle: FontStyle.italic, color: Colors.black87),
                    textAlign: TextAlign.center,
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '- ${story.author}, ${story.location}',
                    style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildContactSection(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Contact Us', style: AppTextStyles.heading3),
          const SizedBox(height: 16),
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const CircleAvatar(backgroundColor: AppColors.primaryLight, child: Icon(Icons.phone, color: AppColors.primary)),
            title: Text(AppConstants.phone),
            subtitle: const Text('Monday - Saturday, 10am - 6pm'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
            onTap: () async {
              final uri = Uri.parse('tel:${AppConstants.phone}');
              if (await canLaunchUrl(uri)) {
                await launchUrl(uri);
              }
            },
          ),
          const Divider(),
          ListTile(
            contentPadding: EdgeInsets.zero,
            leading: const CircleAvatar(backgroundColor: AppColors.primaryLight, child: Icon(Icons.email, color: AppColors.primary)),
            title: Text(AppConstants.email),
            subtitle: const Text('We reply within 24 hours'),
            onTap: () async {
              final uri = Uri.parse('mailto:${AppConstants.email}');
              if (await canLaunchUrl(uri)) {
                await launchUrl(uri);
              }
            },
            trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
