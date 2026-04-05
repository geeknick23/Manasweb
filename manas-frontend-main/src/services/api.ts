// Backend API URL - configured via environment variables
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
// const BACKEND_URL = 'http://localhost:5000';
// const API_URL = 'http://localhost:5000/api';


// Match backend enums
export enum Gender {
  MALE = "male",
  FEMALE = "female"
}

export enum MaritalStatus {
  DIVORCEE = "divorcee",
  WIDOW = "widow",
  SINGLE = "single"
}

export enum Education {
  NONE = "none",
  PRIMARY_SCHOOL = "primary school",
  HIGH_SCHOOL = "high school",
  BACHELORS = "bachelor's",
  MASTERS = "master's",
  PHD = "phd"
}

export enum Religion {
  HINDU = "hindu",
  MUSLIM = "muslim",
  CHRISTIAN = "christian",
  SIKH = "sikh",
  BUDDHIST = "buddhist",
  JAIN = "jain",
  OTHER = "other"
}

export enum Caste {
  GENERAL = "general",
  OBC = "obc",
  SC = "sc",
  ST = "st",
  OTHER = "other"
}

export interface Child {
  gender: 'boy' | 'girl';
  age: number;
}

export interface Guardian {
  name: string;
  contact: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  date_of_birth: string;
  gender: Gender;
  marital_status: MaritalStatus;
  education: Education;
  profession: string;
  phone_number: string;
  interests_hobbies?: string;
  brief_personal_description?: string;
  location: {
    village: string;
    tehsil: string;
    district: string;
    state: string;
  };
  guardian: Guardian;
  caste: Caste;
  religion: Religion;
  divorce_finalized?: boolean;
  children?: Child[];
  children_count: number;
  profile_photo: string; // Always a string, empty string if no photo
  verification_method?: 'email' | 'sms';
}

interface LoginData {
  username_or_email: string;
  password: string;
}

export interface User {
  _id: string;
  full_name: string;
  email: string;
  date_of_birth: string;
  gender: Gender;
  marital_status: MaritalStatus;
  education: Education;
  profession?: string;
  phone_number?: string;
  interests_hobbies?: string;
  brief_personal_description?: string;
  location?: {
    village: string;
    tehsil: string;
    district: string;
    state: string;
  };
  guardian?: Guardian;
  caste?: Caste;
  religion?: Religion;
  divorce_finalized?: boolean;
  children?: Child[];
  children_count: number;
  profile_photo?: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
  expressed_interests?: { user: User; sentAt: string; status: 'pending' | 'accepted' | 'rejected' }[];
  received_interests?: { user: User; sentAt: string; status: 'pending' | 'accepted' | 'rejected' }[];
}

interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileData {
  full_name?: string;
  email?: string;
  date_of_birth?: string;
  gender?: Gender;
  marital_status?: MaritalStatus;
  education?: Education;
  profession?: string;
  phone_number?: string;
  interests_hobbies?: string;
  brief_personal_description?: string;
  location?: {
    village: string;
    tehsil: string;
    district: string;
    state: string;
  };
  guardian?: Guardian;
  caste?: Caste;
  religion?: Religion;
  divorce_finalized?: boolean;
  children?: Child[];
  children_count?: number;
  profile_photo?: string; // Only string type - base64 encoded image or empty string
}

export interface ProfilesResponse {
  profiles: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ProfileFilters {
  name?: string;
  location?: string;
  profession?: string;
  ageFrom?: string;
  ageTo?: string;
  search?: string;
  yearOfBirthFrom?: string;
  yearOfBirthTo?: string;
  gender?: Gender;
  marital_status?: MaritalStatus;
  education?: Education;
  caste?: Caste;
  religion?: Religion;
  limit?: number;
  page?: number;
}

export interface Event {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  month: string;
  day: string;
  registerLink: string;
}

// Helper function to get full image URL
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path || path.trim() === '') return '/images/no-profile-pic.svg';
  if (path.startsWith('data:')) return path; // Return base64 image directly
  if (path === '/images/no-profile-pic.svg') return path;
  if (path.startsWith('http')) return path; // Already a full URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
};

import { safeLocalStorage } from '../utils/storage';
import { normalizeMediaCard } from '@/utils/mediaCard';
import type { MediaCardType } from '@/types/cards';

const getToken = (): string => {
  const token = safeLocalStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return token;
};

