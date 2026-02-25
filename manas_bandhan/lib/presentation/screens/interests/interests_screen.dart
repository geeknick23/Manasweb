import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/constants/constants.dart';
import '../../../data/models/user_model.dart';
import '../../blocs/interests/interests_bloc.dart';
import '../../routes/app_router.dart';

class InterestsScreen extends StatefulWidget {
  const InterestsScreen({super.key});

  @override
  State<InterestsScreen> createState() => _InterestsScreenState();
}

class _InterestsScreenState extends State<InterestsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    context.read<InterestsBloc>().add(LoadInterests());
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Interests'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Received'),
            Tab(text: 'Sent'),
          ],
        ),
      ),
      body: BlocBuilder<InterestsBloc, InterestsState>(
        builder: (context, state) {
          if (state is InterestsLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is InterestsError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 64, color: AppColors.error.withOpacity(0.5)),
                  const SizedBox(height: 16),
                  Text(state.message),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => context.read<InterestsBloc>().add(LoadInterests()),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          final received = state.receivedInterests;
          final sent = state.sentInterests;

          return TabBarView(
            controller: _tabController,
            children: [
              _buildInterestsList(received, isReceived: true),
              _buildInterestsList(sent, isReceived: false),
            ],
          );
        },
      ),
    );
  }

  Widget _buildInterestsList(List<Interest> interests, {required bool isReceived}) {
    if (interests.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isReceived ? Icons.favorite_border : Icons.send,
              size: 64,
              color: AppColors.textHint.withOpacity(0.5),
            ),
            const SizedBox(height: 16),
            Text(
              isReceived ? 'No interests received yet' : 'You haven\'t sent any interests yet',
              style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
            ),
            if (!isReceived)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Browse Profiles'),
                ),
              ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: interests.length,
      itemBuilder: (context, index) {
        final interest = interests[index];
        return _InterestCard(
          interest: interest,
          isReceived: isReceived,
          onAccept: isReceived && interest.status == InterestStatus.pending
              ? () => context.read<InterestsBloc>().add(
                    AcceptInterestEvent(userId: interest.user.id),
                  )
              : null,
          onReject: isReceived && interest.status == InterestStatus.pending
              ? () => context.read<InterestsBloc>().add(
                    RejectInterestEvent(userId: interest.user.id),
                  )
              : null,
          onViewProfile: () {
            Navigator.pushNamed(
              context,
              AppRouter.viewProfile,
              arguments: {'userId': interest.user.id},
            );
          },
        );
      },
    );
  }
}

class _InterestCard extends StatelessWidget {
  final Interest interest;
  final bool isReceived;
  final VoidCallback? onAccept;
  final VoidCallback? onReject;
  final VoidCallback onViewProfile;

  const _InterestCard({
    required this.interest,
    required this.isReceived,
    this.onAccept,
    this.onReject,
    required this.onViewProfile,
  });

  String _getImageUrl(String? path) {
    if (path == null || path.isEmpty) return '';
    if (path.startsWith('data:') || path.startsWith('http')) return path;
    return '${ApiConstants.baseUrl}$path';
  }

  Color _getStatusColor(InterestStatus status) {
    switch (status) {
      case InterestStatus.pending:
        return AppColors.warning;
      case InterestStatus.accepted:
        return AppColors.success;
      case InterestStatus.rejected:
        return AppColors.error;
    }
  }

  String _getStatusText(InterestStatus status) {
    switch (status) {
      case InterestStatus.pending:
        return 'Pending';
      case InterestStatus.accepted:
        return 'Accepted';
      case InterestStatus.rejected:
        return 'Declined';
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = interest.user;

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: onViewProfile,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Row(
                children: [
                  // Profile photo
                  CircleAvatar(
                    radius: 30,
                    backgroundColor: AppColors.primaryLight.withOpacity(0.3),
                    backgroundImage: user.profilePhoto != null
                        ? CachedNetworkImageProvider(_getImageUrl(user.profilePhoto))
                        : null,
                    child: user.profilePhoto == null
                        ? Text(
                            user.fullName.isNotEmpty ? user.fullName[0].toUpperCase() : '?',
                            style: const TextStyle(fontSize: 24, color: AppColors.primary),
                          )
                        : null,
                  ),
                  const SizedBox(width: 16),
                  // Info
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                user.fullName,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: _getStatusColor(interest.status).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                _getStatusText(interest.status),
                                style: TextStyle(
                                  color: _getStatusColor(interest.status),
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${user.age} years • ${user.maritalStatus.name} • ${user.location?.district ?? "N/A"}',
                          style: AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _formatDate(interest.sentAt),
                          style: AppTextStyles.caption,
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              // Contact info if accepted
              if (interest.status == InterestStatus.accepted) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.success.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.phone, color: AppColors.success, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        user.phoneNumber ?? 'Contact via app',
                        style: const TextStyle(
                          color: AppColors.success,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Spacer(),
                      const Icon(Icons.visibility, color: AppColors.success, size: 16),
                      const SizedBox(width: 4),
                      const Text(
                        'Contact revealed',
                        style: TextStyle(color: AppColors.success, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              ],

              // Action buttons for received pending interests
              if (isReceived && interest.status == InterestStatus.pending) ...[
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: onReject,
                        icon: const Icon(Icons.close, color: AppColors.error),
                        label: const Text('Decline', style: TextStyle(color: AppColors.error)),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppColors.error),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: onAccept,
                        icon: const Icon(Icons.check),
                        label: const Text('Accept'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.success,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    
    if (diff.inDays == 0) {
      return 'Today';
    } else if (diff.inDays == 1) {
      return 'Yesterday';
    } else if (diff.inDays < 7) {
      return '${diff.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}
