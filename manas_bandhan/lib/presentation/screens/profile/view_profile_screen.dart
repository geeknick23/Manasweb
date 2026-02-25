import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/constants/constants.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../../data/models/user_model.dart';
import '../../blocs/discovery/discovery_bloc.dart';
import '../../blocs/locale/locale_cubit.dart';

class ViewProfileScreen extends StatefulWidget {
  final String userId;

  const ViewProfileScreen({super.key, required this.userId});

  @override
  State<ViewProfileScreen> createState() => _ViewProfileScreenState();
}

class _ViewProfileScreenState extends State<ViewProfileScreen> {
  User? _user;
  bool _isLoading = true;
  bool _interestSent = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    // In a real app, this would call the repository
    // For now we'll use the bloc's cached profiles
    final state = context.read<DiscoveryBloc>().state;
    final user = state.profiles.firstWhere(
      (p) => p.id == widget.userId,
      orElse: () => User(
        id: widget.userId,
        fullName: 'Loading...',
        email: '',
        dateOfBirth: DateTime.now(),
        gender: Gender.female,
        maritalStatus: MaritalStatus.widow,
        education: Education.none,
        childrenCount: 0,
        isVerified: false,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      ),
    );
    
    setState(() {
      _user = user;
      _isLoading = false;
    });
  }

  String _getImageUrl(String? path) {
    if (path == null || path.isEmpty) return '';
    if (path.startsWith('data:')) return path;
    
    // Handle full URLs
    if (path.startsWith('http')) {
      // Replace localhost with the configured base URL host for device testing
      if (path.contains('localhost')) {
        final uri = Uri.parse(ApiConstants.baseUrl);
        return path.replaceFirst('localhost', uri.host);
      }
      return path;
    }

    // Properly handle slashes and backslashes (for Windows paths in DB)
    final baseUrl = ApiConstants.baseUrl.endsWith('/') 
        ? ApiConstants.baseUrl.substring(0, ApiConstants.baseUrl.length - 1) 
        : ApiConstants.baseUrl;
        
    var cleanPath = path.replaceAll('\\', '/');
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/$cleanPath';
    }
    
    return '$baseUrl$cleanPath';
  }

  void _handleSendInterest() {
    final loc = AppLocalizations.of(context);
    context.read<DiscoveryBloc>().add(
      ExpressInterestEvent(targetUserId: widget.userId),
    );
    setState(() => _interestSent = true);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(loc.get('interestSentSuccess')),
        backgroundColor: AppColors.success,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    context.watch<LocaleCubit>();
    final loc = AppLocalizations.of(context);

    if (_isLoading || _user == null) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final user = _user!;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Hero Image
          SliverAppBar(
            expandedHeight: 350,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  user.profilePhoto != null && user.profilePhoto!.isNotEmpty
                      ? CachedNetworkImage(
                          imageUrl: _getImageUrl(user.profilePhoto),
                          fit: BoxFit.cover,
                          errorWidget: (_, __, ___) => _buildPlaceholder(),
                        )
                      : _buildPlaceholder(),
                  // Gradient overlay
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withOpacity(0.7),
                        ],
                      ),
                    ),
                  ),
                  // Name and basic info
                  Positioned(
                    bottom: 20,
                    left: 20,
                    right: 20,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                user.fullName,
                                style: const TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                            if (user.isVerified)
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: const BoxDecoration(
                                  color: AppColors.success,
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(Icons.verified, size: 16, color: Colors.white),
                              ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            _TagChip(label: '${user.age} ${loc.get('years')}'),
                            const SizedBox(width: 8),
                            _TagChip(label: loc.getMaritalStatus(user.maritalStatus)),
                            const SizedBox(width: 8),
                            _TagChip(label: user.location?.district ?? 'N/A'),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Content
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Quick Stats
                  Row(
                    children: [
                      _StatCard(icon: Icons.school, label: loc.get('education'), value: loc.getEducation(user.education)),
                      const SizedBox(width: 12),
                      _StatCard(icon: Icons.work, label: loc.get('profession'), value: user.profession ?? 'N/A'),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _StatCard(icon: Icons.child_care, label: loc.get('children'), value: '${user.childrenCount}'),
                      const SizedBox(width: 12),
                      _StatCard(icon: Icons.calendar_today, label: loc.get('age'), value: '${user.age} ${loc.get('yrs')}'),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // About section
                  if (user.briefPersonalDescription?.isNotEmpty == true) ...[
                    Text(loc.get('about'), style: AppTextStyles.heading3),
                    const SizedBox(height: 12),
                    Text(
                      user.briefPersonalDescription!,
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: AppColors.textSecondary,
                        height: 1.6,
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Personal Details
                  Text(loc.get('personalDetails'), style: AppTextStyles.heading3),
                  const SizedBox(height: 16),
                  _DetailRow(icon: Icons.cake, label: loc.get('dateOfBirth'), value: _formatDate(user.dateOfBirth)),
                  _DetailRow(icon: Icons.school, label: loc.get('education'), value: loc.getEducation(user.education)),
                  if (user.profession != null)
                    _DetailRow(icon: Icons.work, label: loc.get('profession'), value: user.profession!),
                  if (user.caste != null)
                    _DetailRow(icon: Icons.group, label: loc.get('caste'), value: user.caste!.name),
                  if (user.religion != null)
                    _DetailRow(icon: Icons.temple_hindu, label: loc.get('religion'), value: user.religion!.name),

                  // Children info
                  if (user.childrenCount > 0) ...[
                    const SizedBox(height: 24),
                    Text(loc.get('children'), style: AppTextStyles.heading3),
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceVariant,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.child_care, color: AppColors.primary),
                          const SizedBox(width: 12),
                          Text(
                            '${user.childrenCount} ${user.childrenCount == 1 ? loc.get('child') : loc.get('children')}',
                            style: AppTextStyles.bodyLarge,
                          ),
                        ],
                      ),
                    ),
                  ],

                  // Location
                  if (user.location != null) ...[
                    const SizedBox(height: 24),
                    Text(loc.get('location'), style: AppTextStyles.heading3),
                    const SizedBox(height: 16),
                    _DetailRow(icon: Icons.location_on, label: loc.get('village'), value: user.location!.village),
                    _DetailRow(icon: Icons.location_city, label: loc.get('tehsil'), value: user.location!.tehsil),
                    _DetailRow(icon: Icons.map, label: loc.get('district'), value: user.location!.district),
                    _DetailRow(icon: Icons.public, label: loc.get('state'), value: user.location!.state),
                  ],

                  // Interests/Hobbies
                  if (user.interestsHobbies?.isNotEmpty == true) ...[
                    const SizedBox(height: 24),
                    Text(loc.get('interests'), style: AppTextStyles.heading3),
                    const SizedBox(height: 12),
                    Text(
                      user.interestsHobbies!,
                      style: AppTextStyles.bodyMedium,
                    ),
                  ],

                  const SizedBox(height: 100), // Space for FAB
                ],
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: _interestSent
          ? FloatingActionButton.extended(
              onPressed: null,
              backgroundColor: Colors.grey,
              icon: const Icon(Icons.check),
              label: Text(loc.get('interestSent')),
            )
          : FloatingActionButton.extended(
              onPressed: _handleSendInterest,
              backgroundColor: AppColors.secondary,
              icon: const Icon(Icons.favorite),
              label: Text(loc.get('sendInterest')),
            ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      color: AppColors.primaryLight.withOpacity(0.3),
      child: const Center(
        child: Icon(Icons.person, size: 100, color: AppColors.primary),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}

class _TagChip extends StatelessWidget {
  final String label;

  const _TagChip({required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: const TextStyle(color: Colors.white, fontSize: 12),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _StatCard({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: AppColors.primary, size: 20),
            const SizedBox(height: 8),
            Text(label, style: AppTextStyles.caption),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.bold),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _DetailRow({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppColors.textSecondary),
          const SizedBox(width: 12),
          Text('$label:', style: const TextStyle(color: AppColors.textSecondary)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontWeight: FontWeight.w500),
              textAlign: TextAlign.right,
            ),
          ),
        ],
      ),
    );
  }
}