export const api = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors'
      });

      console.log('Registration response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        throw new Error(errorData.message || 'Registration failed');
      }

      const responseData = await response.json();
      console.log('Registration successful');
      return responseData;
    } catch (error) {
      console.error('Registration error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('Attempting login with:', data.username_or_email);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors'
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }

      const responseData = await response.json();
      console.log('Login successful');
      return responseData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async initiateSmsLogin(phone_number: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_URL}/auth/sms/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ phone_number }),
        mode: 'cors'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send SMS OTP');
      }
      return response.json();
    } catch (error) {
      console.error('Initiate SMS login error:', error);
      throw error;
    }
  },

  async verifySmsLogin(phone_number: string, code: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/sms/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ phone_number, code }),
        mode: 'cors'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to verify SMS OTP');
      }
      return response.json();
    } catch (error) {
      console.error('Verify SMS login error:', error);
      throw error;
    }
  },

  async verifyOTP(email: string | undefined, phone_number: string | undefined, otp: string): Promise<void> {
    try {
      const body = email ? { email, code: otp } : { phone_number, code: otp };
      if (!email && !phone_number) throw new Error('Email or phone number required');

      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
        mode: 'cors'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'OTP verification failed');
      }

      await response.json();
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  },

  async resendOTP(email?: string, phone_number?: string): Promise<void> {
    try {
      const body = email ? { email } : { phone_number };
      if (!email && !phone_number) throw new Error('Email or phone number required');

      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
        mode: 'cors'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User> {
    const token = safeLocalStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user data');
    }

    return response.json();
  },

  async getAllProfiles(filters: ProfileFilters = {}): Promise<ProfilesResponse> {
    try {
      const token = getToken();

      // Build query string from filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const url = `${API_URL}/users/profiles${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;


      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      console.log('API Response status:', response.status);
      console.log('API Response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.error('API Error response:', error);
        throw new Error(error.message || 'Failed to fetch profiles');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get all profiles error:', error);
      throw error;
    }
  },

  async getProfileById(id: string): Promise<User> {
    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/users/profile/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch profile');
      }

      return response.json();
    } catch (error) {
      console.error('Get profile by ID error:', error);
      throw error;
    }
  },

  async expressInterest(targetUserId: string): Promise<{ message: string }> {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/users/express-interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId }),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to express interest');
      }

      return response.json();
    } catch (error) {
      console.error('Express interest error:', error);
      throw error;
    }
  },

  async acceptInterest(targetUserId: string): Promise<{ message: string }> {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/users/accept-interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId }),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept interest');
      }

      return response.json();
    } catch (error) {
      console.error('Accept interest error:', error);
      throw error;
    }
  },

  async rejectInterest(targetUserId: string): Promise<{ message: string }> {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/users/reject-interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId }),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject interest');
      }

      return response.json();
    } catch (error) {
      console.error('Reject interest error:', error);
      throw error;
    }
  },

  async removeInterest(targetUserId: string): Promise<{ message: string }> {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/users/remove-interest`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId }),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove interest');
      }

      return response.json();
    } catch (error) {
      console.error('Remove interest error:', error);
      throw error;
    }
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      console.log('Starting profile update request...');
      console.log('API URL:', `${API_URL}/users/profile`);

      const token = getToken();
      console.log('Using token:', token ? 'Token exists' : 'No token');

      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      console.log('Response status:', response.status);

      // Get the raw response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        let errorMessage = 'Failed to update profile';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }

      // Parse the successful response
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing success response:', e);
        throw new Error('Invalid response from server');
      }

      console.log('Parsed response data:', responseData);
      return responseData;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  async uploadProfilePicture(formData: FormData): Promise<{ profile_photo: string }> {
    const token = safeLocalStorage.getItem('token');
    if (!token) throw new Error('No token found');

    try {
      // Check if we're removing the photo
      const isRemoving = formData.get('profile_photo') instanceof Blob &&
        (formData.get('profile_photo') as Blob).size === 0;

      const response = await fetch(`${API_URL}/users/profile/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header for FormData
        },
        body: formData,
        mode: 'cors'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload profile picture');
      }

      const data = await response.json();
      return { profile_photo: isRemoving ? '' : data.profile_photo };
    } catch (error) {
      console.error('Upload profile picture error:', error);
      throw error;
    }
  },

  getImageUrl, // Export the helper function

  async fetchImpactCards() {
    const res = await fetch(`${API_URL}/users/impact-cards`);
    if (!res.ok) throw new Error('Failed to fetch impact cards');
    return res.json();
  },

  async fetchAchievementCards() {
    const res = await fetch(`${API_URL}/users/achievement-cards`);
    if (!res.ok) throw new Error('Failed to fetch achievement cards');
    return res.json();
  },

  async fetchSuccessStories() {
    const res = await fetch(`${API_URL}/users/success-stories`);
    if (!res.ok) throw new Error('Failed to fetch success stories');
    return res.json();
  },

  async fetchMediaCards(): Promise<MediaCardType[]> {
    const res = await fetch(`${API_URL}/users/media-cards`);
    if (!res.ok) throw new Error('Failed to fetch media cards');
    const data = await res.json();
    return Array.isArray(data) ? data.map((c) => normalizeMediaCard(c)) : [];
  },

  async sendContactMessage({ name, email, subject, message }: { name: string; email: string; subject: string; message: string }) {
    const res = await fetch(`${API_URL}/users/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });
    const data = await res.json();
    return { ok: res.ok, ...data };
  },

  async getAllEvents(): Promise<Event[]> {
    const res = await fetch(`${API_URL}/users/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  async submitVolunteerForm(data: {
    name: string;
    email: string;
    phone: string;
    city: string;
    why: string;
    areas: string[];
    areaOther: string;
    availability: string;
    experience: string;
  }): Promise<{ message: string }> {

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch(`${API_URL}/volunteer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
        mode: 'cors',
      });

      clearTimeout(timeoutId);
      console.log('API: Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.log('API: Error response:', errorText);
        let errorMessage = 'Failed to submit volunteer form';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          console.log('API: Could not parse error response as JSON');
        }
        throw new Error(errorMessage);
      }

      const result = await res.json();
      console.log('API: Success response:', result);
      return result;
    } catch (error: unknown) {
      console.error('API: Network error:', error);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check if the backend server is running.');
        }
        if (error.message.includes('SSL') || error.message.includes('TLS')) {
          throw new Error('Connection error. Please check if the backend server is running on http://localhost:5000');
        }
        throw new Error(error.message || 'Network error. Please try again.');
      }
      throw new Error('Network error. Please try again.');
    }
  },
}; 