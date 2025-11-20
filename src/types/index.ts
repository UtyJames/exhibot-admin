export interface User {
  id: string;
  name: string;
  email: string;
  hasBracelet: boolean;
  joinDate: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'issue';
  phone: string;
  referralCode: string;
  totalReferrals: number;
  totalTaps: number;
  issue?: string;
}

export interface Order {
  id: string;
  userId: string;
  user: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  amount: string;
  items: string[];
  address: string;
  trackingNumber: string | null;
}

export interface Referrer {
  rank: number;
  userId: string;
  name: string;
  code: string;
  referrals: number;
  earnings: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// Add this interface if it doesn't exist
export interface MenuItem {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: number;
}
export interface HeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
  title: string;
  subtitle: string;
}

// Add these to your existing types
// export type UserFilterType = 'all' | 'with-bracelet' | 'without-bracelet' | 'issues';
export type OrderFilterType = 'all' | 'pending' | 'processing' | 'shipped' | 'delivered';

// Add page-specific prop type

export interface User {
  _id: string;
  email: string;
  userName: string;
  name: string;
  profilePic: string;
  created_at: string;
  token?: string; // Add token field
}
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => void;
}

// src/types/index.ts - Update UsersTableProps
export interface UsersTableProps {
  searchQuery?: string;
  filter?: UserFilterType;
  onUserSelect: (user: any) => void;
  limit?: number;
  onUsersUpdate?: (count: number) => void;
}

export type UserFilterType = 'all' | 'active' | 'inactive' | 'completed' | 'incomplete';