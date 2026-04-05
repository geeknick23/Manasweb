import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_theme.dart';
import '../../blocs/auth/auth_bloc.dart';
import '../../routes/app_router.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _emailFormKey = GlobalKey<FormState>();
  final _smsFormKey = GlobalKey<FormState>();
  
  // Email Login Controllers
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  
  // SMS Login Controllers
  final _smsPhoneController = TextEditingController();
  final _otpController = TextEditingController();
  bool _isOtpSent = false;
  
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _smsPhoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _handleEmailLogin() {
    if (_emailFormKey.currentState!.validate()) {
      context.read<AuthBloc>().add(
            LoginRequested(
              phoneOrEmail: _emailController.text.trim(),
              password: _passwordController.text,
            ),
          );
    }
  }

  void _handleSmsSendOtp() {
    if (_smsFormKey.currentState!.validate()) {
      context.read<AuthBloc>().add(
        SmsLoginRequested(
          phoneNumber: _smsPhoneController.text.trim(),
        )
      );
    } 
  }

  void _handleSmsVerify() {
    if (_otpController.text.length == 6) {
       context.read<AuthBloc>().add(
        VerifySmsLoginRequested(
           phoneNumber: _smsPhoneController.text.trim(),
           otp: _otpController.text.trim()
        )
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthLoading) {
          setState(() => _isLoading = true);
        } else {
          setState(() => _isLoading = false);
        }

        if (state is Authenticated) {
          Navigator.pushReplacementNamed(context, AppRouter.main);
        } else if (state is AuthNeedsOtpVerification) {
           // If we are in SMS tab, it means OTP was sent
           if (_tabController.index == 1) {
              setState(() => _isOtpSent = true);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('OTP sent to your phone via SMS')),
              );
           } else {
             // Email flow 2FA
              Navigator.pushNamed(
                context,
                AppRouter.otpVerification,
                arguments: {'email': state.identifier},
              );
           }
        } else if (state is AuthError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: AppColors.error,
              behavior: SnackBarBehavior.floating,
            ),
          );
        }
      },
      child: Scaffold(
        body: SingleChildScrollView(
          child: SizedBox(
            height: size.height,
            child: Stack(
              children: [
                // Top Gradient Background
                Container(
                  height: size.height * 0.45,
                  decoration: const BoxDecoration(
                    gradient: AppColors.primaryGradient,
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(50),
                      bottomRight: Radius.circular(50),
                    ),
                  ),
                ).animate()
                 .slideY(begin: -0.2, end: 0, duration: 800.ms, curve: Curves.easeOut)
                 .fadeIn(duration: 800.ms),
                
                // Content
                SafeArea(
                  child: Column(
                    children: [
                      const SizedBox(height: 30),
                      // Logo & Welcome Text
                      Image.asset(
                        'assets/images/logo.png',
                        height: 100,
                        width: 100,
                      ).animate()
                       .scale(duration: 600.ms, curve: Curves.elasticOut)
                       .then()
                       .shimmer(duration: 2.seconds, delay: 2.seconds),
                      
                      const SizedBox(height: 16),
                      Text(
                        'Manas Bandhan',
                        style: GoogleFonts.bonaNova(
                          fontSize: 32,
                          fontWeight: FontWeight.bold, // Using FontWeight.bold since GoogleFonts handles it
                          color: Colors.white,
                        ),
                      ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.5, end: 0),
                      
                      const SizedBox(height: 8),
                      Text(
                        'Find your perfect match', // Simplified to reduce complexity
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: Colors.white.withOpacity(0.9),
                        ),
                      ).animate().fadeIn(delay: 500.ms),
                      
                      const SizedBox(height: 40),
                      
                      // Main Card
                      Expanded(
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 24),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(32),
                              topRight: Radius.circular(32),
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 30,
                                offset: const Offset(0, -10),
                              ),
                            ],
                          ),
                          child: SingleChildScrollView(
                            padding: const EdgeInsets.all(24),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Text(
                                  'Welcome Back',
                                  style: AppTextStyles.heading2,
                                  textAlign: TextAlign.center,
                                ).animate().fadeIn(delay: 600.ms).moveY(begin: 20, end: 0),
                                
                                const SizedBox(height: 24),
                                
                                // Modern Tabs
                                Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade50,
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(color: Colors.grey.shade200),
                                  ),
                                  child: TabBar(
                                    controller: _tabController,
                                    indicator: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(16),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.08),
                                          blurRadius: 4,
                                          offset: const Offset(0, 2),
                                        ),
                                      ],
                                    ),
                                    labelColor: AppColors.primary,
                                    unselectedLabelColor: AppColors.textSecondary,
                                    indicatorSize: TabBarIndicatorSize.tab,
                                    dividerColor: Colors.transparent,
                                    labelStyle: const TextStyle(fontWeight: FontWeight.w600),
                                    onTap: (index) {
                                      setState(() { 
                                        _isOtpSent = false;
                                        _otpController.clear();
                                      });
                                    },
                                    tabs: const [
                                       Tab(text: 'Email', height: 44),
                                       Tab(text: 'SMS OTP', height: 44),
                                    ],
                                  ),
                                ).animate().fadeIn(delay: 700.ms),

                                const SizedBox(height: 32),
                                
                                // Tab Content
                                SizedBox(
                                  height: 350, // Height for form content
                                  child: TabBarView(
                                    controller: _tabController,
                                    physics: const NeverScrollableScrollPhysics(),
                                    children: [
                                      // Email Login Form
                                      Form(
                                        key: _emailFormKey,
                                        child: Column(
                                          children: [
                                            TextFormField(
                                              controller: _emailController,
                                              keyboardType: TextInputType.emailAddress,
                                              decoration: InputDecoration(
                                                labelText: 'Email or Phone',
                                                hintText: 'hello@example.com',
                                                prefixIcon: Icon(Icons.email_outlined, color: AppColors.primary.withOpacity(0.7)),
                                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                                                enabledBorder: OutlineInputBorder(
                                                  borderRadius: BorderRadius.circular(16),
                                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                                ),
                                              ),
                                              validator: (value) => (value?.isEmpty ?? true) ? 'Required' : null,
                                            ).animate().fadeIn(delay: 800.ms).slideX(begin: -0.1, end: 0),
                                            
                                            const SizedBox(height: 20),
                                            
                                            TextFormField(
                                              controller: _passwordController,
                                              obscureText: _obscurePassword,
                                              decoration: InputDecoration(
                                                labelText: 'Password',
                                                hintText: '••••••••',
                                                prefixIcon: Icon(Icons.lock_outline, color: AppColors.primary.withOpacity(0.7)),
                                                suffixIcon: IconButton(
                                                  icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility),
                                                  onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                                                ),
                                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                                                enabledBorder: OutlineInputBorder(
                                                  borderRadius: BorderRadius.circular(16),
                                                  borderSide: BorderSide(color: Colors.grey.shade300),
                                                ),
                                              ),
                                              validator: (value) => (value?.isEmpty ?? true) ? 'Required' : null,
                                            ).animate().fadeIn(delay: 900.ms).slideX(begin: 0.1, end: 0),
                                            
                                            Align(
                                              alignment: Alignment.centerRight,
                                              child: TextButton(
                                                onPressed: () => Navigator.pushNamed(context, AppRouter.forgotPassword),
                                                child: Text('Forgot Password?', style: TextStyle(color: AppColors.primary.withOpacity(0.8))),
                                              ),
                                            ),
                                            
                                            const SizedBox(height: 16),
                                            
                                            SizedBox(
                                              width: double.infinity,
                                              height: 56,
                                              child: ElevatedButton(
                                                onPressed: _isLoading ? null : _handleEmailLogin,
                                                style: ElevatedButton.styleFrom(
                                                  elevation: 8,
                                                  shadowColor: AppColors.primary.withOpacity(0.4),
                                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                                ),
                                                child: _isLoading
                                                    ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                                    : const Text('Sign In', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                                              ),
                                            ).animate().fadeIn(delay: 1000.ms).scale(),
                                          ],
                                        ),
                                      ),
                                      
                                      // SMS Login Form
                                      Form(
                                        key: _smsFormKey,
                                        child: Column(
                                          children: [
                                             TextFormField(
                                               controller: _smsPhoneController,
                                               enabled: !_isOtpSent,
                                               keyboardType: TextInputType.phone,
                                               decoration: InputDecoration(
                                                 labelText: 'Phone Number',
                                                 hintText: 'e.g., 919876543210',
                                                 prefixIcon: Icon(Icons.sms_outlined, color: AppColors.primary.withOpacity(0.7)),
                                                 border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                                               ),
                                               validator: (value) => (value?.isEmpty ?? true) ? 'Required' : null,
                                            ).animate().fadeIn(delay: 800.ms),
                                            
                                            if (_isOtpSent) ...[
                                               const SizedBox(height: 20),
                                               TextFormField(
                                                controller: _otpController,
                                                keyboardType: TextInputType.number,
                                                maxLength: 6,
                                                textAlign: TextAlign.center, 
                                                style: const TextStyle(fontSize: 24, letterSpacing: 8, fontWeight: FontWeight.bold),
                                                decoration: InputDecoration(
                                                  labelText: 'OTP Code',
                                                  hintText: '000000',
                                                  prefixIcon: const Icon(Icons.lock_clock_outlined),
                                                  counterText: '',
                                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                                                ),
                                              ).animate().fadeIn().shake(),
                                              
                                               Align(
                                                alignment: Alignment.centerRight,
                                                child: TextButton.icon(
                                                  icon: const Icon(Icons.edit, size: 14),
                                                  label: const Text('Change Number'),
                                                  onPressed: () => setState(() => _isOtpSent = false),
                                                ),
                                              ),
                                            ],
                                            const SizedBox(height: 24),
                                            SizedBox(
                                              width: double.infinity,
                                              height: 56,
                                              child: ElevatedButton(
                                                onPressed: _isLoading ? null : (_isOtpSent ? _handleSmsVerify : _handleSmsSendOtp),
                                                style: ElevatedButton.styleFrom(
                                                  elevation: 8,
                                                  shadowColor: AppColors.primary.withOpacity(0.4),
                                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                                ),
                                                child: _isLoading
                                                    ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                                    : Text(
                                                        _isOtpSent ? 'Verify & Login' : 'Send OTP via SMS',
                                                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                                      ),
                                              ),
                                            ).animate().fadeIn(delay: 900.ms),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),

                                // Footer Links
                                Row(
                                  children: [
                                    Expanded(child: Divider(color: Colors.grey.shade200)),
                                    const Padding(
                                      padding: EdgeInsets.symmetric(horizontal: 16),
                                      child: Text('OR', style: TextStyle(color: Colors.grey, fontSize: 12)),
                                    ),
                                    Expanded(child: Divider(color: Colors.grey.shade200)),
                                  ],
                                ),
                                const SizedBox(height: 24),
                                SizedBox(
                                  height: 56,
                                  width: double.infinity,
                                  child: OutlinedButton(
                                    onPressed: () => Navigator.pushNamed(context, AppRouter.register),
                                    style: OutlinedButton.styleFrom(
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                        side: BorderSide(color: AppColors.primary.withOpacity(0.5))
                                    ),
                                    child: const Text('Create New Account'),
                                  ),
                                ),
                                const SizedBox(height: 24),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    _FooterLink(text: 'Privacy Policy', onTap: () {}),
                                    const SizedBox(width: 16),
                                    const Text('•', style: TextStyle(color: Colors.grey)),
                                    const SizedBox(width: 16),
                                    _FooterLink(text: 'Terms of Service', onTap: () {}),
                                  ],
                                )
                              ],
                            ),
                          ),
                        ),
                      ).animate().slideY(begin: 1.0, end: 0, duration: 800.ms, curve: Curves.easeOutQuint),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _FooterLink extends StatelessWidget {
  final String text;
  final VoidCallback onTap;

  const _FooterLink({required this.text, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Text(
        text,
        style: AppTextStyles.caption.copyWith(
          color: AppColors.textSecondary,
          decoration: TextDecoration.underline,
        ),
      ),
    );
  }
}
