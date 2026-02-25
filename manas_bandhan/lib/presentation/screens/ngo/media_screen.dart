import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../widgets/formatted_text_display.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/constants/constants.dart';
import '../../../data/models/home_models.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../blocs/home/home_bloc.dart';

class MediaScreen extends StatelessWidget {
  const MediaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // We can reuse HomeBloc or fetch fresh data. Reusing HomeBloc state if available is better, 
    // but this screen might be accessed directly.
    // For now, let's assume we can trigger a fresh load or pass data.
    // Simpler: Just rely on HomeBloc being available up the tree or create a local simple fetch.
    // Given the architecture, let's just make it a simple consumer of HomeBloc for now, 
    // or just show a nice placeholder if we want to move fast, but the user wants "features".
    // Better: Allow HomeBloc to be accessed here.
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Media Coverage'),
      ),
      body: BlocBuilder<HomeBloc, HomeState>(
        builder: (context, state) {
          if (state is HomeLoading) {
             return const Center(child: CircularProgressIndicator());
          }
           if (state is HomeError) {
             return Center(child: Text('Failed to load media: ${state.message}'));
           }
           if (state is HomeLoaded) {
             final mediaCards = state.mediaCards;
             if (mediaCards.isEmpty) {
                return const Center(child: Text('No media coverage data available.'));
             }
             return ListView.builder(
               padding: const EdgeInsets.all(16),
               itemCount: mediaCards.length,
               itemBuilder: (context, index) {
                 final card = mediaCards[index];
                 return _MediaListCard(card: card);
               },
             );
           }
           // Fallback if not loaded (e.g. came from deep link? unlikely here)
           // Trigger load if needed?
           return const Center(child: Text('Please wait...'));
        },
      ),
    );
  }
}

class _MediaListCard extends StatelessWidget {
  final MediaCardModel card;

  const _MediaListCard({required this.card});

  Future<void> _openArticle(BuildContext context) async {
    if (card.articleUrl != null && card.articleUrl!.isNotEmpty) {
      String urlString = card.articleUrl!;
      if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
        urlString = 'https://$urlString';
      }
      final uri = Uri.parse(urlString);
      
      try {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } catch (e) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Could not open article')),
          );
        }
      }
    } else {
      // Show detailed description in a dialog if no URL
      _showDetailDialog(context);
    }
  }

  void _showDetailDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(card.title),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              if (card.imageUrl.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.network(
                      card.imageUrl.startsWith('http') 
                        ? card.imageUrl 
                        : '${ApiConstants.baseUrl}${card.imageUrl}',
                      fit: BoxFit.cover,
                      errorBuilder: (_,__,___) => const SizedBox.shrink(),
                    ),
                  ),
                ),
              Row(
                children: [
                  const Icon(Icons.newspaper, size: 14, color: AppColors.primary),
                  const SizedBox(width: 6),
                  Text(card.source, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                  const Spacer(),
                  Text(card.date, style: AppTextStyles.caption),
                ],
              ),
              const SizedBox(height: 12),
              const SizedBox(height: 12),
              FormattedTextDisplay(
                card.detailedDescription ?? card.description,
                style: AppTextStyles.bodyMedium.copyWith(
                  height: 1.5,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => card.articleUrl != null ? _openArticle(context) : _showDetailDialog(context),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
             BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0,2)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (card.imageUrl.isNotEmpty)
               ClipRRect(
                 borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                 child: Image.network(
                   card.imageUrl.startsWith('http') 
                      ? card.imageUrl 
                      : '${ApiConstants.baseUrl}${card.imageUrl}',
                   height: 180,
                   width: double.infinity,
                   fit: BoxFit.cover,
                   errorBuilder: (_,__,___) => const SizedBox.shrink(),
                 ),
               ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.newspaper, size: 16, color: AppColors.primary),
                      const SizedBox(width: 8),
                      Text(card.source, style: AppTextStyles.caption.copyWith(fontWeight: FontWeight.bold, color: AppColors.primary)),
                      const Spacer(),
                      Text(card.date, style: AppTextStyles.caption),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    card.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    card.description,
                    style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Text(
                        card.articleUrl != null ? 'Read Article' : 'Read More',
                        style: const TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Icon(
                        card.articleUrl != null ? Icons.open_in_new : Icons.arrow_forward,
                        size: 16,
                        color: AppColors.primary,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
