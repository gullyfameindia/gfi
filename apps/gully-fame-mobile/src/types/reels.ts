export interface ReelUser {
  id: string;
  username: string;
  fullName?: string;
  avatar?: string;
}

export interface ReelStats {
  likes: number;
  comments: number;
  shares: number;
  views?: number;
}

export interface Reel {
  id: string;
  videoUrl: string;
  thumbnail?: string;
  caption?: string;
  createdAt?: string;
  user: ReelUser;
  stats: ReelStats;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface ReelsPagination {
  page: number;
  limit: number;
  totalPages?: number;
  totalCount?: number;
  hasMore: boolean;
}

export interface ReelsData {
  reels: Reel[];
  pagination: ReelsPagination;
}

export interface ReelsResponse {
  success: boolean;
  message?: string;
  data: ReelsData;
}