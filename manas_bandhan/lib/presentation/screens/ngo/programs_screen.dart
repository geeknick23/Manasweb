import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/models/app_content_models.dart';
import '../../../data/repositories/user_repository_impl.dart';
import '../../../data/datasources/api_client.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../routes/app_router.dart';

class ProgramsScreen extends StatefulWidget {
  const ProgramsScreen({super.key});

  @override
  State<ProgramsScreen> createState() => _ProgramsScreenState();
}

class _ProgramsScreenState extends State<ProgramsScreen> {
  List<ProgramModel> _programs = [];
  bool _loading = true;

  // Hardcoded fallback data
  static const _fallbackPrograms = [
    {
      'title': 'Empowerment Through Skills',
      'desc': 'Providing vocational training and skill development workshops to empower widows towards financial independence. Our programs include tailoring, handicrafts, computer literacy, and small business management training.',
    },
    {
      'title': 'On-Ground Assistance',
      'desc': 'Offering practical help for day-to-day challenges, including administrative support, grievance redressal, and connecting beneficiaries with government schemes and welfare programs.',
    },
    {
      'title': 'Matchmaking Platform',
      'desc': 'A secure, dedicated online platform facilitating Punarvivah (remarriage) for widows and widowers. We organize regular Punarvivah Melavas and provide counseling support throughout the process.',
    },
    {
      'title': 'Legal Aid Support',
      'desc': 'Access to legal counsel and assistance for property rights, specialized guidance for divorce proceedings, document verification, and help with inheritance matters.',
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadPrograms();
  }

  Future<void> _loadPrograms() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final apiClient = ApiClient(prefs);
      final repo = UserRepositoryImpl(apiClient, prefs);
      final programs = await repo.getPrograms();
      if (mounted) {
        setState(() {
          _programs = programs;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  void _showProgramDetail(BuildContext context, String title, String desc, String? imageUrl) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.75,
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                margin: const EdgeInsets.only(top: 12),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            if (imageUrl != null && imageUrl.isNotEmpty)
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                child: Image.network(
                  imageUrl,
                  height: 200,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    height: 200,
                    color: AppColors.primary.withOpacity(0.1),
                    child: const Icon(Icons.image, size: 64, color: AppColors.primary),
                  ),
                ),
              )
            else
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.1),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                ),
                child: const Icon(Icons.image, size: 64, color: AppColors.primary),
              ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      desc,
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: AppColors.textSecondary,
                        height: 1.6,
                      ),
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () {
                          Navigator.pop(context);
                          Navigator.pushNamed(context, AppRouter.contact);
                        },
                        icon: const Icon(Icons.volunteer_activism),
                        label: const Text('Get Involved'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Use API data if available, otherwise fallback
    final bool useFallback = _programs.isEmpty && !_loading;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Our Programs'),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: useFallback ? _fallbackPrograms.length : _programs.length,
              itemBuilder: (context, index) {
                final String title;
                final String desc;
                final String? imageUrl;

                if (useFallback) {
                  title = _fallbackPrograms[index]['title']!;
                  desc = _fallbackPrograms[index]['desc']!;
                  imageUrl = null;
                } else {
                  title = _programs[index].title;
                  desc = _programs[index].description;
                  imageUrl = _programs[index].imageUrl;
                }

                return InkWell(
                  onTap: () => _showProgramDetail(context, title, desc, imageUrl),
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                          child: imageUrl != null && imageUrl.isNotEmpty
                              ? Image.network(
                                  imageUrl,
                                  height: 180,
                                  width: double.infinity,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) => Container(height: 180, color: AppColors.primary.withOpacity(0.1)),
                                )
                              : Container(
                                  height: 180,
                                  width: double.infinity,
                                  color: AppColors.primary.withOpacity(0.1),
                                  child: const Icon(Icons.auto_stories, size: 48, color: AppColors.primary),
                                ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                title,
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                desc,
                                style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary, height: 1.5),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 12),
                              Row(
                                children: [
                                  Text(
                                    'Learn More',
                                    style: TextStyle(
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  const Icon(Icons.arrow_forward, size: 16, color: AppColors.primary),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
