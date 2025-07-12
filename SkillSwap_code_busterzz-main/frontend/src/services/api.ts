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

export interface UserProfile extends User {
  offered_skills: Skill[];
  wanted_skills: Skill[];
  skill_count: number;
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

// Mock user data for a barter system
const MOCK_USER = {
  id: 1,
  username: "barterer1",
  email: "barterer1@example.com",
  first_name: "Alex",
  last_name: "Smith",
  location: "Bartertown",
  availability: "Evenings",
  profile_photo: null,
  is_public: true,
  rating: 4.8,
  bio: "I love exchanging services and skills!",
  date_joined: "2024-01-01T00:00:00Z",
  offered_skills: [
    { id: 1, name: "Logo Design" },
    { id: 2, name: "Guitar Lessons" }
  ],
  wanted_skills: [
    { id: 3, name: "Plumbing Repair" },
    { id: 4, name: "Dog Walking" }
  ],
  skill_count: 4,
};

const MOCK_SKILLS = [
  { id: 1, name: "Logo Design" },
  { id: 2, name: "Guitar Lessons" },
  { id: 3, name: "Plumbing Repair" },
  { id: 4, name: "Dog Walking" },
  { id: 5, name: "Baking" },
  { id: 6, name: "Car Wash" },
];

const MOCK_USER_SKILLS = [
  { id: 1, skill: MOCK_SKILLS[0], skill_id: 1, is_offered: true }, // Logo Design (offered)
  { id: 2, skill: MOCK_SKILLS[2], skill_id: 3, is_offered: false }, // Plumbing Repair (wanted)
];

const MOCK_SWAP_REQUESTS = [
  {
    id: 1,
    sender: MOCK_USER,
    receiver: { ...MOCK_USER, id: 2, username: "barterer2", email: "barterer2@example.com", first_name: "Jamie", offered_skills: [{ id: 3, name: "Plumbing Repair" }], wanted_skills: [{ id: 1, name: "Logo Design" }] },
    sender_skill: MOCK_SKILLS[0], // Alex offers Logo Design
    receiver_skill: MOCK_SKILLS[2], // Wants Plumbing Repair from Jamie
    sender_skill_id: 1,
    receiver_skill_id: 3,
    message: "I'll design your logo if you fix my sink!",
    status: "pending",
    created_at: "2024-01-01T12:00:00Z",
  },
  {
    id: 2,
    sender: { ...MOCK_USER, id: 2, username: "barterer2", email: "barterer2@example.com", first_name: "Jamie", offered_skills: [{ id: 3, name: "Plumbing Repair" }], wanted_skills: [{ id: 1, name: "Logo Design" }] },
    receiver: MOCK_USER,
    sender_skill: MOCK_SKILLS[2], // Jamie offers Plumbing Repair
    receiver_skill: MOCK_SKILLS[0], // Wants Logo Design from Alex
    sender_skill_id: 3,
    receiver_skill_id: 1,
    message: "I'll fix your sink if you design my logo!",
    status: "accepted",
    created_at: "2024-01-02T15:30:00Z",
  },
];

// API Client
class ApiClient {
  async getCurrentUser() {
    return MOCK_USER;
  }
  async updateProfile(data: Partial<typeof MOCK_USER>) {
    return { ...MOCK_USER, ...data };
  }
  async getUserProfile(id: number) {
    return MOCK_USER;
  }
  async getUsers() {
    return [
      MOCK_USER,
      { ...MOCK_USER, id: 2, username: "barterer2", email: "barterer2@example.com", first_name: "Jamie", offered_skills: [{ id: 3, name: "Plumbing Repair" }], wanted_skills: [{ id: 1, name: "Logo Design" }] },
    ];
  }
  async getUser(id: number) {
    return MOCK_USER;
  }
  async searchUsers() {
    return [MOCK_USER];
  }
  async getUserSkills(userId: number) {
    return MOCK_USER_SKILLS;
  }
  async getSkills() {
    return MOCK_SKILLS;
  }
  async createSkill(data: { name: string }) {
    return { id: MOCK_SKILLS.length + 1, name: data.name };
  }
  async getSkill(id: number) {
    return MOCK_SKILLS.find(s => s.id === id) || MOCK_SKILLS[0];
  }
  async getUserSkillList() {
    return MOCK_USER_SKILLS;
  }
  async createUserSkill(data: { skill_id: number; is_offered: boolean }) {
    return { id: MOCK_USER_SKILLS.length + 1, skill: MOCK_SKILLS.find(s => s.id === data.skill_id), skill_id: data.skill_id, is_offered: data.is_offered };
  }
  async updateUserSkill(id: number, data: Partial<typeof MOCK_USER_SKILLS[0]>) {
    return { ...MOCK_USER_SKILLS[0], ...data };
  }
  async deleteUserSkill(id: number) {
    return;
  }
  async getSwapRequests() {
    return MOCK_SWAP_REQUESTS;
  }
  async getSentSwapRequests() {
    return MOCK_SWAP_REQUESTS;
  }
  async getReceivedSwapRequests() {
    return MOCK_SWAP_REQUESTS;
  }
  async createSwapRequest(data: any) {
    return { ...MOCK_SWAP_REQUESTS[0], ...data, id: MOCK_SWAP_REQUESTS.length + 1 };
  }
  async updateSwapRequest(id: number, data: { status: 'accepted' | 'rejected' }) {
    return { ...MOCK_SWAP_REQUESTS[0], ...data };
  }
  async getSwapRequest(id: number) {
    return MOCK_SWAP_REQUESTS[0];
  }
  async login() {
    return { user: MOCK_USER, message: "Login successful" };
  }
  async register() {
    return { user: MOCK_USER, message: "Registration successful" };
  }
  async logout() {
    return { message: "Logout successful" };
  }
  async healthCheck() {
    return { status: "healthy", message: "Mock health check", timestamp: new Date().toISOString() };
  }
  async signupHealthCheck() {
    return { status: "healthy", message: "Mock signup health check", database: "connected", user_count: 1, timestamp: new Date().toISOString() };
  }
  async bulkUpdateUserSkills(skills: Array<{ skill_id: number; is_offered: boolean }>) {
    return { message: "Skills updated successfully", results: skills.map(s => ({ ...s, skill_name: MOCK_SKILLS.find(sk => sk.id === s.skill_id)?.name || "", created: true })) };
  }
}

// Create and export API instance
export const api = new ApiClient();

// Auth context helper
export const isAuthenticated = async (): Promise<boolean> => {
  return true;
}; 