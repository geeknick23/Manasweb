import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';

import '../../../core/constants/constants.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/models/user_model.dart';
import '../../blocs/auth/auth_bloc.dart';
import '../../blocs/profile/profile_bloc.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  // Form controllers
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _professionController;
  late TextEditingController _descriptionController;
  late TextEditingController _hobbiesController;
  late TextEditingController _villageController;
  late TextEditingController _tehsilController;

  // Form values
  Education _education = Education.highSchool;
  String _district = 'Buldhana';
  int _childrenCount = 0;

  User? _currentUser;

  @override
  void initState() {
    super.initState();
    _initControllers();
    _loadCurrentUser();
  }

  void _initControllers() {
    _nameController = TextEditingController();
    _phoneController = TextEditingController();
    _professionController = TextEditingController();
    _descriptionController = TextEditingController();
    _hobbiesController = TextEditingController();
    _villageController = TextEditingController();
    _tehsilController = TextEditingController();
  }

  void _loadCurrentUser() {
    final authState = context.read<AuthBloc>().state;
    if (authState is Authenticated) {
      final user = authState.user;
      _currentUser = user;
      setState(() {
        _nameController.text = user.fullName;
        _phoneController.text = user.phoneNumber ?? '';
        _professionController.text = user.profession ?? '';
        _descriptionController.text = user.briefPersonalDescription ?? '';
        _hobbiesController.text = user.interestsHobbies ?? '';
        _villageController.text = user.location?.village ?? '';
        _tehsilController.text = user.location?.tehsil ?? '';
        // Validate district against valid options
        final validDistricts = ['Buldhana', 'Akola', 'Amravati', 'Washim', 'Yavatmal', 'Nagpur'];
        final userDistrict = user.location?.district ?? '';
        _district = validDistricts.contains(userDistrict) ? userDistrict : 'Buldhana';
        _education = user.education;
        _childrenCount = user.childrenCount;
      });
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _professionController.dispose();
    _descriptionController.dispose();
    _hobbiesController.dispose();
    _villageController.dispose();
    _tehsilController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final image = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 800,
      maxHeight: 800,
      imageQuality: 80,
    );
    
    if (image != null && mounted) {
      context.read<ProfileBloc>().add(UploadProfilePhoto(path: image.path));
    }
  }

  void _handleSave() {
    if (_formKey.currentState!.validate()) {
      final data = {
        'full_name': _nameController.text.trim(),
        'phone_number': _phoneController.text.trim(),
        'profession': _professionController.text.trim(),
        'brief_personal_description': _descriptionController.text.trim(),
        'interests_hobbies': _hobbiesController.text.trim(),
        'education': User.educationToBackend(_education),
        'children_count': _childrenCount,
        'location': {
          'village': _villageController.text.trim(),
          'tehsil': _tehsilController.text.trim(),
          'district': _district,
          'state': 'Maharashtra',
        },
      };
      context.read<ProfileBloc>().add(UpdateProfile(data: data));
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<ProfileBloc, ProfileState>(
      listener: (context, state) {
        if (state is ProfileLoading) {
          setState(() => _isLoading = true);
        } else {
          setState(() => _isLoading = false);
        }

        if (state is ProfileUpdateSuccess) {
          // Update auth state with new user
          context.read<AuthBloc>().add(RefreshUserRequested());
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Profile updated successfully!'),
              backgroundColor: AppColors.success,
            ),
          );
          Navigator.pop(context);
        } else if (state is ProfileError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: AppColors.error,
            ),
          );
        }
      },
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Edit Profile'),
          actions: [
            TextButton(
              onPressed: _isLoading ? null : _handleSave,
              child: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Save'),
            ),
          ],
        ),
        body: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Profile photo
              Center(
                child: Stack(
                  children: [
                    CircleAvatar(
                      radius: 50,
                      backgroundColor: AppColors.primaryLight.withOpacity(0.3),
                      backgroundImage: _currentUser?.profilePhoto != null
                          ? NetworkImage(_getProfileImageUrl(_currentUser!.profilePhoto!)!)
                          : null,
                      child: _currentUser?.profilePhoto == null
                          ? const Icon(Icons.person, size: 50, color: AppColors.primary)
                          : null,
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Material(
                        color: AppColors.primary,
                        shape: const CircleBorder(),
                        child: InkWell(
                          onTap: _pickImage,
                          customBorder: const CircleBorder(),
                          child: const Padding(
                            padding: EdgeInsets.all(8),
                            child: Icon(Icons.camera_alt, color: Colors.white, size: 18),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              // Basic Info Section
              Text('Basic Information', style: AppTextStyles.heading3),
              const SizedBox(height: 16),

              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  prefixIcon: Icon(Icons.person_outline),
                ),
                validator: (v) => v?.isEmpty == true ? 'Required' : null,
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Phone Number',
                  prefixIcon: Icon(Icons.phone_outlined),
                ),
              ),
              const SizedBox(height: 16),

              DropdownButtonFormField<Education>(
                value: _education,
                decoration: const InputDecoration(
                  labelText: 'Education',
                  prefixIcon: Icon(Icons.school_outlined),
                ),
                items: Education.values.map((e) {
                  return DropdownMenuItem(value: e, child: Text(e.name));
                }).toList(),
                onChanged: (v) => setState(() => _education = v!),
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _professionController,
                decoration: const InputDecoration(
                  labelText: 'Profession/Occupation',
                  prefixIcon: Icon(Icons.work_outline),
                ),
              ),
              const SizedBox(height: 24),

              // Children
              Row(
                children: [
                  const Icon(Icons.child_care, color: AppColors.textSecondary),
                  const SizedBox(width: 12),
                  const Text('Number of Children'),
                  const Spacer(),
                  IconButton(
                    onPressed: _childrenCount > 0
                        ? () => setState(() => _childrenCount--)
                        : null,
                    icon: const Icon(Icons.remove_circle_outline),
                  ),
                  Text('$_childrenCount', style: AppTextStyles.heading3),
                  IconButton(
                    onPressed: () => setState(() => _childrenCount++),
                    icon: const Icon(Icons.add_circle_outline),
                  ),
                ],
              ),

              const Divider(height: 48),

              // About section
              Text('About You', style: AppTextStyles.heading3),
              const SizedBox(height: 16),

              TextFormField(
                controller: _descriptionController,
                maxLines: 4,
                decoration: const InputDecoration(
                  labelText: 'Brief Description',
                  hintText: 'Tell potential matches about yourself...',
                  alignLabelWithHint: true,
                ),
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _hobbiesController,
                decoration: const InputDecoration(
                  labelText: 'Interests & Hobbies',
                  prefixIcon: Icon(Icons.interests_outlined),
                ),
              ),

              const Divider(height: 48),

              // Location section
              Text('Location', style: AppTextStyles.heading3),
              const SizedBox(height: 16),

              TextFormField(
                controller: _villageController,
                decoration: const InputDecoration(
                  labelText: 'Village/Town',
                  prefixIcon: Icon(Icons.location_on_outlined),
                ),
              ),
              const SizedBox(height: 16),

              TextFormField(
                controller: _tehsilController,
                decoration: const InputDecoration(
                  labelText: 'Tehsil',
                  prefixIcon: Icon(Icons.location_city_outlined),
                ),
              ),
              const SizedBox(height: 16),

              DropdownButtonFormField<String>(
                value: _district,
                decoration: const InputDecoration(
                  labelText: 'District',
                  prefixIcon: Icon(Icons.map_outlined),
                ),
                items: ['Buldhana', 'Akola', 'Amravati', 'Washim', 'Yavatmal', 'Nagpur']
                    .map((d) => DropdownMenuItem(value: d, child: Text(d)))
                    .toList(),
                onChanged: (v) => setState(() => _district = v ?? 'Buldhana'),
              ),

              const SizedBox(height: 48),

              // Save button
              SizedBox(
                height: 56,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleSave,
                  child: _isLoading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Save Changes'),
                ),
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  String? _getProfileImageUrl(String? url) {
    if (url == null || url.isEmpty) return null;
    if (url.startsWith('http')) return url;
    // Handle relative URLs from backend
    // Backend returns 'uploads/filename.jpg', we need 'http://server:5000/uploads/filename.jpg'
    // Avoid double slashes if baseUrl has one or url has one
    final baseUrl = ApiConstants.baseUrl.endsWith('/') 
        ? ApiConstants.baseUrl.substring(0, ApiConstants.baseUrl.length - 1) 
        : ApiConstants.baseUrl;
    final path = url.startsWith('/') ? url : '/$url';
    return '$baseUrl$path';
  }
}
