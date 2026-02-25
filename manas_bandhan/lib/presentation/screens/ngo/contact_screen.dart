import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/constants/constants.dart';
import '../../../data/models/app_content_models.dart';
import '../../../data/repositories/user_repository_impl.dart';
import '../../../data/datasources/api_client.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ContactScreen extends StatefulWidget {
  const ContactScreen({super.key});

  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen> {
  ContactInfoModel? _contactInfo;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadContactInfo();
  }

  Future<void> _loadContactInfo() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final apiClient = ApiClient(prefs);
      final repo = UserRepositoryImpl(apiClient, prefs);
      final info = await repo.getContactInfo();
      if (mounted) {
        setState(() {
          _contactInfo = info;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  String get _phone => _contactInfo?.phone ?? AppConstants.phone;
  String get _email => _contactInfo?.email ?? AppConstants.email;
  String get _address => _contactInfo?.address ?? AppConstants.address;
  double get _latitude => _contactInfo?.latitude ?? AppConstants.officeLatitude;
  double get _longitude => _contactInfo?.longitude ?? AppConstants.officeLongitude;

  Future<void> _launchPhone() async {
    final uri = Uri.parse('tel:$_phone');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  Future<void> _launchEmail() async {
    final uri = Uri.parse('mailto:$_email');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  Future<void> _launchMaps() async {
    final uri = Uri.parse(
      'https://www.google.com/maps/search/?api=1&query=$_latitude,$_longitude',
    );
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Contact Us')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    // Build office hours from API or defaults
    final officeHours = _contactInfo?.officeHours ?? [
      OfficeHourModel(day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM'),
      OfficeHourModel(day: 'Saturday', hours: '10:00 AM - 2:00 PM'),
      OfficeHourModel(day: 'Sunday', hours: 'Closed'),
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Contact Us'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                children: [
                  const Icon(
                    Icons.support_agent,
                    size: 64,
                    color: Colors.white,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Get In Touch',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'We\'re here to help you on your journey',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Contact options
            _ContactCard(
              icon: Icons.phone,
              title: 'Call Us',
              subtitle: _phone,
              color: AppColors.success,
              onTap: _launchPhone,
            ),
            _ContactCard(
              icon: Icons.email_outlined,
              title: 'Email Us',
              subtitle: _email,
              color: AppColors.info,
              onTap: _launchEmail,
            ),
            _ContactCard(
              icon: Icons.location_on,
              title: 'Visit Us',
              subtitle: _address,
              color: AppColors.secondary,
              onTap: _launchMaps,
            ),
            
            const SizedBox(height: 32),
            
            // Map placeholder
            Text('Our Location', style: AppTextStyles.heading3),
            const SizedBox(height: 16),
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppColors.surfaceVariant,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade300),
              ),
              child: InkWell(
                onTap: _launchMaps,
                borderRadius: BorderRadius.circular(16),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.map,
                      size: 64,
                      color: AppColors.primary.withOpacity(0.5),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Tap to open in Google Maps',
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Khamgaon, Maharashtra',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Office hours
            Text('Office Hours', style: AppTextStyles.heading3),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                children: [
                  for (int i = 0; i < officeHours.length; i++) ...[
                    _HoursRow(day: officeHours[i].day, hours: officeHours[i].hours),
                    if (i < officeHours.length - 1) const Divider(),
                  ],
                ],
              ),
            ),
            
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class _ContactCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _ContactCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(
          subtitle,
          style: const TextStyle(color: AppColors.textSecondary),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        trailing: const Icon(Icons.arrow_forward, color: AppColors.primary),
        onTap: onTap,
      ),
    );
  }
}

class _HoursRow extends StatelessWidget {
  final String day;
  final String hours;

  const _HoursRow({required this.day, required this.hours});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(day, style: AppTextStyles.bodyMedium),
          Text(
            hours,
            style: AppTextStyles.bodyMedium.copyWith(
              fontWeight: FontWeight.bold,
              color: hours == 'Closed' ? AppColors.error : AppColors.success,
            ),
          ),
        ],
      ),
    );
  }
}
