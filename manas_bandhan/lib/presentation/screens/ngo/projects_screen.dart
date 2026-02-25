import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/l10n/app_localizations.dart';

class ProjectsScreen extends StatelessWidget {
  const ProjectsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.ourProjectsTitle),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _ProjectCard(
            icon: Icons.favorite,
            title: l10n.project1Title,
            description: l10n.project1Desc,
            highlights: [
              l10n.project1Highlight1,
              l10n.project1Highlight2,
              l10n.project1Highlight3,
              l10n.project1Highlight4,
            ],
            color: AppColors.primary,
          ),
          const SizedBox(height: 16),
          _ProjectCard(
            icon: Icons.school,
            title: l10n.project2Title,
            description: l10n.project2Desc,
            highlights: [
              l10n.project2Highlight1,
              l10n.project2Highlight2,
              l10n.project2Highlight3,
              l10n.project2Highlight4,
            ],
            color: AppColors.success,
          ),
          const SizedBox(height: 16),
          _ProjectCard(
            icon: Icons.elderly,
            title: l10n.project3Title,
            description: l10n.project3Desc,
            highlights: [
              l10n.project3Highlight1,
              l10n.project3Highlight2,
              l10n.project3Highlight3,
              l10n.project3Highlight4,
            ],
            color: AppColors.info,
          ),
          const SizedBox(height: 32),
          Text(l10n.upcomingEventsTitle, style: AppTextStyles.heading3),
          const SizedBox(height: 16),
          // Event Cards
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.surfaceVariant, width: 1.5),
              boxShadow: AppColors.softShadow,
            ),
            child: Row(
              children: [
                Container(
                   padding: const EdgeInsets.all(12),
                   decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                   child: Column(
                     children: [
                       const Text('15', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.primary)),
                       Text(l10n.monthMay, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.primary)),
                     ],
                   ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(l10n.event1Title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.location_on, size: 14, color: Colors.grey),
                          const SizedBox(width: 4),
                          Text(l10n.event1Loc, style: const TextStyle(color: Colors.grey)),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.surfaceVariant, width: 1.5),
              boxShadow: AppColors.softShadow,
            ),
            child: Row(
              children: [
                Container(
                   padding: const EdgeInsets.all(12),
                   decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                   child: Column(
                     children: [
                       const Text('22', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.primary)),
                       Text(l10n.monthMay, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.primary)),
                     ],
                   ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(l10n.event2Title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.location_on, size: 14, color: Colors.grey),
                          const SizedBox(width: 4),
                          Text(l10n.event2Loc, style: const TextStyle(color: Colors.grey)),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.surfaceVariant, width: 1.5),
              boxShadow: AppColors.softShadow,
            ),
            child: Row(
              children: [
                Container(
                   padding: const EdgeInsets.all(12),
                   decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                   child: Column(
                     children: [
                       const Text('10', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppColors.primary)),
                       Text(l10n.monthJun, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppColors.primary)),
                     ],
                   ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(l10n.event3Title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.location_on, size: 14, color: Colors.grey),
                          const SizedBox(width: 4),
                          Text(l10n.event3Loc, style: const TextStyle(color: Colors.grey)),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }
}

class _ProjectCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final List<String> highlights;
  final Color color;

  const _ProjectCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.highlights,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.surfaceVariant, width: 1.5),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Icon(icon, color: Colors.white, size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Text(
                    title,
                    style: AppTextStyles.heading3.copyWith(color: color),
                  ),
                ),
              ],
            ),
          ),
          
          // Content
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  description,
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: AppColors.textSecondary,
                    height: 1.6,
                  ),
                ),
                const SizedBox(height: 20),
                
                // Highlights
                ...highlights.map((h) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(Icons.check_circle, color: color, size: 18),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          h,
                          style: AppTextStyles.bodySmall.copyWith(height: 1.4),
                        ),
                      ),
                    ],
                  ),
                )),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
