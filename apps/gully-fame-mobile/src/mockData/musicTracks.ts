





export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  category: string;
  duration: number; 
  thumbnail?: string;
  audioUrl?: string;
  usageCount?: number;
  popularity?: number; 
  isTrending?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
}

export const mockMusicTracks: MusicTrack[] = [
  
  {
    id: 'track-001',
    title: 'Urban Vibes',
    artist: 'DJ Khaled',
    category: 'trending',
    duration: 180,
    usageCount: 2340,
    popularity: 95,
    isTrending: true,
  },
  {
    id: 'track-002',
    title: 'Summer Nights',
    artist: 'The Weeknd',
    category: 'trending',
    duration: 210,
    usageCount: 1890,
    popularity: 92,
    isTrending: true,
  },
  {
    id: 'track-003',
    title: 'Electric Dreams',
    artist: 'Dua Lipa',
    category: 'trending',
    duration: 195,
    usageCount: 1650,
    popularity: 88,
    isTrending: true,
  },
  {
    id: 'track-004',
    title: 'Midnight Flow',
    artist: 'Post Malone',
    category: 'trending',
    duration: 225,
    usageCount: 1420,
    popularity: 85,
    isTrending: true,
  },
  {
    id: 'track-005',
    title: 'Sunrise Beats',
    artist: 'Calvin Harris',
    category: 'trending',
    duration: 190,
    usageCount: 1200,
    popularity: 82,
    isTrending: true,
  },

  
  {
    id: 'track-006',
    title: 'Musicalitunnel',
    artist: 'musicalitunnel',
    category: 'popular',
    duration: 240,
    usageCount: 27,
    popularity: 78,
    isPopular: true,
  },
  {
    id: 'track-007',
    title: 'Sukoon',
    artist: 'Othoms',
    category: 'popular',
    duration: 210,
    usageCount: 39,
    popularity: 75,
    isPopular: true,
  },
  {
    id: 'track-008',
    title: 'Koi Baat Hai',
    artist: 'Arjun Tanwar',
    category: 'popular',
    duration: 200,
    usageCount: 28,
    popularity: 72,
    isPopular: true,
  },
  {
    id: 'track-009',
    title: 'Neon Lights',
    artist: 'Daft Punk',
    category: 'popular',
    duration: 215,
    usageCount: 1050,
    popularity: 80,
    isPopular: true,
  },
  {
    id: 'track-010',
    title: 'Retro Groove',
    artist: 'Bruno Mars',
    category: 'popular',
    duration: 185,
    usageCount: 920,
    popularity: 77,
    isPopular: true,
  },

  
  {
    id: 'track-011',
    title: 'Fresh Start',
    artist: 'Billie Eilish',
    category: 'new',
    duration: 175,
    usageCount: 120,
    popularity: 65,
    isNew: true,
  },
  {
    id: 'track-012',
    title: 'Digital Age',
    artist: 'Olivia Rodrigo',
    category: 'new',
    duration: 195,
    usageCount: 95,
    popularity: 62,
    isNew: true,
  },
  {
    id: 'track-013',
    title: 'Wave Rider',
    artist: 'Khalid',
    category: 'new',
    duration: 205,
    usageCount: 78,
    popularity: 58,
    isNew: true,
  },
  {
    id: 'track-014',
    title: 'Cosmic Journey',
    artist: 'Tyler, The Creator',
    category: 'new',
    duration: 230,
    usageCount: 65,
    popularity: 55,
    isNew: true,
  },
  {
    id: 'track-015',
    title: 'Neon Dreams',
    artist: 'Arca',
    category: 'new',
    duration: 210,
    usageCount: 45,
    popularity: 50,
    isNew: true,
  },

  
  {
    id: 'track-016',
    title: 'Hard Knock Life',
    artist: 'Jay-Z',
    category: 'hip-hop',
    duration: 195,
    usageCount: 680,
    popularity: 76,
  },
  {
    id: 'track-017',
    title: 'Rap God',
    artist: 'Eminem',
    category: 'hip-hop',
    duration: 240,
    usageCount: 920,
    popularity: 84,
  },
  {
    id: 'track-018',
    title: 'King Of The Hill',
    artist: 'Kanye West',
    category: 'hip-hop',
    duration: 215,
    usageCount: 750,
    popularity: 79,
  },

  
  {
    id: 'track-019',
    title: 'Levels',
    artist: 'Avicii',
    category: 'electronic',
    duration: 200,
    usageCount: 1100,
    popularity: 83,
  },
  {
    id: 'track-020',
    title: 'Animals',
    artist: 'Martin Garrix',
    category: 'electronic',
    duration: 190,
    usageCount: 980,
    popularity: 81,
  },
  {
    id: 'track-021',
    title: 'Gecko',
    artist: 'Oliver Heldens',
    category: 'electronic',
    duration: 210,
    usageCount: 850,
    popularity: 78,
  },

  
  {
    id: 'track-022',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    category: 'pop',
    duration: 263,
    usageCount: 1450,
    popularity: 87,
  },
  {
    id: 'track-023',
    title: 'Shape Of You',
    artist: 'Ed Sheeran',
    category: 'pop',
    duration: 233,
    usageCount: 1680,
    popularity: 89,
  },
  {
    id: 'track-024',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    category: 'pop',
    duration: 200,
    usageCount: 1920,
    popularity: 91,
  },

  
  {
    id: 'track-025',
    title: 'Take Me Out',
    artist: 'Franz Ferdinand',
    category: 'indie',
    duration: 247,
    usageCount: 520,
    popularity: 68,
  },
  {
    id: 'track-026',
    title: 'Wonderwall',
    artist: 'Oasis',
    category: 'indie',
    duration: 258,
    usageCount: 750,
    popularity: 72,
  },
  {
    id: 'track-027',
    title: 'Young Folks',
    artist: 'Peter Bjorn and John',
    category: 'indie',
    duration: 226,
    usageCount: 420,
    popularity: 65,
  },
];

export const musicCategories = [
  { id: 'trending', label: 'Trending', icon: '🔥' },
  { id: 'popular', label: 'Popular', icon: '⭐' },
  { id: 'new', label: 'New', icon: '✨' },
  { id: 'hip-hop', label: 'Hip-Hop', icon: '🎤' },
  { id: 'electronic', label: 'Electronic', icon: '⚡' },
  { id: 'pop', label: 'Pop', icon: '🎵' },
  { id: 'indie', label: 'Indie', icon: '🎸' },
];

export const getMusicTracksByCategory = (category: string): MusicTrack[] => {
  if (category === 'all') return mockMusicTracks;
  return mockMusicTracks.filter((track) => track.category === category);
};

export const getTrendingTracks = (): MusicTrack[] => {
  return mockMusicTracks
    .filter((track) => track.isTrending)
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, 10);
};

export const getPopularTracks = (): MusicTrack[] => {
  return mockMusicTracks
    .filter((track) => track.isPopular)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 10);
};

export const getNewTracks = (): MusicTrack[] => {
  return mockMusicTracks
    .filter((track) => track.isNew)
    .slice(0, 10);
};

export const searchMusicTracks = (query: string): MusicTrack[] => {
  const lowerQuery = query.toLowerCase();
  return mockMusicTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      track.category.toLowerCase().includes(lowerQuery)
  );
};
