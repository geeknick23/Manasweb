import 'package:flutter/material.dart';
import '../../widgets/formatted_text_display.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/constants/constants.dart';
import '../../../data/models/home_models.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../blocs/home/home_bloc.dart';

class ImpactScreen extends StatelessWidget {
  const ImpactScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Our Impact'),
      ),
      body: BlocBuilder<HomeBloc, HomeState>(
        builder: (context, state) {
          if (state is HomeLoading) {
             return const Center(child: CircularProgressIndicator());
          }
           if (state is HomeError) {
             return Center(child: Text('Failed to load impact data: ${state.message}'));
           }
           if (state is HomeLoaded) {
             final impactCards = state.impactCards;
             if (impactCards.isEmpty) {
                return const Center(child: Text('No impact data available yet.'));
             }
             return ListView.builder(
               padding: const EdgeInsets.all(16),
               itemCount: impactCards.length,
               itemBuilder: (context, index) {
                 final card = impactCards[index];
                 return _ImpactListCard(card: card);
               },
             );
           }
           return const Center(child: Text('Please wait...'));
        },
      ),
    );
  }
}

class _ImpactListCard extends StatelessWidget {
  final ImpactCardModel card;

  const _ImpactListCard({required this.card});

  void _showDetailDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(card.title),
        content: SingleChildScrollView(
          child: Column(
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
      onTap: () => _showDetailDialog(context),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
             BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 8, offset: const Offset(0,4)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (card.imageUrl.isNotEmpty)
               ClipRRect(
                 borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                 child: Image.network(
                   card.imageUrl.startsWith('http') 
                      ? card.imageUrl 
                      : '${ApiConstants.baseUrl}${card.imageUrl}',
                   height: 200,
                   width: double.infinity,
                   fit: BoxFit.cover,
                   errorBuilder: (_,__,___) => Container(
                     height: 200,
                     color: Colors.grey.shade100,
                     child: const Icon(Icons.image_not_supported, size: 40, color: Colors.grey),
                   ),
                 ),
               ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    card.title,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    card.description,
                    style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary, height: 1.5),
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (card.detailedDescription != null && card.detailedDescription!.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Text(
                          'Read More',
                          style: const TextStyle(
                            color: AppColors.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(Icons.arrow_forward, size: 16, color: AppColors.primary),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
