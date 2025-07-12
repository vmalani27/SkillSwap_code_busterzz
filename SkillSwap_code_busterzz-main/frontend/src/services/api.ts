const API_BASE_URL = 'http://172.16.91.34:8000/api';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  location?: string;
  availability?: string;
  profile_photo?: string;
  is_public: boolean;
  rating: number;
  bio?: string;
  date_joined: string;
}

export interface Skill {
  id: number;
  name: string;
}

export interface UserSkill {
  id: number;
  skill: Skill;
  skill_id: number;
  is_offered: boolean;
}

export interface SwapRequest {
  id: number;
  sender: User;
  receiver: User;
  sender_skill?: Skill;
  receiver_skill?: Skill;
  sender_skill_id?: number;
  receiver_skill_id?: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface SignupHealthCheckResponse {
  status: string;
  message: string;
  database: string;
  user_count: number;
  timestamp: string;
}

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session authentication
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Health Check
  async healthCheck(): Promise<HealthCheckResponse> {
    const url = `${this.baseURL}/health/`;
    console.log('[Frontend] Making health check request to:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('[Frontend] Health check response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Frontend] Health check failed with status:', response.status, 'Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[Frontend] Health check successful response:', data);
      return data;
    } catch (error) {
      console.error('[Frontend] Health check request failed:', error);
      throw error;
    }
  }

  // Signup Health Check
  async signupHealthCheck(): Promise<SignupHealthCheckResponse> {
    const url = `${this.baseURL}/signup/health/`;
    console.log('[Frontend] Making signup health check request to:', url);
    console.log('[Frontend] Current API base URL:', this.baseURL);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
      });
      
      console.log('[Frontend] Signup health check response status:', response.status);
      console.log('[Frontend] Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Frontend] Signup health check failed with status:', response.status, 'Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('[Frontend] Signup health check successful response:', data);
      return data;
    } catch (error) {
      console.error('[Frontend] Signup health check request failed:', error);
      console.error('[Frontend] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        url: url,
        baseURL: this.baseURL
      });
      throw error;
    }
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<{ user: User; message: string }> {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<{ user: User; message: string }> {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request('/auth/logout/', {
      method: 'POST',
    });
  }

  // User Management
  async getCurrentUser(): Promise<User> {
    return this.request('/users/profile/');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request('/users/profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUsers(params?: { location?: string; skill?: string }): Promise<User[]> {
    const searchParams = new URLSearchParams();
    if (params?.location) searchParams.append('location', params.location);
    if (params?.skill) searchParams.append('skill', params.skill);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/users/?${queryString}` : '/users/';
    
    return this.request(endpoint);
  }

  async getUser(id: number): Promise<User> {
    return this.request(`/users/${id}/`);
  }

  async searchUsers(query: string): Promise<{ users: User[] }> {
    return this.request(`/users/search/?q=${encodeURIComponent(query)}`);
  }

  async getUserSkills(userId: number): Promise<UserSkill[]> {
    return this.request(`/users/${userId}/skills/`);
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return this.request('/skills/');
  }

  async createSkill(data: { name: string }): Promise<Skill> {
    return this.request('/skills/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSkill(id: number): Promise<Skill> {
    return this.request(`/skills/${id}/`);
  }

  // User Skills
  async getUserSkillList(): Promise<UserSkill[]> {
    return this.request('/user-skills/');
  }

  async createUserSkill(data: { skill_id: number; is_offered: boolean }): Promise<UserSkill> {
    return this.request('/user-skills/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUserSkill(id: number, data: Partial<UserSkill>): Promise<UserSkill> {
    return this.request(`/user-skills/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUserSkill(id: number): Promise<void> {
    return this.request(`/user-skills/${id}/`, {
      method: 'DELETE',
    });
  }

  // Swap Requests
  async getSwapRequests(): Promise<SwapRequest[]> {
    return this.request('/swap-requests/');
  }

  async getSentSwapRequests(): Promise<SwapRequest[]> {
    return this.request('/swap-requests/sent/');
  }

  async getReceivedSwapRequests(): Promise<SwapRequest[]> {
    return this.request('/swap-requests/received/');
  }

  async createSwapRequest(data: {
    receiver: number;
    sender_skill_id?: number;
    receiver_skill_id?: number;
    message: string;
  }): Promise<SwapRequest> {
    return this.request('/swap-requests/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSwapRequest(id: number, data: { status: 'accepted' | 'rejected' }): Promise<SwapRequest> {
    return this.request(`/swap-requests/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getSwapRequest(id: number): Promise<SwapRequest> {
    return this.request(`/swap-requests/${id}/`);
  }
}

// Create and export API instance
export const api = new ApiClient(API_BASE_URL);

// Auth context helper
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await api.getCurrentUser();
    return true;
  } catch {
    return false;
  }
}; 