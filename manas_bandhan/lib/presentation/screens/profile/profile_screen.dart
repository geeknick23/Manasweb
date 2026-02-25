import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:skeletonizer/skeletonizer.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/constants/constants.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/models/user_model.dart';
import '../../blocs/auth/auth_bloc.dart';
import '../../blocs/profile/profile_bloc.dart';
import '../../blocs/locale/locale_cubit.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../routes/app_router.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

extension UserCopyWith on User {
  User copyWith({
    String? fullName,
    int? ageVal, // Hack since age is a getter
    Education? education,
    MaritalStatus? maritalStatus,
    String? profession,
    Location? location,
  }) {
    return User(
      id: id,
      fullName: fullName ?? this.fullName,
      email: email,
      dateOfBirth: ageVal != null ? DateTime.now().subtract(Duration(days: 365 * ageVal)) : dateOfBirth,
      gender: gender,
      maritalStatus: maritalStatus ?? this.maritalStatus,
      education: education ?? this.education,
      profession: profession ?? this.profession,
      location: location ?? this.location,
      childrenCount: childrenCount,
      isVerified: isVerified,
      createdAt: createdAt,
      updatedAt: updatedAt,
      // Pass other fields as is... using a proper copyWith in model would be better but this works for local UI logic
    );
  }
}


