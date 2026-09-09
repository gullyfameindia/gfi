









import * as musicTracks from './musicTracks';
import * as videoFilters from './videoFilters';
import * as reels from './reels';
import * as categories from './categories';

export interface MockDataConfig {
  useMockData: boolean; 
  enableLogging: boolean; 
  fallbackToMock: boolean; 
}

class MockDataManager {
  private config: MockDataConfig = {
    useMockData: __DEV__, 
    enableLogging: __DEV__,
    fallbackToMock: true, 
  };

  


  setConfig(config: Partial<MockDataConfig>) {
    this.config = { ...this.config, ...config };
    if (this.config.enableLogging) {
      console.log('[MockDataManager] Config updated:', this.config);
    }
  }

  


  getConfig(): MockDataConfig {
    return { ...this.config };
  }

  


  shouldUseMockData(): boolean {
    return this.config.useMockData || this.config.fallbackToMock;
  }

  


  private logMockUsage(source: string) {
    if (this.config.enableLogging) {
      console.log(`[MockData] Using mock data for: ${source}`);
    }
  }

  

  getMusicTracks(category?: string) {
    this.logMockUsage(`getMusicTracks(${category})`);
    if (category) {
      return musicTracks.getMusicTracksByCategory(category);
    }
    return musicTracks.mockMusicTracks;
  }

  getTrendingTracks() {
    this.logMockUsage('getTrendingTracks');
    return musicTracks.getTrendingTracks();
  }

  getPopularTracks() {
    this.logMockUsage('getPopularTracks');
    return musicTracks.getPopularTracks();
  }

  getNewTracks() {
    this.logMockUsage('getNewTracks');
    return musicTracks.getNewTracks();
  }

  searchMusicTracks(query: string) {
    this.logMockUsage(`searchMusicTracks(${query})`);
    return musicTracks.searchMusicTracks(query);
  }

  getMusicCategories() {
    this.logMockUsage('getMusicCategories');
    return musicTracks.musicCategories;
  }

  

  getVideoFilters() {
    this.logMockUsage('getVideoFilters');
    return videoFilters.getAllFilters();
  }

  getVideoEffects() {
    this.logMockUsage('getVideoEffects');
    return videoFilters.getAllEffects();
  }

  getVideoTransitions() {
    this.logMockUsage('getVideoTransitions');
    return videoFilters.getAllTransitions();
  }

  getVideoStickers() {
    this.logMockUsage('getVideoStickers');
    return videoFilters.getAllStickers();
  }

  getFiltersByCategory(category: 'filter' | 'effect' | 'transition' | 'sticker') {
    this.logMockUsage(`getFiltersByCategory(${category})`);
    return videoFilters.getFiltersByCategory(category);
  }

  getPopularFilters() {
    this.logMockUsage('getPopularFilters');
    return videoFilters.getPopularFilters();
  }

  

  getTrendingReels() {
    this.logMockUsage('getTrendingReels');
    return reels.getTrendingReels();
  }

  getPopularReels() {
    this.logMockUsage('getPopularReels');
    return reels.getPopularReels();
  }

  getNewReels() {
    this.logMockUsage('getNewReels');
    return reels.getNewReels();
  }

  getForYouReels() {
    this.logMockUsage('getForYouReels');
    return reels.getForYouReels();
  }

  getReelsByCategory(category: string) {
    this.logMockUsage(`getReelsByCategory(${category})`);
    return reels.getReelsByCategory(category);
  }

  searchReels(query: string) {
    this.logMockUsage(`searchReels(${query})`);
    return reels.searchReels(query);
  }

  getAllReels() {
    this.logMockUsage('getAllReels');
    return reels.mockReels;
  }

  

  getTrendingCategories() {
    this.logMockUsage('getTrendingCategories');
    return categories.getTrendingCategories();
  }

  getAllCategories() {
    this.logMockUsage('getAllCategories');
    return categories.getAllCategories();
  }

  getFeaturedCollections() {
    this.logMockUsage('getFeaturedCollections');
    return categories.getFeaturedCollections();
  }

  getAllCollections() {
    this.logMockUsage('getAllCollections');
    return categories.getAllCollections();
  }

  getCategoryById(id: string) {
    this.logMockUsage(`getCategoryById(${id})`);
    return categories.getCategoryById(id);
  }

  getCollectionById(id: string) {
    this.logMockUsage(`getCollectionById(${id})`);
    return categories.getCollectionById(id);
  }

  

  


  resetMockData() {
    console.log('[MockDataManager] Mock data reset');
    
  }

  


  getStats() {
    return {
      musicTracks: musicTracks.mockMusicTracks.length,
      musicCategories: musicTracks.musicCategories.length,
      videoFilters: videoFilters.mockVideoFilters.length,
      reels: reels.mockReels.length,
      categories: categories.mockCategories.length,
      collections: categories.mockCollections.length,
    };
  }

  


  logAvailableData() {
    const stats = this.getStats();
    console.log('========== MOCK DATA AVAILABLE ==========');
    console.log(`Music Tracks: ${stats.musicTracks}`);
    console.log(`Music Categories: ${stats.musicCategories}`);
    console.log(`Video Filters: ${stats.videoFilters}`);
    console.log(`Reels/Feed Items: ${stats.reels}`);
    console.log(`Categories: ${stats.categories}`);
    console.log(`Collections: ${stats.collections}`);
    console.log('========================================');
  }
}


export const mockDataManager = new MockDataManager();


if (__DEV__ && typeof global !== 'undefined') {
  (global as any).__MOCK_DATA__ = mockDataManager;
}
