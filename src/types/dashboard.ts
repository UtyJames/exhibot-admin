// src/types/dashboard.ts
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalProducts: number;
  totalPosts: number;
  totalEvents: number;
}

export interface RecentUser {
  _id: string;
  userName: string;
  role: string;
  isCompleted: boolean;
  isActive: boolean;
  email: string;
  tags: string[];
  followers: string[];
  following: string[];
  created_at: string;
  token?: string;
  address?: string;
  bio?: string;
  name?: string;
  profilePic?: string;
  bannerImage?: string;
  socialLinks?: {
    instagram?: string;
    x?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
  };
}

export interface RecentActivity {
  _id: string;
  user: {
    _id: string;
    userName: string;
    email: string;
  };
  actor: {
    userId: string | null;
    name: string;
    profilePic: string | null;
  };
  type: string;
  description: string;
  isRead: boolean;
  created_at: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentUsers: RecentUser[];
  recentActivities: RecentActivity[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}