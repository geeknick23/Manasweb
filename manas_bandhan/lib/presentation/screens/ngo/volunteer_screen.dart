import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../../data/models/app_content_models.dart';
import '../../../data/repositories/user_repository_impl.dart';
import '../../../data/datasources/api_client.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../routes/app_router.dart';

class VolunteerScreen extends StatefulWidget {
  const VolunteerScreen({super.key});

  @override
  State<VolunteerScreen> createState() => _VolunteerScreenState();
}

class _VolunteerScreenState extends State<VolunteerScreen> {
  List<VolunteerRoleModel> _roles = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadRoles();
  }

  Future<void> _loadRoles() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final apiClient = ApiClient(prefs);
      final repo = UserRepositoryImpl(apiClient, prefs);
      final roles = await repo.getVolunteerRoles();
      if (mounted) {
        setState(() {
          _roles = roles;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  IconData _getIconData(String iconName) {
    switch (iconName) {
      case 'school': return Icons.school;
      case 'event': return Icons.event;
      case 'campaign': return Icons.campaign;
      case 'favorite': return Icons.favorite;
      case 'medical_services': return Icons.medical_services;
      case 'volunteer_activism': return Icons.volunteer_activism;
      case 'handshake': return Icons.handshake;
      case 'group': return Icons.group;
      case 'psychology': return Icons.psychology;
      case 'gavel': return Icons.gavel;
      default: return Icons.star;
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final bool useFallback = _roles.isEmpty && !_loading;

    // Localized fallback roles
    final fallbackRoles = [
      {'icon': 'school',    'title': l10n.roleTeaching,    'desc': l10n.roleTeachingDesc},
      {'icon': 'event',     'title': l10n.roleEvents,      'desc': l10n.roleEventsDesc},
      {'icon': 'campaign',  'title': l10n.roleAwareness,   'desc': l10n.roleAwarenessDesc},
      {'icon': 'favorite',  'title': l10n.roleCounselling, 'desc': l10n.roleCounsellingDesc},
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.getInvolvedTitle),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Hero Section
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: AppColors.bannerGradient2,
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: AppColors.softShadow,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Icon(Icons.volunteer_activism, size: 48, color: Colors.white),
                        const SizedBox(height: 16),
                        Text(
                          l10n.joinTheMovement,
                          style: TextStyle(fontFamily: AppTextStyles.fontFamily, fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white, letterSpacing: -0.5),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          l10n.volunteerHeroCTA,
                          style: TextStyle(fontFamily: AppTextStyles.fontFamily, fontSize: 16, color: Colors.white.withOpacity(0.95)),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  Text(l10n.waysToVolunteer, style: AppTextStyles.heading2),
                  const SizedBox(height: 16),

                  if (useFallback)
                    ...fallbackRoles.map((r) => _VolunteerOption(
                      icon: _getIconData(r['icon']!),
                      title: r['title']!,
                      description: r['desc']!,
                    ))
                  else
                    ..._roles.map((r) => _VolunteerOption(
                      icon: _getIconData(r.icon),
                      title: r.title,
                      description: r.description,
                    )),

                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, AppRouter.contact);
                      },
                      child: Text(l10n.contactUsToJoin),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}

class _VolunteerOption extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;

  const _VolunteerOption({
    required this.icon,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.surfaceVariant, width: 1.5),
        boxShadow: AppColors.softShadow,
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: AppColors.primary, size: 28),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text(description, style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
