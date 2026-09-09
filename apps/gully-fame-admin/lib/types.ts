
export type UserRole = 'admin' | 'sponsor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalEntertainers: number;
  totalContests: number;
  liveContests: number;
  upcomingContests: number;
  completedContests: number;
  totalEarnings: number;
  tipsSent: number;
  subscriptionsCount: number;
  activeSponsors: number;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  rules?: string;
  status: 'draft' | 'pending' | 'live' | 'upcoming' | 'completed';
  startDate: string;
  endDate: string;
  prizeAmount: number;
  category?: string;
  winnerSlots?: number;
  bannerImage?: string;
  sponsorId?: string;
  sponsorName?: string;
  sponsorLogo?: string;
  participants: number;
  entries: number;
  createdAt: string;
}

export interface ContentItem {
  id: string;
  type: 'reel' | 'image' | 'video';
  title: string;
  userId: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected' | 'reported';
  reports: number;
  views: number;
  likes: number;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'fan' | 'entertainer';
  status: 'active' | 'inactive' | 'banned';
  kycStatus: 'pending' | 'approved' | 'rejected';
  joinDate: string;
  totalEarnings: number;
  totalTips: number;
  followers: number;
  following: number;
}

export interface Transaction {
  id: string;
  type: 'tip' | 'purchase' | 'subscription' | 'payout';
  amount: number;
  userId: string;
  userName: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface SponsorAnalytics {
  totalViews: number;
  totalReach: number;
  totalEntries: number;
  totalEngagement: number;
  brandVisibility: number;
  competitions: {
    id: string;
    title: string;
    views: number;
    reach: number;
    entries: number;
    engagement: number;
  }[];
}