class _ProfileScreenState extends State<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ProfileBloc>().add(LoadProfile());
  }

  @override
  Widget build(BuildContext context) {
    // Watch LocaleCubit to trigger rebuild when language changes
    context.watch<LocaleCubit>();
    final loc = AppLocalizations.of(context);

    return BlocBuilder<ProfileBloc, ProfileState>(
      builder: (context, state) {
        final isLoading = state is ProfileLoading || state is ProfileInitial;
        
        if (state is ProfileError) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 48, color: AppColors.error),
                const SizedBox(height: 16),
                Text(
                  'Error loading profile',
                  style: AppTextStyles.heading3.copyWith(color: AppColors.error),
                ),
                const SizedBox(height: 8),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32),
                  child: Text(
                    state.message,
                    textAlign: TextAlign.center,
                    style: AppTextStyles.bodyMedium,
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () {
                    context.read<ProfileBloc>().add(LoadProfile());
                  },
                  child: const Text('Try Again'),
                ),
              ],
            ),
          );
        }

        // Prepare User Object (Real or Dummy)
        User user;
        if (state is ProfileLoaded) {
          user = state.user;
        } else if (state is ProfileUpdateSuccess) {
          user = state.user;
        } else {
          // Dummy user for Skeleton
          user = User.empty().copyWith(
            fullName: 'Loading User Name',
            ageVal: 25, // Mock age logic would be needed or just string
            education: Education.bachelors,
            maritalStatus: MaritalStatus.single,
            profession: 'Software Engineer',
            location: const Location(village: 'Village', tehsil: 'Tehsil', district: 'District', state: 'State'),
          );
        }

        return Scaffold(
          body: Skeletonizer(
            enabled: isLoading,
            child: RefreshIndicator(
              onRefresh: () async {
                context.read<ProfileBloc>().add(LoadProfile());
              },
              child: CustomScrollView(
                slivers: [
                  SliverAppBar(
                    expandedHeight: 400,
                    floating: false,
                    pinned: true,
                    stretch: true,
                    backgroundColor: AppColors.primary,
                    flexibleSpace: FlexibleSpaceBar(
                      background: _buildProfileHeader(context, user, loc),
                      stretchModes: const [StretchMode.zoomBackground, StretchMode.blurBackground],
                      collapseMode: CollapseMode.parallax,
                    ),
                    actions: [
                      Container(
                        margin: const EdgeInsets.only(right: 16),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.3),
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.edit, color: Colors.white),
                          onPressed: () => Navigator.pushNamed(context, AppRouter.editProfile).then((_) {
                            context.read<ProfileBloc>().add(LoadProfile());
                          }),
                        ),
                      ),
                    ],
                  ),

                  SliverToBoxAdapter(
                    child: _buildProfileContent(context, user, loc)
                        .animate(target: isLoading ? 0 : 1)
                        .fadeIn(duration: 600.ms)
                        .slideY(begin: 0.1, end: 0, curve: Curves.easeOutQuad),
                  ),
                  
                  const SliverToBoxAdapter(child: SizedBox(height: 50)),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildProfileHeader(BuildContext context, User user, AppLocalizations loc) {
    return Stack(
      fit: StackFit.expand,
      children: [
        // Full background image
        Hero(
          tag: 'profile_${user.id}',
          child: user.profilePhoto != null && user.profilePhoto!.isNotEmpty
              ? Image.network(
                  _getProfileImageUrl(user.profilePhoto!)!,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    color: AppColors.primary,
                    child: const Icon(Icons.person, size: 100, color: Colors.white),
                  ),
                )
              : Container(
                  color: AppColors.primary,
                  child: const Icon(Icons.person, size: 100, color: Colors.white),
                ),
        ),
          
        // Gradient Gradient for text readability
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.transparent,
                Colors.black.withOpacity(0.1),
                Colors.black.withOpacity(0.6),
                Colors.black.withOpacity(0.9),
              ],
              stops: const [0.4, 0.6, 0.8, 1.0],
            ),
          ),
        ),

        // User Info Overlay
        Positioned(
          bottom: 30,
          left: 20,
          right: 20,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(
                    child: Text(
                      user.fullName,
                      style: GoogleFonts.poppins(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        shadows: [const Shadow(color: Colors.black45, blurRadius: 10)],
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ).animate().fadeIn().slideX(),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              if (user.isVerified)
                Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: AppColors.success,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                         BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 4, offset: const Offset(0,2))
                      ]
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.verified, size: 16, color: Colors.white),
                        const SizedBox(width: 4),
                        Text(loc.get('verifiedProfile'), style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
                      ],
                    ),
                  ).animate().fadeIn(delay: 200.ms).scale(),

              Row(
                children: [
                   _buildTag('${user.age} ${loc.get('years')}'),
                   const SizedBox(width: 8),
                   _buildTag(loc.getMaritalStatus(user.maritalStatus)),
                   const SizedBox(width: 8),
                   if (user.location != null)
                      _buildTag(user.location!.cityShortName), 
                ],
              ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.5, end: 0),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTag(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.2)),
      ),
      child: Text(
        text,
        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 13),
      ),
    );
  }

  Widget _buildProfileContent(BuildContext context, User user, AppLocalizations loc) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Quick stats
          Row(
            children: [
              Expanded(
                child: _StatCard(
                  icon: Icons.favorite_rounded,
                  label: loc.get('sent'),
                  value: '${user.expressedInterests?.length ?? 0}',
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _StatCard(
                  icon: Icons.volunteer_activism,
                  label: loc.get('received'),
                  value: '${user.receivedInterests?.length ?? 0}',
                  color: AppColors.secondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // View interests button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: OutlinedButton.icon(
              onPressed: () => Navigator.pushNamed(context, AppRouter.interests),
              icon: const Icon(Icons.favorite_border),
              label: Text(loc.get('viewAllInterests')),
              style: OutlinedButton.styleFrom(
                backgroundColor: Colors.white,
                side: BorderSide(color: AppColors.primary.withOpacity(0.5)),
              ),
            ),
          ),
          const SizedBox(height: 32),
          
          // About Me Section
          if ((user.briefPersonalDescription != null && user.briefPersonalDescription!.isNotEmpty) ||
              (user.interestsHobbies != null && user.interestsHobbies!.isNotEmpty)) ...[
             _buildSectionTitle(loc.get('aboutMe')),
             _InfoCard(
               children: [
                 if (user.briefPersonalDescription != null && user.briefPersonalDescription!.isNotEmpty) ...[
                   Text(
                     user.briefPersonalDescription!,
                     style: const TextStyle(color: AppColors.textPrimary, height: 1.5),
                   ),
                   if (user.interestsHobbies != null) const Divider(height: 24),
                 ],
                 if (user.interestsHobbies != null && user.interestsHobbies!.isNotEmpty)
                   _DetailRow(
                      icon: Icons.interests, 
                      label: loc.get('interests'), 
                      value: user.interestsHobbies!
                   ),
               ],
             ),
             const SizedBox(height: 24),
          ],

          // Background & Community
          _buildSectionTitle(loc.get('background')),
           _InfoCard(
            children: [
              if (user.religion != null) ...[
                _DetailRow(icon: Icons.temple_hindu, label: loc.get('religion'), value: user.religion!.name.toUpperCase()),
                const Divider(height: 24),
              ],
              if (user.caste != null) ...[
                _DetailRow(icon: Icons.group, label: loc.get('caste'), value: user.caste!.name.toUpperCase()),
                const Divider(height: 24),
              ],
              if (user.guardian != null) ...[
                 _DetailRow(
                   icon: Icons.family_restroom, 
                   label: loc.get('guardian'), 
                   value: '${user.guardian!.name} (${user.guardian!.contact})'
                 ),
                 const Divider(height: 24),
              ],
               _DetailRow(icon: Icons.child_care, label: loc.get('children'), value: '${user.childrenCount}'),
            ],
          ),
          const SizedBox(height: 24),

          // Personal Details
          _buildSectionTitle(loc.get('personalInfo')),
          _InfoCard(
            children: [
              _DetailRow(icon: Icons.cake, label: loc.get('birthDate'), value: '${user.dateOfBirth.day}/${user.dateOfBirth.month}/${user.dateOfBirth.year} (${user.age} ${loc.get('years')})'),
              const Divider(height: 24),
              _DetailRow(icon: Icons.person, label: loc.get('gender'), value: loc.getGender(user.gender)),
              const Divider(height: 24),
              _DetailRow(icon: Icons.school, label: loc.get('education'), value: loc.getEducation(user.education)),
              if (user.profession != null) ...[
                 const Divider(height: 24),
                _DetailRow(icon: Icons.work, label: loc.get('profession'), value: user.profession!),
              ],
            ],
          ),

          const SizedBox(height: 24),

          _buildSectionTitle(loc.get('contactDetails')),
          _InfoCard(
            children: [
              _DetailRow(
                icon: Icons.email_outlined, 
                label: loc.get('email'), 
                value: user.email,
                onTap: () async {
                  final uri = Uri.parse('mailto:${user.email}');
                  if (await canLaunchUrl(uri)) await launchUrl(uri);
                },
              ),
              if (user.phoneNumber != null) ...[
                const Divider(height: 24),
                _DetailRow(
                  icon: Icons.phone_outlined, 
                  label: loc.get('phone'), 
                  value: user.phoneNumber!,
                  onTap: () async {
                    final uri = Uri.parse('tel:${user.phoneNumber}');
                    if (await canLaunchUrl(uri)) await launchUrl(uri);
                  },
                ),
              ],
            ],
          ),

          const SizedBox(height: 24),
          
          if (user.location != null) ...[
            _buildSectionTitle(loc.get('location')),
            _InfoCard(
              children: [
                _DetailRow(icon: Icons.location_on_outlined, label: loc.get('village'), value: user.location!.village),
                const Divider(height: 24),
                _DetailRow(icon: Icons.location_city, label: loc.get('tehsil'), value: user.location!.tehsil),
                const Divider(height: 24),
                _DetailRow(icon: Icons.map, label: loc.get('district'), value: user.location!.district),
              ],
            ),
            const SizedBox(height: 32),
          ],

          // Logout button
          SizedBox(
            width: double.infinity,
            height: 50,
            child: TextButton.icon(
              onPressed: () {
                context.read<AuthBloc>().add(LogoutRequested());
                Navigator.pushReplacementNamed(context, AppRouter.login);
              },
              icon: const Icon(Icons.logout, color: AppColors.error),
              label: Text(loc.get('signOut'), style: const TextStyle(color: AppColors.error, fontSize: 16)),
              style: TextButton.styleFrom(
                backgroundColor: AppColors.error.withOpacity(0.05),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
          
          const SizedBox(height: 20),
          Center(
             child: Text(
               'Version ${AppConstants.appVersion}', 
               style: AppTextStyles.caption.copyWith(color: Colors.grey.shade400)
             )
          ),

          const SizedBox(height: 40),




        ],
      ),
    );
  }
  
  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 4),
      child: Text(title, style: AppTextStyles.heading3.copyWith(fontSize: 18)),
    );
  }
  String? _getProfileImageUrl(String? url) {
    if (url == null || url.isEmpty) return null;
    if (url.startsWith('http')) return url;
    // Handle relative URLs
    final baseUrl = ApiConstants.baseUrl.endsWith('/')
        ? ApiConstants.baseUrl.substring(0, ApiConstants.baseUrl.length - 1)
        : ApiConstants.baseUrl;
    final path = url.startsWith('/') ? url : '/$url';
    return '$baseUrl$path';
  }
}

