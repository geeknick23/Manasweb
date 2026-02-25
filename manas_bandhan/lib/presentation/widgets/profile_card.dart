import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/constants/constants.dart';
import '../../../data/models/user_model.dart';
import '../../core/i18n/app_localizations.dart';

class ProfileCard extends StatelessWidget {
  final User user;
  final VoidCallback onTap;
  final VoidCallback onInterest;

  const ProfileCard({
    super.key,
    required this.user,
    required this.onTap,
    required this.onInterest,
  });

  Widget _buildProfileImage(String? path) {
    if (path == null || path.isEmpty) {
      return _buildPlaceholder();
    }

    if (path.startsWith('data:')) {
      try {
        final commaIndex = path.indexOf(',');
        final base64String = commaIndex != -1 ? path.substring(commaIndex + 1) : path;
        return Image.memory(
          base64Decode(base64String),
          fit: BoxFit.cover,
          alignment: Alignment.topCenter,
          errorBuilder: (context, error, stackTrace) => _buildPlaceholder(),
        );
      } catch (e) {
        return _buildPlaceholder();
      }
    }

    return CachedNetworkImage(
      imageUrl: _getImageUrl(path),
      fit: BoxFit.cover,
      alignment: Alignment.topCenter,
      placeholder: (context, url) => Container(
        color: AppColors.primaryLight.withOpacity(0.2),
        child: const Center(
          child: CircularProgressIndicator(),
        ),
      ),
      errorWidget: (context, url, error) => Container(
        color: Colors.grey.shade200,
        child: const Center(
           child: Icon(Icons.broken_image, size: 40, color: Colors.grey),
        ),
      ),
    );
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

  @override
  Widget build(BuildContext context) {
    final loc = AppLocalizations.of(context);
    
    return Card(
      elevation: 4,
      shadowColor: Colors.black.withOpacity(0.1),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image section
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  child: AspectRatio(
                    aspectRatio: 1.0, // Square ratio for better profile visibility
                    child: _buildProfileImage(user.profilePhoto),
                  ),
                ),
                // Verified badge
                if (user.isVerified)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: AppColors.success,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check, color: Colors.white, size: 12),
                    ),
                  ),
                 // ID Badge
                 Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.6),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '#${user.id.length > 6 ? user.id.substring(0, 6) : user.id}',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                 ),
              ],
            ),
            
            // Content section
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 12, 12, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min, // Important
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          user.fullName,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.more_horiz, color: Colors.grey, size: 20),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${user.profession ?? "Professional"} • ${loc.getEducation(user.education)}',
                    style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${user.age} ${loc.get('years')}',
                    style: const TextStyle(
                      fontSize: 12, 
                      color: Colors.black87,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${user.location?.displayLocation ?? "India"}',
                    style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  
                  // Action Buttons
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _buildCircleIcon(Icons.favorite_border),
                      const SizedBox(width: 8),
                      _buildCircleIcon(Icons.chat_bubble_outline),
                      const Spacer(),
                      InkWell(
                        onTap: onInterest,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            loc.get('sendInterest'),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
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

  Widget _buildCircleIcon(IconData icon) {
    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.primary, width: 1),
      ),
      child: Icon(icon, size: 14, color: AppColors.primary),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      color: AppColors.primaryLight.withOpacity(0.2),
      child: const Center(
        child: Icon(
          Icons.person,
          size: 64,
          color: AppColors.primary,
        ),
      ),
    );
  }
}

class _InfoChip extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoChip({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AppColors.textSecondary),
          const SizedBox(width: 4),
          Flexible(
            child: Text(
              label,
              style: AppTextStyles.caption.copyWith(
                color: AppColors.textSecondary,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
