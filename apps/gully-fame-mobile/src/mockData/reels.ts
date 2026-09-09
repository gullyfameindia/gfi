




export interface Reel {
  id: string;
  title: string;
  description?: string;
  creator: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    isVerified?: boolean;
    followers?: number;
  };
  thumbnail?: string;
  videoUrl?: string;
  duration: number; 
  category: string;
  tags?: string[];
  likes: number;
  comments: number;
  shares: number;
  views: number;
  createdAt: string;
  musicTrack?: {
    id: string;
    title: string;
    artist: string;
  };
  competition?: {
    id: string;
    title: string;
    prizePool?: number;
  };
  isTrending?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

export const mockReels: Reel[] = [
  
  {
    id: 'reel-001',
    title: 'Epic Dance Challenge',
    description: 'Watch this amazing dance move! 🕺',
    creator: {
      id: 'user-001',
      name: 'Alex Turner',
      username: 'alexturner',
      isVerified: true,
      followers: 45000,
    },
    duration: 35,
    category: 'dance',
    tags: ['dance', 'challenge', 'trending'],
    likes: 12400,
    comments: 890,
    shares: 2340,
    views: 245000,
    createdAt: '2024-08-24T10:30:00Z',
    musicTrack: {
      id: 'track-001',
      title: 'Urban Vibes',
      artist: 'DJ Khaled',
    },
    isTrending: true,
  },
  {
    id: 'reel-002',
    title: 'Street Fashion Lookbook',
    description: 'Latest street style from the city 👔✨',
    creator: {
      id: 'user-002',
      name: 'Sarah Kim',
      username: 'sarahkimstyle',
      isVerified: true,
      followers: 38000,
    },
    duration: 28,
    category: 'fashion',
    tags: ['fashion', 'style', 'lookbook'],
    likes: 8900,
    comments: 650,
    shares: 1200,
    views: 156000,
    createdAt: '2024-08-24T09:15:00Z',
    musicTrack: {
      id: 'track-002',
      title: 'Summer Nights',
      artist: 'The Weeknd',
    },
    isTrending: true,
  },
  {
    id: 'reel-003',
    title: 'Comedy Skit - Restaurant Fails',
    description: 'When food delivery goes wrong 😂',
    creator: {
      id: 'user-003',
      name: 'Funny Bro',
      username: 'funnybro',
      isVerified: true,
      followers: 52000,
    },
    duration: 42,
    category: 'comedy',
    tags: ['comedy', 'funny', 'skit'],
    likes: 15600,
    comments: 1240,
    shares: 3100,
    views: 320000,
    createdAt: '2024-08-24T08:00:00Z',
    isTrending: true,
  },
  {
    id: 'reel-004',
    title: 'Morning Workout Motivation',
    description: 'Start your day with energy! 💪',
    creator: {
      id: 'user-004',
      name: 'Fit Life',
      username: 'fitlifepro',
      isVerified: true,
      followers: 28000,
    },
    duration: 55,
    category: 'fitness',
    tags: ['fitness', 'workout', 'motivation'],
    likes: 6700,
    comments: 420,
    shares: 890,
    views: 98000,
    createdAt: '2024-08-23T22:30:00Z',
    musicTrack: {
      id: 'track-003',
      title: 'Electric Dreams',
      artist: 'Dua Lipa',
    },
    isTrending: true,
  },
  {
    id: 'reel-005',
    title: 'Cooking Challenge - Indian Food',
    description: 'Can I make authentic biryani in 10 mins? 🍛',
    creator: {
      id: 'user-005',
      name: 'Chef Arun',
      username: 'chefarun',
      isVerified: true,
      followers: 31000,
    },
    duration: 45,
    category: 'cooking',
    tags: ['cooking', 'food', 'challenge'],
    likes: 9200,
    comments: 780,
    shares: 1650,
    views: 178000,
    createdAt: '2024-08-23T20:15:00Z',
    musicTrack: {
      id: 'track-004',
      title: 'Midnight Flow',
      artist: 'Post Malone',
    },
    isTrending: true,
  },

  
  {
    id: 'reel-006',
    title: 'Music Production Tutorial',
    description: 'Learn how to produce beats like a pro 🎹',
    creator: {
      id: 'user-006',
      name: 'Beat Maker Pro',
      username: 'beatmakerpro',
      isVerified: false,
      followers: 18000,
    },
    duration: 68,
    category: 'music',
    tags: ['music', 'tutorial', 'production'],
    likes: 5400,
    comments: 340,
    shares: 720,
    views: 85000,
    createdAt: '2024-08-23T14:00:00Z',
    isPopular: true,
  },
  {
    id: 'reel-007',
    title: 'Pet Fails Compilation',
    description: 'Cutest and funniest pet moments 🐶🐱',
    creator: {
      id: 'user-007',
      name: 'Paws & Claws',
      username: 'pawsandclaws',
      isVerified: false,
      followers: 22000,
    },
    duration: 52,
    category: 'pets',
    tags: ['pets', 'funny', 'cute'],
    likes: 7800,
    comments: 560,
    shares: 1100,
    views: 142000,
    createdAt: '2024-08-23T12:30:00Z',
    isPopular: true,
  },
  {
    id: 'reel-008',
    title: 'Travel Vlog - Mumbai Streets',
    description: 'Exploring the vibrant streets of Mumbai 🏙️',
    creator: {
      id: 'user-008',
      name: 'Wanderlust Raj',
      username: 'wanderlustraj',
      isVerified: true,
      followers: 41000,
    },
    duration: 85,
    category: 'travel',
    tags: ['travel', 'vlog', 'mumbai'],
    likes: 6200,
    comments: 420,
    shares: 890,
    views: 112000,
    createdAt: '2024-08-23T10:00:00Z',
    isPopular: true,
  },
  {
    id: 'reel-009',
    title: 'Art Time Lapse',
    description: 'Painting a portrait from scratch ✨',
    creator: {
      id: 'user-009',
      name: 'Artist Maya',
      username: 'artistmaya',
      isVerified: false,
      followers: 15000,
    },
    duration: 120,
    category: 'art',
    tags: ['art', 'painting', 'timelapse'],
    likes: 4100,
    comments: 280,
    shares: 520,
    views: 67000,
    createdAt: '2024-08-22T18:00:00Z',
    isPopular: true,
  },
  {
    id: 'reel-010',
    title: 'Tech Review - Latest Smartphone',
    description: 'Unboxing and review of the new flagship 📱',
    creator: {
      id: 'user-010',
      name: 'Tech Talks',
      username: 'techtalks',
      isVerified: true,
      followers: 35000,
    },
    duration: 95,
    category: 'tech',
    tags: ['tech', 'review', 'smartphone'],
    likes: 8900,
    comments: 620,
    shares: 1420,
    views: 198000,
    createdAt: '2024-08-22T16:30:00Z',
    isPopular: true,
  },

  
  {
    id: 'reel-011',
    title: 'DIY Home Decor Ideas',
    description: 'Transform your room with these easy ideas! 🛋️',
    creator: {
      id: 'user-011',
      name: 'Home Studio',
      username: 'homestudio',
      isVerified: false,
      followers: 12000,
    },
    duration: 38,
    category: 'diy',
    tags: ['diy', 'home', 'decor'],
    likes: 2100,
    comments: 150,
    shares: 280,
    views: 35000,
    createdAt: '2024-08-24T15:00:00Z',
    isNew: true,
  },
  {
    id: 'reel-012',
    title: 'Plant Care Tips for Beginners',
    description: 'Keep your plants alive and thriving! 🌱',
    creator: {
      id: 'user-012',
      name: 'Green Thumb',
      username: 'greenthumb',
      isVerified: false,
      followers: 9000,
    },
    duration: 42,
    category: 'lifestyle',
    tags: ['plants', 'gardening', 'lifestyle'],
    likes: 1800,
    comments: 120,
    shares: 210,
    views: 28000,
    createdAt: '2024-08-24T14:30:00Z',
    isNew: true,
  },
];

export const getTrendingReels = (): Reel[] => {
  return mockReels
    .filter((reel) => reel.isTrending)
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
};

export const getPopularReels = (): Reel[] => {
  return mockReels
    .filter((reel) => reel.isPopular)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10);
};

export const getNewReels = (): Reel[] => {
  return mockReels
    .filter((reel) => reel.isNew)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);
};

export const getReelsByCategory = (category: string): Reel[] => {
  return mockReels.filter((reel) => reel.category === category);
};

export const getForYouReels = (): Reel[] => {
  
  return [...mockReels].sort(() => 0.5 - Math.random()).slice(0, 15);
};

export const searchReels = (query: string): Reel[] => {
  const lowerQuery = query.toLowerCase();
  return mockReels.filter(
    (reel) =>
      reel.title.toLowerCase().includes(lowerQuery) ||
      reel.creator.name.toLowerCase().includes(lowerQuery) ||
      reel.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};
