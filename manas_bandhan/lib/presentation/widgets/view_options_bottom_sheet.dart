import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../domain/repositories/user_repository.dart';

class ViewOptionsBottomSheet extends StatefulWidget {
  final SortOption? sort;
  final int? limit;
  final void Function(SortOption?, int?) onApply;

  const ViewOptionsBottomSheet({
    super.key,
    this.sort,
    this.limit,
    required this.onApply,
  });

  @override
  State<ViewOptionsBottomSheet> createState() => _ViewOptionsBottomSheetState();
}

class _ViewOptionsBottomSheetState extends State<ViewOptionsBottomSheet> {
  SortOption? _sort;
  int? _limit;

  @override
  void initState() {
    super.initState();
    _sort = widget.sort;
    _limit = widget.limit ?? 10;
  }

  void _resetOptions() {
    setState(() {
      _sort = null;
      _limit = 10;
    });
  }

  String _getSortLabel(SortOption option) {
    switch (option) {
      case SortOption.newest:
        return 'Newest First';
      case SortOption.oldest:
        return 'Oldest First';
      case SortOption.ageAsc:
        return 'Age (Low to High)';
      case SortOption.ageDesc:
        return 'Age (High to Low)';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Handle
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.only(top: 12),
            decoration: BoxDecoration(
              color: Colors.grey.shade300,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('View Options', style: AppTextStyles.heading3),
                TextButton(
                  onPressed: _resetOptions,
                  child: const Text('Reset'),
                ),
              ],
            ),
          ),
          
          const Divider(height: 1),
          
          // Options
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Sort Order
                Text(
                  'Sort By',
                  style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: SortOption.values.map((option) {
                    return FilterChip(
                      label: Text(_getSortLabel(option)),
                      selected: _sort == option,
                      onSelected: (selected) {
                        setState(() => _sort = selected ? option : null);
                      },
                    );
                  }).toList(),
                ),
                
                const SizedBox(height: 24),

                // Profiles Per Page
                Text(
                  'Profiles Per Page',
                  style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 12),
                SegmentedButton<int>(
                  segments: const [
                    ButtonSegment(value: 10, label: Text('10')),
                    ButtonSegment(value: 20, label: Text('20')),
                    ButtonSegment(value: 50, label: Text('50')),
                  ],
                  selected: {_limit ?? 10},
                  onSelectionChanged: (newSelection) {
                    setState(() => _limit = newSelection.first);
                  },
                  style: ButtonStyle(
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    visualDensity: VisualDensity.compact,
                  ),
                ),
              ],
            ),
          ),
          
          // Apply button
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () {
                    widget.onApply(_sort, _limit);
                    Navigator.pop(context);
                  },
                  child: const Text('Apply Changes'),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
