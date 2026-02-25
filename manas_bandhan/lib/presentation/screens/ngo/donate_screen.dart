import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/constants/constants.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../../data/models/app_content_models.dart';
import '../../../data/repositories/user_repository_impl.dart';
import '../../../data/datasources/api_client.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DonateScreen extends StatefulWidget {
  const DonateScreen({super.key});

  @override
  State<DonateScreen> createState() => _DonateScreenState();
}

class _DonateScreenState extends State<DonateScreen> {
  DonateInfoModel? _donateInfo;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadDonateInfo();
  }

  Future<void> _loadDonateInfo() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final apiClient = ApiClient(prefs);
      final repo = UserRepositoryImpl(apiClient, prefs);
      final info = await repo.getDonateInfo();
      if (mounted) {
        setState(() {
          _donateInfo = info;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  String get _bankName => _donateInfo?.bankName ?? AppConstants.bankName;
  String get _accountName => _donateInfo?.accountName ?? AppConstants.accountName;
  String get _accountNumber => _donateInfo?.accountNumber ?? AppConstants.accountNumber;
  String get _ifscCode => _donateInfo?.ifscCode ?? AppConstants.ifscCode;
  String get _upiId => _donateInfo?.upiId ?? AppConstants.upiId;
  String _taxNote(BuildContext context) => _donateInfo?.taxExemptionNote ?? AppLocalizations.of(context).taxNote;
  String _headerTitle(BuildContext context) => _donateInfo?.headerTitle ?? AppLocalizations.of(context).supportOurCause;
  String _headerSubtitle(BuildContext context) => _donateInfo?.headerSubtitle ?? AppLocalizations.of(context).donateHeaderSubtitle;

  void _copyToClipboard(BuildContext context, String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$label ${AppLocalizations.of(context).copiedToClipboard}'),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  Future<void> _launchUpiApp(BuildContext context, String app) async {
    String uriStr;
    switch (app) {
      case 'GPay':
        uriStr = 'upi://pay?pa=$_upiId&pn=$_accountName&cu=INR';
        break;
      case 'PhonePe':
        uriStr = 'upi://pay?pa=$_upiId&pn=$_accountName&cu=INR';
        break;
      case 'Paytm':
        uriStr = 'upi://pay?pa=$_upiId&pn=$_accountName&cu=INR';
        break;
      default:
        uriStr = 'upi://pay?pa=$_upiId&pn=$_accountName&cu=INR';
    }
    final uri = Uri.parse(uriStr);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    } else {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('$app ${AppLocalizations.of(context).notInstalled}'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        appBar: AppBar(title: Text(AppLocalizations.of(context).donateTitle)),
        body: const Center(child: CircularProgressIndicator()),
      );
    }
    final l10n = AppLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.donateTitle),
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
                borderRadius: BorderRadius.circular(24),
                boxShadow: AppColors.softShadow,
              ),
              child: Column(
                children: [
                  const Icon(
                    Icons.volunteer_activism,
                    size: 64,
                    color: Colors.white,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _headerTitle(context),
                    style: TextStyle(
                      fontFamily: AppTextStyles.fontFamily,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _headerSubtitle(context),
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.9),
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Impact cards
            Text(l10n.yourDonationCan, style: AppTextStyles.heading3),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _ImpactCard(
                    icon: Icons.favorite,
                    title: l10n.impactCard1Title,
                    subtitle: l10n.impactCard1Subtitle,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _ImpactCard(
                    icon: Icons.school,
                    title: l10n.impactCard2Title,
                    subtitle: l10n.impactCard2Subtitle,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 32),
            
            // Bank Transfer
            Text(l10n.bankTransfer, style: AppTextStyles.heading3),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.surfaceVariant, width: 1.5),
                boxShadow: AppColors.softShadow,
              ),
              child: Column(
                children: [
                   _BankDetailRow(
                    label: l10n.accountNameLabel,
                    value: _accountName,
                    onCopy: () => _copyToClipboard(context, _accountName, l10n.accountNameLabel),
                  ),
                  const Divider(),
                  _BankDetailRow(
                    label: l10n.bankLabel,
                    value: _bankName,
                    onCopy: () => _copyToClipboard(context, _bankName, l10n.bankLabel),
                  ),
                  const Divider(),
                  _BankDetailRow(
                    label: l10n.accountNumberLabel,
                    value: _accountNumber,
                    onCopy: () => _copyToClipboard(context, _accountNumber, l10n.accountNumberLabel),
                  ),
                  const Divider(),
                  _BankDetailRow(
                    label: l10n.ifscCodeLabel,
                    value: _ifscCode,
                    onCopy: () => _copyToClipboard(context, _ifscCode, l10n.ifscCodeLabel),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            
            // UPI
            Text(l10n.upiPayment, style: AppTextStyles.heading3),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.surfaceVariant, width: 1.5),
                boxShadow: AppColors.softShadow,
              ),
              child: Column(
                children: [
                  // QR Code placeholder
                  Container(
                    width: 180,
                    height: 180,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade300),
                    ),
                    child: Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.qr_code_2, size: 80, color: AppColors.primary),
                          const SizedBox(height: 8),
                          Text(
                             l10n.scanToPay,
                            style: const TextStyle(color: AppColors.textSecondary),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  InkWell(
                    onTap: () => _copyToClipboard(context, _upiId, 'UPI ID'),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'UPI ID: $_upiId',
                          style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(width: 8),
                        const Icon(Icons.copy, size: 16, color: AppColors.primary),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _UpiButton(label: 'GPay', icon: Icons.payment, onTap: () => _launchUpiApp(context, 'GPay')),
                      const SizedBox(width: 12),
                      _UpiButton(label: 'PhonePe', icon: Icons.phone_android, onTap: () => _launchUpiApp(context, 'PhonePe')),
                      const SizedBox(width: 12),
                      _UpiButton(label: 'Paytm', icon: Icons.account_balance_wallet, onTap: () => _launchUpiApp(context, 'Paytm')),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Tax exemption note
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.info.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: AppColors.info),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      _taxNote(context),
                      style: AppTextStyles.bodySmall.copyWith(color: AppColors.info),
                    ),
                  ),
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

class _ImpactCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;

  const _ImpactCard({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppColors.surfaceVariant, width: 1.5),
        boxShadow: AppColors.softShadow,
      ),
      child: Column(
        children: [
          Icon(icon, color: AppColors.primary, size: 32),
          const SizedBox(height: 12),
          Text(
            title,
            style: TextStyle(
              fontFamily: AppTextStyles.fontFamily,
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.primary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            textAlign: TextAlign.center,
            style: AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}

class _BankDetailRow extends StatelessWidget {
  final String label;
  final String value;
  final VoidCallback onCopy;

  const _BankDetailRow({
    required this.label,
    required this.value,
    required this.onCopy,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.bodySmall.copyWith(color: AppColors.textSecondary),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: AppTextStyles.bodyMedium.copyWith(fontWeight: FontWeight.bold),
              ),
            ],
          ),
          IconButton(
            onPressed: onCopy,
            icon: const Icon(Icons.copy, size: 18, color: AppColors.primary),
          ),
        ],
      ),
    );
  }
}

class _UpiButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  const _UpiButton({
    required this.label,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.primary),
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: AppColors.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
