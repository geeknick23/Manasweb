'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { api, UpdateProfileData, getImageUrl, Gender, MaritalStatus, Education, User, Caste, Religion } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user: currentUser, loading, refreshUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [tempProfilePicture, setTempProfilePicture] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateProfileData>({
    full_name: '',
    email: '',
    date_of_birth: '',
    gender: Gender.MALE,
    marital_status: MaritalStatus.SINGLE,
    education: Education.NONE,
    profession: '',
    phone_number: '',
    interests_hobbies: '',
    brief_personal_description: '',
    location: { village: '', tehsil: '', district: '', state: '' },
    guardian: { name: '', contact: '' },
    caste: Caste.GENERAL,
    religion: Religion.HINDU,
    divorce_finalized: false,
    children: [],
    children_count: 0,
    profile_photo: ''
  });
  const [activeTab, setActiveTab] = useState<'myInterests' | 'receivedInterests'>('myInterests');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const myInterests = currentUser?.expressed_interests || [];
  const receivedInterests = currentUser?.received_interests || [];

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    } else if (currentUser) {
      setFormData({
        full_name: currentUser.full_name || '',
        email: currentUser.email || '',
        date_of_birth: currentUser.date_of_birth
          ? new Date(currentUser.date_of_birth).toISOString().slice(0, 10)
          : '',
        gender: currentUser.gender,
        marital_status: currentUser.marital_status,
        education: currentUser.education,
        profession: currentUser.profession || '',
        phone_number: currentUser.phone_number || '',
        interests_hobbies: currentUser.interests_hobbies || '',
        brief_personal_description: currentUser.brief_personal_description || '',
        location: {
          village: currentUser.location?.village || '',
          tehsil: currentUser.location?.tehsil || '',
          district: currentUser.location?.district || '',
          state: currentUser.location?.state || ''
        },
        guardian: {
          name: currentUser.guardian?.name || '',
          contact: currentUser.guardian?.contact || ''
        },
        caste: currentUser.caste || Caste.GENERAL,
        religion: currentUser.religion || Religion.HINDU,
        divorce_finalized: currentUser.divorce_finalized || false,
        children: currentUser.children || [],
        children_count: currentUser.children_count || 0,
        profile_photo: currentUser.profile_photo || ''
      });
      setProfilePicture(currentUser.profile_photo || null);
      setTempProfilePicture(null);
    }
  }, [currentUser, loading, router]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Always refresh user data when the profile page is first shown
  useEffect(() => {
    if (refreshUser) refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith('location.')) {
      const locationKey = name.split('.')[1] as keyof typeof formData.location;
      setFormData(prev => ({
        ...prev,
        location: {
          ...(prev.location || { village: '', tehsil: '', district: '', state: '' }),
          [locationKey]: value
        }
      }));
    } else if (name.startsWith('guardian.')) {
      const guardianKey = name.split('.')[1] as keyof typeof formData.guardian;
      setFormData(prev => ({
        ...prev,
        guardian: {
          ...(prev.guardian || { name: '', contact: '' }),
          [guardianKey]: value
        }
      }));
    } else if (name === 'divorce_finalized') {
      if (type === 'checkbox') {
        setFormData(prev => ({
          ...prev,
          divorce_finalized: (e.target as HTMLInputElement).checked
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          divorce_finalized: value === 'true'
        }));
      }
    } else if (name === 'children_count') {
      const numValue = Number(value);
      setFormData(prev => ({
        ...prev,
        children_count: isNaN(numValue) ? 0 : numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Profile picture must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Compress image before converting to base64
    const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Calculate new dimensions (max 800px width/height)
          let width = img.width;
          let height = img.height;
          const maxSize = 800;
          
          if (width > height && width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with reduced quality
          const base64String = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
          resolve(base64String);
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      });
    };

    try {
      const compressedBase64 = await compressImage(file);
      setTempProfilePicture(compressedBase64);
      // Update form data with the compressed profile photo
      setFormData(prev => ({
        ...prev,
        profile_photo: compressedBase64
      }));
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleRemovePhoto = () => {
    setTempProfilePicture('');
    // Update form data to remove profile photo
    setFormData(prev => ({
      ...prev,
      profile_photo: ''
    }));
  };

  const handleAddChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...(prev.children || []), { gender: 'boy', age: 0 }]
    }));
  };

  const handleRemoveChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      children: (prev.children || []).filter((_, i) => i !== index)
    }));
  };

  const handleChildChange = (index: number, field: 'gender' | 'age', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      children: (prev.children || []).map((child, i) =>
        i === index ? { ...child, [field]: value } : child
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: UpdateProfileData = {};
      let hasChanges = false;
      Object.entries(formData).forEach(([key, value]) => {
        if (value === '' && key !== 'profile_photo' && key !== 'interests_hobbies' && key !== 'brief_personal_description') return;
        if (key === 'location' && typeof value === 'object') {
          const location = value as { village: string; tehsil: string; district: string; state: string };
          if (location.village || location.tehsil || location.district || location.state) {
            updateData.location = location;
            hasChanges = true;
          }
          return;
        }
        if (key === 'guardian' && typeof value === 'object') {
          const guardian = value as { name: string; contact: string };
          if (guardian.name || guardian.contact) {
            updateData.guardian = guardian;
            hasChanges = true;
          }
          return;
        }
        if (key === 'children' && Array.isArray(value)) {
          updateData.children = value;
          hasChanges = true;
          return;
        }
        if (key === 'children_count') {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            updateData.children_count = numValue;
            hasChanges = true;
          }
          return;
        }
        if (key === 'divorce_finalized') {
          updateData.divorce_finalized = Boolean(value);
          hasChanges = true;
          return;
        }
        if (key === 'profile_photo') {
          updateData.profile_photo = value?.toString() || '';
          hasChanges = true;
          return;
        }
        if (key === 'caste' || key === 'religion') {
          updateData[key] = value;
          hasChanges = true;
          return;
        }
        if (key === 'date_of_birth') {
          updateData.date_of_birth = value.toString();
          hasChanges = true;
          return;
        }
        if (key === 'full_name' || key === 'email' || key === 'gender' || key === 'marital_status' || key === 'education' || key === 'profession' || key === 'phone_number' || key === 'interests_hobbies' || key === 'brief_personal_description') {
          updateData[key] = value.toString();
          hasChanges = true;
        }
      });
      if (!hasChanges) {
        toast.error('No changes to save');
        return;
      }
      const response = await api.updateProfile(updateData);
      setProfilePicture(response.profile_photo || null);
      setTempProfilePicture(null);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        full_name: currentUser.full_name || '',
        email: currentUser.email || '',
        date_of_birth: currentUser.date_of_birth
          ? new Date(currentUser.date_of_birth).toISOString().slice(0, 10)
          : '',
        gender: currentUser.gender,
        marital_status: currentUser.marital_status,
        education: currentUser.education,
        profession: currentUser.profession || '',
        phone_number: currentUser.phone_number || '',
        interests_hobbies: currentUser.interests_hobbies || '',
        brief_personal_description: currentUser.brief_personal_description || '',
        location: {
          village: currentUser.location?.village || '',
          tehsil: currentUser.location?.tehsil || '',
          district: currentUser.location?.district || '',
          state: currentUser.location?.state || ''
        },
        guardian: {
          name: currentUser.guardian?.name || '',
          contact: currentUser.guardian?.contact || ''
        },
        caste: currentUser.caste || Caste.GENERAL,
        religion: currentUser.religion || Religion.HINDU,
        divorce_finalized: currentUser.divorce_finalized || false,
        children: currentUser.children || [],
        children_count: currentUser.children_count || 0,
        profile_photo: currentUser.profile_photo || ''
      });
    }
    setTempProfilePicture(null);
    setIsEditing(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        {/* Subtle floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 right-20 w-48 h-48 bg-primary-200 rounded-full blur-3xl opacity-40"></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Your <span className="text-primary">Profile</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your personal information and preferences
            </p>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-hope-light flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-xl">
          <div className="bg-white py-8 px-4 shadow-card rounded-3xl sm:px-10 border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold text-primary-600">Profile Information</h2>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Edit Profile
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary-200 shadow-warm">
                  {(tempProfilePicture || profilePicture) ? (
                    <Image
                      src={tempProfilePicture || getImageUrl(profilePicture)}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 text-4xl">
                        {formData.full_name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="flex space-x-4">
                    <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-full hover:bg-primary-700 transition-colors font-medium">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                    {(tempProfilePicture || profilePicture) && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="w-full">
                <h3 className="text-xl font-semibold text-primary-600 mb-6 border-b border-slate-200 pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="full_name" className="text-slate-700">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="date_of_birth" className="text-slate-700">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your date of birth"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender" className="text-slate-700">Gender</Label>
                    <Select
                      id="gender"
                      name="gender"
                      value={formData.gender || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 bg-white border-slate-200 text-slate-800 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select gender</option>
                      <option value={Gender.MALE}>Male</option>
                      <option value={Gender.FEMALE}>Female</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location.village" className="text-slate-700">Village</Label>
                    <Input
                      id="location.village"
                      name="location.village"
                      type="text"
                      value={formData.location?.village || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your village"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location.tehsil" className="text-slate-700">Tehsil</Label>
                    <Input
                      id="location.tehsil"
                      name="location.tehsil"
                      type="text"
                      value={formData.location?.tehsil || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your tehsil"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location.district" className="text-slate-700">District</Label>
                    <Input
                      id="location.district"
                      name="location.district"
                      type="text"
                      value={formData.location?.district || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your district"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location.state" className="text-slate-700">State</Label>
                    <Input
                      id="location.state"
                      name="location.state"
                      type="text"
                      value={formData.location?.state || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your state"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="profession" className="text-slate-700">Profession</Label>
                    <Input
                      id="profession"
                      name="profession"
                      type="text"
                      value={formData.profession}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your profession"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="education" className="text-slate-700">Education</Label>
                    <Select
                      id="education"
                      name="education"
                      value={formData.education || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 bg-white border-slate-200 text-slate-800 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select education</option>
                      <option value={Education.NONE}>None</option>
                      <option value={Education.PRIMARY_SCHOOL}>Primary School</option>
                      <option value={Education.HIGH_SCHOOL}>High School</option>
                      <option value={Education.BACHELORS}>Bachelor&apos;s Degree</option>
                      <option value={Education.MASTERS}>Master&apos;s Degree</option>
                      <option value={Education.PHD}>PhD</option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact & Status */}
              <div className="w-full mt-8">
                <h3 className="text-xl font-semibold text-primary-600 mb-6 border-b border-slate-200 pb-2">Contact & Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your email"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone_number" className="text-slate-700">Phone Number</Label>
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="marital_status" className="text-slate-700">Marital Status</Label>
                    <Select
                      id="marital_status"
                      name="marital_status"
                      value={formData.marital_status || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 bg-white border-slate-200 text-slate-800 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Status</option>
                      <option value={MaritalStatus.DIVORCEE}>Divorcee</option>
                      <option value={MaritalStatus.WIDOW}>Widow</option>
                      <option value={MaritalStatus.SINGLE}>Single</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="children_count" className="text-slate-700">Number of Children</Label>
                    <Input
                      id="children_count"
                      name="children_count"
                      type="number"
                      min="0"
                      value={formData.children_count ?? 0}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter number of children"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Guardian, Caste, Religion, Divorce Finalized, Children */}
              <div className="w-full mt-8">
                <h3 className="text-xl font-semibold text-primary-600 mb-6 border-b border-slate-200 pb-2">Family & Background</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Guardian Name */}
                  <div>
                    <Label htmlFor="guardian.name" className="text-slate-700">Guardian Name</Label>
                    <Input
                      id="guardian.name"
                      name="guardian.name"
                      type="text"
                      value={formData.guardian?.name || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter guardian's name"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  {/* Guardian Contact */}
                  <div>
                    <Label htmlFor="guardian.contact" className="text-slate-700">Guardian Contact</Label>
                    <Input
                      id="guardian.contact"
                      name="guardian.contact"
                      type="text"
                      value={formData.guardian?.contact || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter guardian's contact"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  {/* Caste */}
                  <div>
                    <Label htmlFor="caste" className="text-slate-700">Caste</Label>
                    <Select
                      id="caste"
                      name="caste"
                      value={formData.caste || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 bg-white border-slate-200 text-slate-800 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select caste</option>
                      <option value={Caste.GENERAL}>General</option>
                      <option value={Caste.OBC}>OBC</option>
                      <option value={Caste.SC}>SC</option>
                      <option value={Caste.ST}>ST</option>
                      <option value={Caste.OTHER}>Other</option>
                    </Select>
                  </div>
                  {/* Religion */}
                  <div>
                    <Label htmlFor="religion" className="text-slate-700">Religion</Label>
                    <Select
                      id="religion"
                      name="religion"
                      value={formData.religion || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="mt-1 bg-white border-slate-200 text-slate-800 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select religion</option>
                      <option value={Religion.HINDU}>Hindu</option>
                      <option value={Religion.MUSLIM}>Muslim</option>
                      <option value={Religion.CHRISTIAN}>Christian</option>
                      <option value={Religion.SIKH}>Sikh</option>
                      <option value={Religion.BUDDHIST}>Buddhist</option>
                      <option value={Religion.JAIN}>Jain</option>
                      <option value={Religion.OTHER}>Other</option>
                    </Select>
                  </div>
                  {/* Divorce Finalized */}
                  <div className="md:col-span-2 flex items-center space-x-3 mt-2">
                    <input
                      id="divorce_finalized"
                      name="divorce_finalized"
                      type="checkbox"
                      checked={!!formData.divorce_finalized}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="h-4 w-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                    />
                    <Label htmlFor="divorce_finalized" className="text-slate-700 select-none cursor-pointer">Divorce Finalized</Label>
                  </div>
                </div>
                {/* Children List */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-primary-600">Children</h4>
                    {isEditing && (
                      <Button type="button" onClick={handleAddChild} className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-full text-sm">Add Child</Button>
                    )}
                  </div>
                  {(formData.children && formData.children.length > 0) ? (
                    <div className="space-y-4">
                      {formData.children.map((child, idx) => (
                        <div key={idx} className="flex items-center space-x-4">
                          <Select
                            id={`child-gender-${idx}`}
                            name={`child-gender-${idx}`}
                            value={child.gender}
                            onChange={e => handleChildChange(idx, 'gender', e.target.value)}
                            disabled={!isEditing}
                            className="w-32 bg-white border-slate-200 text-slate-800 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="boy">Boy</option>
                            <option value="girl">Girl</option>
                          </Select>
                          <Input
                            id={`child-age-${idx}`}
                            name={`child-age-${idx}`}
                            type="number"
                            min="0"
                            value={child.age}
                            onChange={e => handleChildChange(idx, 'age', Number(e.target.value))}
                            disabled={!isEditing}
                            placeholder="Age"
                            className="w-24 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                          />
                          {isEditing && (
                            <Button type="button" onClick={() => handleRemoveChild(idx)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full text-xs">Remove</Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500">No children added.</p>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="w-full mt-8">
                <h3 className="text-xl font-semibold text-primary-600 mb-6 border-b border-slate-200 pb-2">Additional Information</h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="interests_hobbies" className="text-slate-700">Interests and Hobbies</Label>
                    <Input
                      id="interests_hobbies"
                      name="interests_hobbies"
                      type="text"
                      value={formData.interests_hobbies}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., Reading, Gardening, Music"
                      className="mt-1 bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="brief_personal_description" className="text-slate-700">Brief Personal Description</Label>
                    <textarea
                      id="brief_personal_description"
                      name="brief_personal_description"
                      rows={4}
                      value={formData.brief_personal_description}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself and what you're looking for..."
                      className="mt-1 block w-full rounded-xl shadow-sm bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-primary-500 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm px-4 py-3"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Status */}
              <div className="w-full mt-8">
                <h3 className="text-xl font-semibold text-primary-600 mb-6 border-b border-slate-200 pb-2">Profile Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Verification</label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                      currentUser?.is_verified 
                        ? 'bg-primary-100 text-primary-800' 
                        : 'bg-primary-100 text-primary-800'
                    }`}>
                      {currentUser?.is_verified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Member Since</label>
                    <p className="mt-1 text-slate-900">
                      {currentUser?.created_at
                        ? new Date(currentUser.created_at).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Updated At</label>
                    <p className="mt-1 text-slate-900">
                      {currentUser?.updated_at
                        ? new Date(currentUser.updated_at).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 mt-6">
                  <Button
                    type="button"
                    onClick={handleCancel}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Interests Section - New Card */}
        <div className="sm:mx-auto sm:w-full sm:max-w-xl mt-8">
          <div className="bg-white py-8 px-4 shadow-card rounded-3xl sm:px-10 border border-slate-100">
            <h2 className="text-2xl font-display font-bold text-primary-600 mb-6">Interests</h2>
            <div className="bg-slate-50 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200">
                <button
                  className={`flex-1 py-4 text-center text-lg font-semibold transition-colors duration-200 ${
                    activeTab === 'myInterests'
                      ? 'bg-white text-primary-700 border-b-4 border-primary-500'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setActiveTab('myInterests')}
                >
                  My Interests
                </button>
                <button
                  className={`flex-1 py-4 text-center text-lg font-semibold transition-colors duration-200 ${
                    activeTab === 'receivedInterests'
                      ? 'bg-white text-primary-700 border-b-4 border-primary-500'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  onClick={() => setActiveTab('receivedInterests')}
                >
                  Received Interests
                </button>
              </div>
              <div className="p-8 bg-white">
                {activeTab === 'myInterests' && (
                  <div className="text-center">
                    {myInterests.length === 0 ? (
                      <>
                        <p className="text-xl text-slate-700 font-medium mb-4">No interests expressed yet</p>
                        <p className="text-slate-500 mb-6">Browse profiles and express interest to see them here.</p>
                        <Button
                          onClick={() => router.push('/view-profiles')}
                          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-full shadow-warm transition-all duration-200 ease-in-out transform hover:scale-105"
                        >
                          Browse Profiles
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col space-y-4">
                        {myInterests.map((interest: { user: User; sentAt: string; status: 'pending' | 'accepted' | 'rejected' }) => {
                          const status = interest.status;
                          return (
                            <div key={interest.user._id} className="w-full bg-slate-50 rounded-2xl shadow-sm transform transition-transform duration-200 hover:scale-[1.02]">
                              <div className="flex items-center justify-between p-4">
                                <div className="flex items-center space-x-4">
                                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary-200">
                                    {interest.user.profile_photo ? (
                                      <Image
                                        src={getImageUrl(interest.user.profile_photo)}
                                        alt={interest.user.full_name}
                                        fill
                                        className="object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center">
                                        <span className="text-primary-600 text-3xl uppercase">
                                          {interest.user.full_name?.charAt(0)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <p className="text-lg font-semibold text-slate-800 truncate">
                                      {interest.user.full_name}
                                    </p>
                                    {status && (
                                      <span className={`mt-1 px-2 py-1 rounded-full text-xs font-semibold w-fit
                                        ${status === 'pending' ? 'bg-primary-100 text-primary-800' :
                                          status === 'accepted' ? 'bg-primary-100 text-primary-800' :
                                          'bg-red-100 text-red-800'}`}
                                      >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    onClick={() => router.push(`/view-profile/${interest.user._id}`)}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full text-sm flex-shrink-0"
                                  >
                                    View Profile
                                  </Button>
                                  <button
                                    className="ml-2 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 focus:outline-none"
                                    style={{ fontSize: 24, fontWeight: 'bold', minWidth: 40, minHeight: 40 }}
                                    onClick={() => setOpenDropdown(openDropdown === interest.user._id ? null : interest.user._id)}
                                    aria-label="Show interest details"
                                  >
                                    &#8942;
                                  </button>
                                  {openDropdown === interest.user._id && (
                                    <div
                                      ref={dropdownRef}
                                      className="absolute z-[9999] right-0 top-12 w-64 bg-white border border-slate-200 rounded-2xl shadow-lg p-4"
                                      style={{ minWidth: 220 }}
                                    >
                                      <h4 className="font-bold text-primary-700 mb-2 text-center">Interest Details</h4>
                                      <div className="text-sm text-slate-700 mb-2 text-center">
                                        Sent At: {interest.sentAt ? new Date(interest.sentAt).toLocaleString() : 'Unknown'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'receivedInterests' && (
                  <div className="text-center">
                    {receivedInterests.length === 0 ? (
                      <>
                        <p className="text-xl text-slate-700 font-medium mb-4">No interests received yet</p>
                        <p className="text-slate-500 mb-6">Other users&apos; interests in you will appear here.</p>
                        <Button
                          onClick={() => router.push('/view-profiles')}
                          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-full shadow-warm transition-all duration-200 ease-in-out transform hover:scale-105"
                        >
                          Browse Profiles
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col space-y-4">
                        {receivedInterests.map((interest: { user: User; sentAt: string; status: 'pending' | 'accepted' | 'rejected' }) => (
                          <div key={interest.user._id} className="w-full bg-slate-50 rounded-2xl shadow-sm transform transition-transform duration-200 hover:scale-[1.02]">
                            <div className="flex items-center justify-between p-4 relative">
                              <div className="flex items-center space-x-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary-200">
                                  {interest.user.profile_photo ? (
                                    <Image
                                      src={getImageUrl(interest.user.profile_photo)}
                                      alt={interest.user.full_name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center">
                                      <span className="text-primary-600 text-3xl uppercase">
                                        {interest.user.full_name?.charAt(0)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-lg font-semibold text-slate-800 truncate">
                                    {interest.user.full_name}
                                  </p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    {interest.status === 'pending' && (
                                      <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                                        Pending
                                      </span>
                                    )}
                                    {interest.status === 'accepted' && (
                                      <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                                        Accepted
                                      </span>
                                    )}
                                    {interest.status === 'rejected' && (
                                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                        Rejected
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  onClick={() => router.push(`/view-profile/${interest.user._id}`)}
                                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full text-sm flex-shrink-0"
                                >
                                  View Profile
                                </Button>
                                <button
                                  className="ml-2 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 focus:outline-none"
                                  style={{ fontSize: 24, fontWeight: 'bold', minWidth: 40, minHeight: 40 }}
                                  onClick={() => setOpenDropdown(openDropdown === interest.user._id ? null : interest.user._id)}
                                  aria-label="Show interest details"
                                >
                                  &#8942;
                                </button>
                                {openDropdown === interest.user._id && (
                                  <div
                                    ref={dropdownRef}
                                    className="absolute z-[9999] right-0 top-12 w-64 bg-white border border-slate-200 rounded-2xl shadow-lg p-4"
                                    style={{ minWidth: 220 }}
                                  >
                                    <h4 className="font-bold text-primary-700 mb-2 text-center">Interest Details</h4>
                                    <div className="text-sm text-slate-700 mb-2 text-center">
                                      Sent At: {interest.sentAt ? new Date(interest.sentAt).toLocaleString() : 'Unknown'}
                                    </div>
                                    <div className="text-sm text-slate-700 mb-2 text-center">
                                      Status: <span className={`font-semibold ${
                                        interest.status === 'pending' ? 'text-primary-600' :
                                        interest.status === 'accepted' ? 'text-primary-600' : 'text-red-600'
                                      }`}>
                                        {interest.status.charAt(0).toUpperCase() + interest.status.slice(1)}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
