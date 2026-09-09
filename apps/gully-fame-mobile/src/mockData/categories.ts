




export interface Category {
  id: string;
  name: string;
  icon: string;
  emoji?: string;
  color?: string;
  reelCount?: number;
  isTrending?: boolean;
}

export interface Collection {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  itemCount: number;
  featured: boolean;
}

export const mockCategories: Category[] = [
  {
    id: 'cat-dance',
    name: 'Dance',
    icon: '🕺',
    emoji: '💃',
    color: '#FF6B6B',
    reelCount: 4250,
    isTrending: true,
  },
  {
    id: 'cat-comedy',
    name: 'Comedy',
    icon: '😂',
    emoji: '🤣',
    color: '#4ECDC4',
    reelCount: 3890,
    isTrending: true,
  },
  {
    id: 'cat-music',
    name: 'Music',
    icon: '🎵',
    emoji: '🎶',
    color: '#95E1D3',
    reelCount: 5120,
    isTrending: true,
  },
  {
    id: 'cat-fitness',
    name: 'Fitness',
    icon: '💪',
    emoji: '🏋️',
    color: '#FFA502',
    reelCount: 2340,
  },
  {
    id: 'cat-cooking',
    name: 'Cooking',
    icon: '🍳',
    emoji: '👨‍🍳',
    color: '#FF5733',
    reelCount: 1890,
  },
  {
    id: 'cat-fashion',
    name: 'Fashion',
    icon: '👗',
    emoji: '👠',
    color: '#E74C3C',
    reelCount: 3450,
  },
  {
    id: 'cat-beauty',
    name: 'Beauty',
    icon: '💄',
    emoji: '✨',
    color: '#9B59B6',
    reelCount: 2890,
  },
  {
    id: 'cat-travel',
    name: 'Travel',
    icon: '✈️',
    emoji: '🌍',
    color: '#3498DB',
    reelCount: 1670,
  },
  {
    id: 'cat-tech',
    name: 'Tech',
    icon: '📱',
    emoji: '💻',
    color: '#2C3E50',
    reelCount: 1240,
  },
  {
    id: 'cat-pets',
    name: 'Pets',
    icon: '🐶',
    emoji: '🐱',
    color: '#E8A76E',
    reelCount: 2120,
  },
  {
    id: 'cat-art',
    name: 'Art',
    icon: '🎨',
    emoji: '🖌️',
    color: '#E74C3C',
    reelCount: 980,
  },
  {
    id: 'cat-diy',
    name: 'DIY',
    icon: '🛠️',
    emoji: '🔨',
    color: '#D2691E',
    reelCount: 750,
  },
  {
    id: 'cat-sports',
    name: 'Sports',
    icon: '⚽',
    emoji: '🏀',
    color: '#27AE60',
    reelCount: 1560,
  },
  {
    id: 'cat-education',
    name: 'Education',
    icon: '📚',
    emoji: '👨‍🎓',
    color: '#3498DB',
    reelCount: 1340,
  },
  {
    id: 'cat-lifestyle',
    name: 'Lifestyle',
    icon: '🏡',
    emoji: '☕',
    color: '#F39C12',
    reelCount: 2560,
  },
];

export const mockCollections: Collection[] = [
  {
    id: 'col-trending-today',
    title: 'Trending Today',
    description: 'The hottest content right now',
    itemCount: 245,
    featured: true,
  },
  {
    id: 'col-viral-challenges',
    title: 'Viral Challenges',
    description: 'Popular challenges everyone is doing',
    itemCount: 180,
    featured: true,
  },
  {
    id: 'col-new-creators',
    title: 'Rising Stars',
    description: 'Discover amazing new creators',
    itemCount: 320,
    featured: true,
  },
  {
    id: 'col-funny-moments',
    title: 'Laugh Out Loud',
    description: 'The funniest content on the platform',
    itemCount: 450,
    featured: true,
  },
  {
    id: 'col-dance-moves',
    title: 'Dance Moves',
    description: 'Learn the latest dance trends',
    itemCount: 280,
    featured: false,
  },
  {
    id: 'col-beauty-tips',
    title: 'Beauty & Makeup',
    description: 'Makeup and beauty hacks',
    itemCount: 210,
    featured: false,
  },
  {
    id: 'col-food-lovers',
    title: 'Food Paradise',
    description: 'Delicious food content',
    itemCount: 165,
    featured: false,
  },
  {
    id: 'col-music-hits',
    title: 'Music Hits',
    description: 'Latest music videos and performances',
    itemCount: 390,
    featured: false,
  },
];

export const getTrendingCategories = (): Category[] => {
  return mockCategories.filter((cat) => cat.isTrending).slice(0, 5);
};

export const getAllCategories = (): Category[] => {
  return mockCategories.sort((a, b) => (b.reelCount || 0) - (a.reelCount || 0));
};

export const getFeaturedCollections = (): Collection[] => {
  return mockCollections.filter((col) => col.featured);
};

export const getAllCollections = (): Collection[] => {
  return mockCollections;
};

export const getCategoryById = (id: string): Category | undefined => {
  return mockCategories.find((cat) => cat.id === id);
};

export const getCollectionById = (id: string): Collection | undefined => {
  return mockCollections.find((col) => col.id === id);
};
