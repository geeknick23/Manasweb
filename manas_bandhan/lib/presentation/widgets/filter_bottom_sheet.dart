import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';
import '../../data/models/user_model.dart';

class FilterBottomSheet extends StatefulWidget {
  final RangeValues ageRange;
  final MaritalStatus? maritalStatus;
  final Education? education;
  final String? district;
  final void Function(RangeValues, MaritalStatus?, Education?, String?) onApply;

  const FilterBottomSheet({
    super.key,
    required this.ageRange,
    this.maritalStatus,
    this.education,
    this.district,
    required this.onApply,
  });

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  late RangeValues _ageRange;
  MaritalStatus? _maritalStatus;
  Education? _education;
  String? _district;

  final List<String> _districts = [
    'Buldhana',
    'Akola',
    'Amravati',
    'Washim',
    'Yavatmal',
    'Nagpur',
  ];

  @override
  void initState() {
    super.initState();
    _ageRange = widget.ageRange;
    _maritalStatus = widget.maritalStatus;
    _education = widget.education;
    _district = widget.district;
  }

  void _resetFilters() {
    setState(() {
      _ageRange = const RangeValues(18, 60);
      _maritalStatus = null;
      _education = null;
      _district = null;
    });
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
                Text('Filter Profiles', style: AppTextStyles.heading3),
                TextButton(
                  onPressed: _resetFilters,
                  child: const Text('Reset'),
                ),
              ],
            ),
          ),
          
          const Divider(height: 1),
          
          // Filters
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Age Range
                  Text(
                    'Age Range: ${_ageRange.start.toInt()} - ${_ageRange.end.toInt()} years',
                    style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 8),
                  RangeSlider(
                    values: _ageRange,
                    min: 18,
                    max: 70,
                    divisions: 52,
                    labels: RangeLabels(
                      '${_ageRange.start.toInt()}',
                      '${_ageRange.end.toInt()}',
                    ),
                    onChanged: (values) => setState(() => _ageRange = values),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Marital Status
                  Text(
                    'Marital Status',
                    style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      FilterChip(
                        label: const Text('All'),
                        selected: _maritalStatus == null,
                        onSelected: (_) => setState(() => _maritalStatus = null),
                      ),
                      ...MaritalStatus.values.map((status) {
                        return FilterChip(
                          label: Text(status.name),
                          selected: _maritalStatus == status,
                          onSelected: (_) => setState(() => _maritalStatus = status),
                        );
                      }),
                    ],
                  ),
                  
                  const SizedBox(height: 24),

                  // Education
                  Text(
                    'Education',
                    style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      FilterChip(
                        label: const Text('All'),
                        selected: _education == null,
                        onSelected: (_) => setState(() => _education = null),
                      ),
                      ...Education.values.map((edu) {
                        return FilterChip(
                          label: Text(edu.name),
                          selected: _education == edu,
                          onSelected: (_) => setState(() => _education = edu),
                        );
                      }),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // District
                  Text(
                    'District',
                    style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      FilterChip(
                        label: const Text('All'),
                        selected: _district == null,
                        onSelected: (_) => setState(() => _district = null),
                      ),
                      ..._districts.map((d) {
                        return FilterChip(
                          label: Text(d),
                          selected: _district == d,
                          onSelected: (_) => setState(() => _district = d),
                        );
                      }),
                    ],
                  ),
                ],
              ),
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
                    widget.onApply(_ageRange, _maritalStatus, _education, _district);
                    Navigator.pop(context);
                  },
                  child: const Text('Apply Filters'),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
