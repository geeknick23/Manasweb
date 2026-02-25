import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shimmer/shimmer.dart';

import '../../../core/theme/app_theme.dart';
import '../../../data/models/user_model.dart';
import '../../../domain/repositories/user_repository.dart';
import '../../blocs/discovery/discovery_bloc.dart';
import '../../routes/app_router.dart';
import '../../widgets/profile_card.dart';
import '../../widgets/filter_bottom_sheet.dart';
import '../../widgets/view_options_bottom_sheet.dart';
import '../../../core/i18n/app_localizations.dart';
import '../../blocs/locale/locale_cubit.dart';

class DiscoveryScreen extends StatefulWidget {
  const DiscoveryScreen({super.key});

  @override
  State<DiscoveryScreen> createState() => _DiscoveryScreenState();
}

class _DiscoveryScreenState extends State<DiscoveryScreen> {
  // Filter state
  RangeValues _ageRange = const RangeValues(25, 45);
  MaritalStatus? _maritalStatusFilter;
  Education? _educationFilter;
  String? _districtFilter;
  SortOption? _sortOption;
  int? _limitOption;
  int _currentPage = 1;

  @override
  void initState() {
    super.initState();
    _loadProfiles();
  }

  void _loadProfiles() {
    context.read<DiscoveryBloc>().add(LoadProfiles(
      ageFrom: _ageRange.start.toInt(),
      ageTo: _ageRange.end.toInt(),
      maritalStatus: _maritalStatusFilter,
      education: _educationFilter,
      district: _districtFilter,
      sort: _sortOption,
      limit: _limitOption,
      page: _currentPage,
    ));
  }

  void _onPageChanged(int page) {
    setState(() {
      _currentPage = page;
    });
    _loadProfiles();
  }

  void _showFilters() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => FilterBottomSheet(
        ageRange: _ageRange,
        maritalStatus: _maritalStatusFilter,
        education: _educationFilter,
        district: _districtFilter,
        onApply: (ageRange, maritalStatus, education, district) {
          setState(() {
            _ageRange = ageRange;
            _maritalStatusFilter = maritalStatus;
            _educationFilter = education;
            _districtFilter = district;
            _currentPage = 1; // Reset to first page on filter change
          });
          _loadProfiles();
        },
      ),
    );
  }

  void _showViewOptions() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => ViewOptionsBottomSheet(
        sort: _sortOption,
        limit: _limitOption,
        onApply: (sort, limit) {
          setState(() {
            _sortOption = sort;
            _limitOption = limit;
            _currentPage = 1; // Reset to first page on options change
          });
          _loadProfiles();
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    context.watch<LocaleCubit>();
    final loc = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text(loc.get('findMatch')),
        actions: [
          IconButton(
            icon: Stack(
              children: [
                const Icon(Icons.sort),
                if (_sortOption != null || (_limitOption != null && _limitOption != 10))
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: AppColors.secondary,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: _showViewOptions,
          ),
          IconButton(
            icon: Stack(
              children: [
                const Icon(Icons.filter_list),
                if (_maritalStatusFilter != null || _districtFilter != null)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: AppColors.secondary,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            onPressed: _showFilters,
          ),
        ],
      ),
      body: BlocBuilder<DiscoveryBloc, DiscoveryState>(
        builder: (context, state) {
          if (state is DiscoveryLoading) {
            return _buildLoadingState();
          }
          
          if (state is DiscoveryError) {
            return _buildErrorState(state.message, loc);
          }
          
          final profiles = state.profiles;
          
          if (profiles.isEmpty) {
            return _buildEmptyState(loc);
          }
          
          return Column(
            children: [
              Expanded(
                child: RefreshIndicator(
                  onRefresh: () async => _loadProfiles(),
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: profiles.length,
                    itemBuilder: (context, index) {
                      final profile = profiles[index];
                      return ProfileCard(
                        user: profile,
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            AppRouter.viewProfile,
                            arguments: {'userId': profile.id},
                          );
                        },
                        onInterest: () {
                          context.read<DiscoveryBloc>().add(
                            ExpressInterestEvent(targetUserId: profile.id),
                          );
                        },
                      );
                    },
                  ),
                ),
              ),
              _buildPagination(state.totalPages),
            ],
          );
        },
      ),
    );
  }

  // ... existing pagination code ...

  Widget _buildPagination(int totalPages) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Previous Button
          IconButton(
            onPressed: _currentPage > 1 ? () => _onPageChanged(_currentPage - 1) : null,
            icon: const Icon(Icons.chevron_left),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
            iconSize: 20,
          ),
          const SizedBox(width: 8),
          
          // Page Numbers
          ...List.generate(totalPages, (index) {
            final page = index + 1;
            
            if (totalPages > 5) {
              if (page == 1 || page == totalPages || (page >= _currentPage - 1 && page <= _currentPage + 1)) {
                return _buildPageButton(page);
              }
              if (page == 2 && _currentPage > 3) {
                 return const Padding(padding: EdgeInsets.symmetric(horizontal: 2), child: Text('...', style: TextStyle(fontSize: 12)));
              }
              if (page == totalPages - 1 && _currentPage < totalPages - 2) {
                 return const Padding(padding: EdgeInsets.symmetric(horizontal: 2), child: Text('...', style: TextStyle(fontSize: 12)));
              }
              return const SizedBox.shrink();
            }
            
            return _buildPageButton(page);
          }),
          
          const SizedBox(width: 8),
          
          // Next Button
          IconButton(
            onPressed: _currentPage < totalPages ? () => _onPageChanged(_currentPage + 1) : null,
            icon: const Icon(Icons.chevron_right),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
            iconSize: 20,
          ),
        ],
      ),
    );
  }

  Widget _buildPageButton(int page) {
    final bool isSelected = page == _currentPage;
    return GestureDetector(
      onTap: () => _onPageChanged(page),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 2),
        width: 28,
        height: 28,
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
          border: isSelected ? null : Border.all(color: Colors.grey.shade300),
        ),
        alignment: Alignment.center,
        child: Text(
          '$page',
          style: TextStyle(
            fontSize: 12,
            color: isSelected ? Colors.white : Colors.black,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingState() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 5,
      itemBuilder: (context, index) {
        return Shimmer.fromColors(
          baseColor: Colors.grey.shade300,
          highlightColor: Colors.grey.shade100,
          child: Container(
            height: 200,
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
            ),
          ),
        );
      },
    );
  }

  Widget _buildErrorState(String message, AppLocalizations loc) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline,
            size: 64,
            color: AppColors.error.withOpacity(0.5),
          ),
          const SizedBox(height: 16),
          Text(
            loc.get('somethingWrong'),
            style: AppTextStyles.heading3,
          ),
          const SizedBox(height: 8),
          Text(
            message,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: _loadProfiles,
            icon: const Icon(Icons.refresh),
            label: Text(loc.get('tryAgain')),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(AppLocalizations loc) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search_off,
            size: 64,
            color: AppColors.textHint.withOpacity(0.5),
          ),
          const SizedBox(height: 16),
          Text(
            loc.get('noProfiles'),
            style: AppTextStyles.heading3,
          ),
          const SizedBox(height: 8),
          Text(
            loc.get('tryAdjusting'),
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 24),
          OutlinedButton.icon(
            onPressed: _showFilters,
            icon: const Icon(Icons.filter_list),
            label: Text(loc.get('adjustFilters')),
          ),
        ],
      ),
    );
  }
}
