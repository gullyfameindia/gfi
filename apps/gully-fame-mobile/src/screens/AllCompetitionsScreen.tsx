// Created by Kiro
// All Competitions Screen - Display all competitions with filtering and search

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  FlatList,
  TextInput,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { competitionService } from '../api/services/competitionService';

interface Competition {
  id: string;
  title: string;
  description: string;
  image?: string;
  participants?: number;
  prize?: string;
  status?: 'active' | 'upcoming' | 'ended';
}

export default function AllCompetitionsScreen({ navigation }: any) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  useEffect(() => {
    filterCompetitions();
  }, [competitions, searchQuery, selectedFilter]);

  // Fetch competitions
  const fetchCompetitions = async (pageNum: number = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }

      const result = await competitionService.getCompetitions();

      if (result.success && result.data) {
        if (pageNum === 1) {
          setCompetitions(result.data.items as any);
        } else {
          setCompetitions([...competitions, ...(result.data.items as any)]);
        }
        setHasMore(result.data.items.length > 0);
      } else {
        Alert.alert('Error', result.error || 'Failed to load competitions');
      }
    } catch (error) {
      console.error('Error fetching competitions:', error);
      Alert.alert('Error', 'Failed to load competitions');
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchCompetitions(1);
    setRefreshing(false);
  };

  // Filter competitions
  const filterCompetitions = () => {
    let filtered = competitions;

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((comp) => comp.status === selectedFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((comp) =>
        comp.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCompetitions(filtered);
  };

  // Handle load more
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCompetitions(nextPage);
    }
  };

  // Handle competition tap
  const handleCompetitionTap = (competition: Competition) => {
    navigation.navigate('CompetitionDetail', { competition });
  };

  // Render competition item
  const renderCompetitionItem = ({ item }: { item: Competition }) => (
    <TouchableOpacity
      style={styles.competitionCard}
      onPress={() => handleCompetitionTap(item)}
    >
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={styles.competitionImage}
        />
      )}

      <View style={styles.competitionInfo}>
        <View style={styles.competitionHeader}>
          <Text style={styles.competitionTitle} numberOfLines={2}>
            {item.title}
          </Text>
          {item.status && (
            <View
              style={[
                styles.statusBadge,
                item.status === 'active' && styles.statusActive,
                item.status === 'upcoming' && styles.statusUpcoming,
                item.status === 'ended' && styles.statusEnded,
              ]}
            >
              <Text style={styles.statusText}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.competitionDesc} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.competitionMeta}>
          {item.participants && (
            <View style={styles.metaItem}>
              <Ionicons name="people" size={14} color="#007AFF" />
              <Text style={styles.metaText}>{item.participants}</Text>
            </View>
          )}
          {item.prize && (
            <View style={styles.metaItem}>
              <Ionicons name="gift" size={14} color="#FFB800" />
              <Text style={styles.metaText}>{item.prize}</Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  // Render footer (load more button)
  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#007AFF" />
        ) : (
          <>
            <Ionicons name="chevron-down" size={20} color="#007AFF" />
            <Text style={styles.loadMoreText}>Load More</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && competitions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading competitions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search competitions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {(['all', 'active', 'upcoming', 'ended'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === filter && styles.filterTabTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Competitions List */}
      {filteredCompetitions.length > 0 ? (
        <FlatList
          data={filteredCompetitions}
          renderItem={renderCompetitionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No competitions found</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
    color: '#000',
  },
  filterScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  competitionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  competitionImage: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
  },
  competitionInfo: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  competitionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 8,
  },
  competitionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  statusActive: {
    backgroundColor: '#e8f5e9',
  },
  statusUpcoming: {
    backgroundColor: '#e3f2fd',
  },
  statusEnded: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  competitionDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    lineHeight: 16,
  },
  competitionMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
