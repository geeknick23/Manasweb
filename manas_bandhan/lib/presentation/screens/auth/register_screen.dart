import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';

import '../../../core/theme/app_theme.dart';
import '../../../data/models/user_model.dart';
import '../../blocs/auth/auth_bloc.dart';
import '../../routes/app_router.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _pageController = PageController();
  int _currentPage = 0;
  bool _isLoading = false;

  // Form controllers
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _professionController = TextEditingController();
  final _villageController = TextEditingController();
  final _tehsilController = TextEditingController();
  final _districtController = TextEditingController();
  final _guardianNameController = TextEditingController();
  final _guardianContactController = TextEditingController();

  // Form values
  File? _profileImage;
  DateTime? _dateOfBirth;
  Gender _gender = Gender.male;
  MaritalStatus _maritalStatus = MaritalStatus.widow;
  Education _education = Education.highSchool;
  Religion? _religion;
  Caste? _caste;
  int _childrenCount = 0;
  String _verificationMethod = 'email'; // 'email' or 'sms'

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      // Compress image
      final filePath = pickedFile.path;
      final lastIndex = filePath.lastIndexOf(new RegExp(r'.jp'));
      
      String outPath;
      if (lastIndex != -1) {
         final splitted = filePath.substring(0, (lastIndex));
         outPath = "${splitted}_out${filePath.substring(lastIndex)}";
      } else {
         outPath = "${filePath}_out.jpg";
      }
      
      var result = await FlutterImageCompress.compressAndGetFile(
        pickedFile.path, 
        outPath,
        quality: 70,
        minWidth: 500,
        minHeight: 500,
      );

      if (result != null) {
        setState(() {
          _profileImage = File(result.path);
        });
      }
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _professionController.dispose();
    _villageController.dispose();
    _tehsilController.dispose();
    _districtController.dispose();
    _guardianNameController.dispose();
    _guardianContactController.dispose();
    super.dispose();
  }

  void _nextPage() {
    bool isValid = false;
    
    // Validate fields on the current page before proceeding
    if (_currentPage == 0) {
       // Validate Basic Info
       final isEmailValid = _verificationMethod == 'sms' || 
                            (_emailController.text.isNotEmpty && _emailController.text.contains('@'));
       final isPhoneValid = _phoneController.text.isNotEmpty && _phoneController.text.length >= 10;
       final isPasswordValid = _passwordController.text.isNotEmpty && _passwordController.text.length >= 6;
       final isConfirmMatch = _confirmPasswordController.text == _passwordController.text;
       final isNameValid = _nameController.text.isNotEmpty;
       
       if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmMatch) {
         isValid = true;
       } else {
         // Trigger form validation to show errors
         _formKey.currentState!.validate();
       }
    } else if (_currentPage == 1) {
       // Validate Personal Details
       if (_dateOfBirth != null && _caste != null && _religion != null) {
         isValid = true;
       } else {
         if (_dateOfBirth == null) {
           ScaffoldMessenger.of(context).showSnackBar(
             const SnackBar(content: Text('Please select Date of Birth'), backgroundColor: AppColors.error),
           );
         } else {
           _formKey.currentState!.validate();
         }
       }
    }

    if (isValid && _currentPage < 2) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _previousPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      Navigator.pop(context);
    }
  }

  Future<void> _handleRegister() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);
      String profilePhoto = '';
      if (_profileImage != null) {
         try {
           final bytes = await _profileImage!.readAsBytes();
           String base64Image = base64Encode(bytes);
           profilePhoto = 'data:image/jpeg;base64,$base64Image';
         } catch (e) {
           debugPrint('Error encoding image: $e');
         }
      }

      final userData = {
        'full_name': _nameController.text.trim(),
        'email': _emailController.text.trim(),
        'phone_number': _phoneController.text.trim(),
        'password': _passwordController.text,
        'date_of_birth': (_dateOfBirth ?? DateTime.now()).toIso8601String().split('T')[0],
        'gender': _gender.name,
        'marital_status': User.maritalStatusToBackend(_maritalStatus),
        'education': User.educationToBackend(_education),
        'profession': _professionController.text.trim(),
        'location': {
          'village': _villageController.text.trim(),
          'tehsil': _tehsilController.text.trim(),
          'district': _districtController.text.trim(),
          'state': 'Maharashtra',
        },
        'guardian': {
          'name': _guardianNameController.text.trim(),
          'contact': _guardianContactController.text.trim(),
        },
        'caste': _caste?.name,
        'religion': _religion?.name,
        'children_count': _childrenCount,
        'profile_photo': profilePhoto,
        'verification_method': _verificationMethod,
      };

      if (!mounted) return;
      context.read<AuthBloc>().add(RegisterRequested(userData: userData));
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthLoading) {
          setState(() => _isLoading = true);
        } else {
          setState(() => _isLoading = false);
        }

        if (state is AuthNeedsOtpVerification) {
          Navigator.pushReplacementNamed(
            context,
            AppRouter.otpVerification,
            arguments: {'email': state.identifier},  // Updated to use identifier
          );
        } else if (state is AuthError) {
          final isEmailExists = state.message.toLowerCase().contains('already registered');
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: AppColors.error,
              duration: const Duration(seconds: 5),
              action: isEmailExists
                  ? SnackBarAction(
                      label: 'Login',
                      textColor: Colors.white,
                      onPressed: () {
                        Navigator.pushReplacementNamed(context, AppRouter.login);
                      },
                    )
                  : null,
            ),
          );
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Create Account'),
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: _previousPage,
          ),
        ),
        body: Form(
          key: _formKey,
          child: Column(
            children: [
              // Custom Sleek Progress Indicator
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16),
                child: Row(
                  children: List.generate(3, (index) {
                    final isActive = index <= _currentPage;
                    return Expanded(
                      child: Container(
                        margin: EdgeInsets.only(right: index == 2 ? 0 : 8),
                        height: 6,
                        decoration: BoxDecoration(
                          color: isActive ? AppColors.primary : Colors.grey.shade200,
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    );
                  }),
                ),
              ),
              
              // Page content
              Expanded(
                child: PageView(
                  controller: _pageController,
                  physics: const NeverScrollableScrollPhysics(),
                  onPageChanged: (page) {
                    setState(() => _currentPage = page);
                  },
                  children: [
                    _buildBasicInfoPage(),
                    _buildPersonalDetailsPage(),
                    _buildLocationPage(),
                  ],
                ),
              ),
              
              // Navigation buttons
              Container(
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      offset: const Offset(0, -4),
                      blurRadius: 16,
                    ),
                  ],
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                    child: Row(
                      children: [
                        if (_currentPage > 0)
                          Expanded(
                            child: OutlinedButton(
                              onPressed: _previousPage,
                              style: OutlinedButton.styleFrom(
                                side: BorderSide(color: Colors.grey.shade300, width: 2),
                                foregroundColor: AppColors.textPrimary,
                              ),
                              child: const Text('Previous'),
                            ),
                          ),
                        if (_currentPage > 0) const SizedBox(width: 16),
                        Expanded(
                          flex: 2,
                          child: ElevatedButton(
                            onPressed: _isLoading
                                ? null
                                : (_currentPage < 2 ? _nextPage : _handleRegister),
                            child: _isLoading
                                ? const SizedBox(
                                    width: 24,
                                    height: 24,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Colors.white,
                                    ),
                                  )
                                : Text(_currentPage < 2 ? 'Next Step' : 'Create Account'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBasicInfoPage() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Basic Information', style: AppTextStyles.heading3),
          const SizedBox(height: 8),
          Text(
            'Tell us about yourself',
            style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
          ),
          const SizedBox(height: 24),
          
          // Form Card Container
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
                // Verification Method Toggle
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _verificationMethod = 'email'),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              color: _verificationMethod == 'email' 
                                  ? AppColors.primary 
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(8),
                              boxShadow: _verificationMethod == 'email'
                                  ? [BoxShadow(color: AppColors.primary.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 2))]
                                  : null,
                            ),
                            child: Text(
                              'Via Email',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: _verificationMethod == 'email' ? Colors.white : Colors.black87,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ),
                      Expanded(
                        child: GestureDetector(
                          onTap: () => setState(() => _verificationMethod = 'sms'),
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            decoration: BoxDecoration(
                              color: _verificationMethod == 'sms' 
                                  ? AppColors.primary 
                                  : Colors.transparent,
                              borderRadius: BorderRadius.circular(8),
                              boxShadow: _verificationMethod == 'sms'
                                  ? [BoxShadow(color: AppColors.primary.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 2))]
                                  : null,
                            ),
                            child: Text(
                              'Via SMS',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: _verificationMethod == 'sms' ? Colors.white : Colors.black87,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 32),

                // Profile Photo
                Center(
                  child: GestureDetector(
                    onTap: _pickImage,
                    child: Stack(
                      alignment: Alignment.bottomRight,
                      children: [
                        Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.05),
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.primary.withValues(alpha: 0.2), width: 2),
                            image: _profileImage != null
                                ? DecorationImage(
                                    image: FileImage(_profileImage!),
                                    fit: BoxFit.cover,
                                  )
                                : null,
                          ),
                          child: _profileImage == null
                              ? Icon(Icons.person, size: 60, color: AppColors.primary.withValues(alpha: 0.3))
                              : null,
                        ),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.camera_alt,
                            color: Colors.white,
                            size: 20,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    labelText: 'Full Name *',
                    prefixIcon: Icon(Icons.person_outline),
                  ),
                  validator: (v) => v?.isEmpty == true ? 'Required' : null,
                ),
                const SizedBox(height: 20),
                
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: InputDecoration(
                    labelText: _verificationMethod == 'email' ? 'Email *' : 'Email (Optional)',
                    prefixIcon: const Icon(Icons.email_outlined),
                  ),
                  validator: (v) {
                    if (_verificationMethod == 'email') {
                       if (v?.isEmpty == true) return 'Required';
                       if (!v!.contains('@')) return 'Invalid email';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                
                TextFormField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  maxLength: 10,
                  decoration: InputDecoration(
                    labelText: 'Phone Number *',
                    prefixIcon: const Icon(Icons.phone_outlined),
                    prefixText: '+91 ',
                    counterText: '',
                    suffixIcon: _verificationMethod == 'sms' 
                        ? const Icon(Icons.check_circle, color: AppColors.success) 
                        : null,
                  ),
                  validator: (v) {
                    if (v?.isEmpty == true) return 'Required';
                    if (v!.length < 10) return 'Enter 10 digit number';
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Password *',
                    prefixIcon: Icon(Icons.lock_outline),
                  ),
                  validator: (v) {
                    if (v?.isEmpty == true) return 'Required';
                    if (v!.length < 6) return 'Min 6 characters';
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                
                TextFormField(
                  controller: _confirmPasswordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Confirm Password *',
                    prefixIcon: Icon(Icons.lock_outline),
                  ),
                  validator: (v) {
                    if (v != _passwordController.text) return 'Passwords do not match';
                    return null;
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPersonalDetailsPage() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Personal Details', style: AppTextStyles.heading3),
          const SizedBox(height: 8),
          Text(
            'Help us find the right match for you',
            style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
          ),
          const SizedBox(height: 24),
          
          // Form Card Container
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.surfaceVariant, width: 1.5),
              boxShadow: AppColors.softShadow,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Gender
                Text('Gender *', style: AppTextStyles.bodyMedium),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: Gender.values.map((gender) {
                    final isSelected = _gender == gender;
                    return ChoiceChip(
                      label: Text(
                        gender.name.substring(0, 1).toUpperCase() + gender.name.substring(1),
                        style: TextStyle(
                          color: isSelected ? Colors.white : AppColors.textPrimary,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                      selected: isSelected,
                      selectedColor: AppColors.primary,
                      backgroundColor: Colors.grey.shade100,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      onSelected: (selected) {
                        if (selected) setState(() => _gender = gender);
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: 24),
                
                // Date of Birth
                Container(
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.1), shape: BoxShape.circle),
                      child: const Icon(Icons.cake_outlined, color: AppColors.primary),
                    ),
                    title: Text(
                      _dateOfBirth == null
                          ? 'Select Date of Birth *'
                          : '${_dateOfBirth!.day}/${_dateOfBirth!.month}/${_dateOfBirth!.year}',
                      style: TextStyle(
                        color: _dateOfBirth == null ? AppColors.textHint : AppColors.textPrimary,
                        fontWeight: _dateOfBirth != null ? FontWeight.w600 : FontWeight.normal,
                      ),
                    ),
                    trailing: const Icon(Icons.calendar_today, color: AppColors.primary),
                    onTap: () async {
                      final date = await showDatePicker(
                        context: context,
                        initialDate: DateTime(1990),
                        firstDate: DateTime(1950),
                        lastDate: DateTime.now(),
                        builder: (context, child) {
                          return Theme(
                            data: Theme.of(context).copyWith(
                              colorScheme: const ColorScheme.light(
                                primary: AppColors.primary,
                                onPrimary: Colors.white,
                                onSurface: Colors.black,
                              ),
                            ),
                            child: child!,
                          );
                        },
                      );
                      if (date != null) {
                        setState(() => _dateOfBirth = date);
                      }
                    },
                  ),
                ),
                const SizedBox(height: 24),
                
                // Marital Status
                Text('Marital Status *', style: AppTextStyles.bodyMedium),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: MaritalStatus.values.map((status) {
                    final isSelected = _maritalStatus == status;
                    return ChoiceChip(
                      label: Text(
                        status.name,
                        style: TextStyle(
                          color: isSelected ? Colors.white : AppColors.textPrimary,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                      selected: isSelected,
                      selectedColor: AppColors.primary,
                      backgroundColor: Colors.grey.shade100,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      onSelected: (selected) {
                        if (selected) setState(() => _maritalStatus = status);
                      },
                    );
                  }).toList(),
                ),
                
                const SizedBox(height: 24),
                
                // Caste
                DropdownButtonFormField<Caste>(
                  value: _caste,
                  decoration: const InputDecoration(
                    labelText: 'Caste *',
                    prefixIcon: Icon(Icons.people_outline),
                  ),
                  items: Caste.values.map((c) {
                    return DropdownMenuItem(value: c, child: Text(c.name.toUpperCase()));
                  }).toList(),
                  onChanged: (v) => setState(() => _caste = v),
                  validator: (v) => v == null ? 'Required' : null,
                ),
                const SizedBox(height: 20),

                // Religion
                DropdownButtonFormField<Religion>(
                  value: _religion,
                  decoration: const InputDecoration(
                    labelText: 'Religion *',
                    prefixIcon: Icon(Icons.temple_buddhist_outlined),
                  ),
                  items: Religion.values.map((r) {
                    return DropdownMenuItem(value: r, child: Text(r.name.toUpperCase()));
                  }).toList(),
                  onChanged: (v) => setState(() => _religion = v),
                  validator: (v) => v == null ? 'Required' : null,
                ),
                const SizedBox(height: 20),
                
                // Education
                DropdownButtonFormField<Education>(
                  initialValue: _education,
                  decoration: const InputDecoration(
                    labelText: 'Education *',
                    prefixIcon: Icon(Icons.school_outlined),
                  ),
                  items: Education.values.map((e) {
                    return DropdownMenuItem(value: e, child: Text(e.name));
                  }).toList(),
                  onChanged: (v) => setState(() => _education = v!),
                ),
                const SizedBox(height: 20),
                
                TextFormField(
                  controller: _professionController,
                  decoration: const InputDecoration(
                    labelText: 'Profession/Occupation',
                    prefixIcon: Icon(Icons.work_outline),
                  ),
                ),
                const SizedBox(height: 24),
                
                // Children count
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade50,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.1), shape: BoxShape.circle),
                        child: const Icon(Icons.child_care, color: AppColors.primary),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'Number of Children', 
                          style: TextStyle(fontWeight: FontWeight.w500, color: AppColors.textPrimary),
                          overflow: TextOverflow.ellipsis,
                        )
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            onPressed: _childrenCount > 0
                                ? () => setState(() => _childrenCount--)
                                : null,
                            icon: const Icon(Icons.remove_circle_outline),
                            color: _childrenCount > 0 ? AppColors.primary : Colors.grey,
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 12.0),
                            child: Text('$_childrenCount', style: AppTextStyles.heading3.copyWith(color: AppColors.primary)),
                          ),
                          IconButton(
                            onPressed: () => setState(() => _childrenCount++),
                            icon: const Icon(Icons.add_circle_outline, color: AppColors.primary),
                            padding: EdgeInsets.zero,
                            constraints: const BoxConstraints(),
                          ),
                        ],
                      )
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationPage() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Location & Guardian', style: AppTextStyles.heading3),
          const SizedBox(height: 8),
          Text(
            'Where do you live?',
            style: AppTextStyles.bodyMedium.copyWith(color: AppColors.textSecondary),
          ),
          const SizedBox(height: 24),
          
          // Form Card Container
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: AppColors.surfaceVariant, width: 1.5),
              boxShadow: AppColors.softShadow,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextFormField(
                  controller: _villageController,
                  decoration: const InputDecoration(
                    labelText: 'Village/Town *',
                    prefixIcon: Icon(Icons.location_on_outlined),
                  ),
                  validator: (v) => v?.isEmpty == true ? 'Required' : null,
                ),
                const SizedBox(height: 20),
                
                TextFormField(
                  controller: _tehsilController,
                  decoration: const InputDecoration(
                    labelText: 'Tehsil *',
                    prefixIcon: Icon(Icons.location_city_outlined),
                  ),
                  validator: (v) => v?.isEmpty == true ? 'Required' : null,
                ),
                const SizedBox(height: 20),
                
                TextFormField(
                  controller: _districtController,
                  decoration: const InputDecoration(
                    labelText: 'District *',
                    prefixIcon: Icon(Icons.map_outlined),
                  ),
                  validator: (v) => v?.isEmpty == true ? 'Required' : null,
                ),
                
                const SizedBox(height: 32),
                const Divider(height: 1),
                const SizedBox(height: 32),
                
                Text('Guardian Information', style: AppTextStyles.heading3),
                const SizedBox(height: 20),
                
                TextFormField(
                  controller: _guardianNameController,
                  decoration: const InputDecoration(
                    labelText: 'Guardian Name *',
                    prefixIcon: Icon(Icons.person_outline),
                  ),
                  validator: (v) => v?.isEmpty == true ? 'Required' : null,
                ),
                const SizedBox(height: 20),
                
                TextFormField(
                  controller: _guardianContactController,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Guardian Contact *',
                    prefixIcon: Icon(Icons.phone_outlined),
                  ),
                  validator: (v) => v?.isEmpty == true ? 'Required' : null,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