class _InfoCard extends StatelessWidget {
  final List<Widget> children;
  
  const _InfoCard({required this.children});
  
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
        border: Border.all(color: Colors.grey.withOpacity(0.1)),
      ),
      child: Column(
        children: children,
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.08),
            blurRadius: 15,
            offset: const Offset(0, 6),
          ),
        ],
        border: Border.all(color: color.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 28),
          ).animate().scale(delay: 200.ms, duration: 400.ms),
          const SizedBox(height: 16),
          Text(
            value,
            style: GoogleFonts.poppins(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label, 
            style: AppTextStyles.caption.copyWith(
              fontSize: 13, 
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            )
          ),
        ],
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final VoidCallback? onTap;

  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final content = Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.grey.shade50,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, size: 20, color: AppColors.textSecondary),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: AppTextStyles.caption),
              const SizedBox(height: 2),
              Text(
                value,
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 15,
                  color: onTap != null ? AppColors.primary : AppColors.textPrimary,
                ),
                overflow: TextOverflow.ellipsis,
                maxLines: 2,
              ),
            ],
          ),
        ),
        if (onTap != null) ...[

          Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey.shade400),
        ]
      ],
    );

    if (onTap != null) {
      return InkWell(onTap: onTap, borderRadius: BorderRadius.circular(8), child: content);
    }
    return content;
  }
}

extension LocationHelpers on Location {
  String get cityShortName {
    if (district.isNotEmpty) return district;
    if (tehsil.isNotEmpty) return tehsil;
    return village;
  }
}
