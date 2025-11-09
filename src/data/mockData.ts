import { User, Order, Referrer, ChartData } from '../types';

export const mockUsers: User[] = [
  { id: 'USR-001', name: 'Sarah Chen', email: 'sarah.chen@email.com', hasBracelet: true, joinDate: '2024-01-10', lastActive: '2024-01-18', status: 'active', phone: '+234 801 234 5678', referralCode: 'REF-001', totalReferrals: 12, totalTaps: 45 },
  { id: 'USR-002', name: 'Mike Johnson', email: 'mike.j@email.com', hasBracelet: true, joinDate: '2024-01-12', lastActive: '2024-01-17', status: 'active', phone: '+234 802 345 6789', referralCode: 'REF-002', totalReferrals: 8, totalTaps: 32 },
  { id: 'USR-003', name: 'Emma Davis', email: 'emma.davis@email.com', hasBracelet: false, joinDate: '2024-01-15', lastActive: '2024-01-18', status: 'active', phone: '+234 803 456 7890', referralCode: 'REF-003', totalReferrals: 5, totalTaps: 0 },
  { id: 'USR-004', name: 'Alex Kim', email: 'alex.kim@email.com', hasBracelet: true, joinDate: '2024-01-08', lastActive: '2024-01-16', status: 'issue', issue: 'Bracelet not activated', phone: '+234 804 567 8901', referralCode: 'REF-004', totalReferrals: 3, totalTaps: 0 },
  { id: 'USR-005', name: 'Jordan Lee', email: 'jordan.lee@email.com', hasBracelet: false, joinDate: '2024-01-16', lastActive: '2024-01-18', status: 'active', phone: '+234 805 678 9012', referralCode: 'REF-005', totalReferrals: 15, totalTaps: 0 },
  { id: 'USR-006', name: 'Taylor Swift', email: 'taylor.s@email.com', hasBracelet: false, joinDate: '2024-01-17', lastActive: '2024-01-17', status: 'issue', issue: 'Payment failed', phone: '+234 806 789 0123', referralCode: 'REF-006', totalReferrals: 2, totalTaps: 0 },
  { id: 'USR-007', name: 'Chris Martin', email: 'chris.m@email.com', hasBracelet: true, joinDate: '2024-01-05', lastActive: '2024-01-18', status: 'active', phone: '+234 807 890 1234', referralCode: 'REF-007', totalReferrals: 20, totalTaps: 67 },
  { id: 'USR-008', name: 'Lisa Park', email: 'lisa.park@email.com', hasBracelet: false, joinDate: '2024-01-18', lastActive: '2024-01-18', status: 'active', phone: '+234 808 901 2345', referralCode: 'REF-008', totalReferrals: 1, totalTaps: 0 },
];

export const mockOrders: Order[] = [
  { id: '#ORD-1234', userId: 'USR-001', user: 'Sarah Chen', status: 'delivered', date: '2024-01-15', amount: '₦49,999', items: ['Exhiibot Bracelet'], address: '123 Main St, Lagos', trackingNumber: 'TRK-123456' },
  { id: '#ORD-1235', userId: 'USR-002', user: 'Mike Johnson', status: 'shipped', date: '2024-01-16', amount: '₦49,999', items: ['Exhiibot Bracelet'], address: '456 Oak Ave, Abuja', trackingNumber: 'TRK-123457' },
  { id: '#ORD-1236', userId: 'USR-003', user: 'Emma Davis', status: 'pending', date: '2024-01-17', amount: '₦49,999', items: ['Exhiibot Bracelet'], address: '789 Pine Rd, Port Harcourt', trackingNumber: null },
  { id: '#ORD-1237', userId: 'USR-004', user: 'Alex Kim', status: 'shipped', date: '2024-01-17', amount: '₦49,999', items: ['Exhiibot Bracelet'], address: '321 Elm St, Kano', trackingNumber: 'TRK-123458' },
  { id: '#ORD-1238', userId: 'USR-005', user: 'Jordan Lee', status: 'pending', date: '2024-01-18', amount: '₦49,999', items: ['Exhiibot Bracelet'], address: '654 Maple Dr, Ibadan', trackingNumber: null },
  { id: '#ORD-1239', userId: 'USR-007', user: 'Chris Martin', status: 'delivered', date: '2024-01-14', amount: '₦49,999', items: ['Exhiibot Bracelet'], address: '987 Cedar Ln, Enugu', trackingNumber: 'TRK-123459' },
  { id: '#ORD-1240', userId: 'USR-008', user: 'Lisa Park', status: 'processing', date: '2024-01-18', amount: '₦49,999', items: ['Exhiibot Bracelet'], address: '147 Birch St, Calabar', trackingNumber: null },
];

export const mockReferrers: Referrer[] = [
  { rank: 1, userId: 'USR-007', name: 'Chris Martin', code: 'CHRIS2024', referrals: 45, earnings: '₦450,000' },
  { rank: 2, userId: 'USR-001', name: 'Sarah Chen', code: 'SARAH10', referrals: 38, earnings: '₦380,000' },
  { rank: 3, userId: 'USR-005', name: 'Jordan Lee', code: 'JORDAN99', referrals: 32, earnings: '₦320,000' },
  { rank: 4, userId: 'USR-002', name: 'Mike Johnson', code: 'MIKE24', referrals: 28, earnings: '₦280,000' },
  { rank: 5, userId: 'USR-003', name: 'Emma Davis', code: 'EMMAD', referrals: 24, earnings: '₦240,000' },
];

export const userGrowthData: ChartData[] = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 250 },
  { name: 'Mar', value: 380 },
  { name: 'Apr', value: 520 },
  { name: 'May', value: 680 },
  { name: 'Jun', value: 850 },
];

export const tapAnalyticsData: ChartData[] = [
  { name: 'Mon', value: 145 },
  { name: 'Tue', value: 189 },
  { name: 'Wed', value: 234 },
  { name: 'Thu', value: 198 },
  { name: 'Fri', value: 276 },
  { name: 'Sat', value: 312 },
  { name: 'Sun', value: 289 },
];

export const revenueData: ChartData[] = [
  { name: 'Jan', value: 450000 },
  { name: 'Feb', value: 780000 },
  { name: 'Mar', value: 920000 },
  { name: 'Apr', value: 1100000 },
  { name: 'May', value: 1250000 },
  { name: 'Jun', value: 1450000 },
];