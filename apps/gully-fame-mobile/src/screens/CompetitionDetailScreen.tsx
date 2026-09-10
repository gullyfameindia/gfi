// Created by Kiro
// Competition Detail Screen - Display competition details, leaderboard, and participants

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
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Competition {
  id: string;
  title: string;
  description: string;
  image?: string;
  participants?: number;
  prize?: string;
  startDate?: string;
  endDate?: string;
  rules?: string;
}

interface Participant {
  id: string;
  name: string;
  rank: number;
  score: number;
  profileImage?: string;
}

export default function CompetitionDetailScreen({ route, navigation }: any) {
  const competition = route?.params?.competition as Competition;

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [joined, setJoined] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'leaderboard'>('details');

  useEffect(() => {
    fetchCompetitionData();
  }, []);

  // Fetch competition data
  const fetchCompetitionData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock leaderboard data
      setParticipants([
        {
          id: '1',
          name: 'John Doe',
          rank: 1,
          score: 9500,
          profileImage: undefined,
        },
        {
          id: '2',
          name: 'Jane Smith',
          rank: 2,
          score: 9200,
          profileImage: undefined,
        },
        {
          id: '3',
          name: 'Mike Johnson',
          rank: 3,
          score: 8900,
          profileImage: undefined,
        },
        {
          id: '4',
          name: 'Sarah Williams',
          rank: 4,
          score: 8500,
          profileImage: undefined,
        },
        {
          id: '5',
          name: 'Tom Brown',
          rank: 5,
          score: 8200,
          profileImage: undefined,
        },
      ]);
    } catch (error) {
      console.error('Error fetching competition data:', error);
      Alert.alert('Error', 'Failed to load competition data');
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCompetitionData();
    setRefreshing(false);
  };

  // Handle join competition
  const handleJoinCompetition = () => {
    Alert.alert(
      'Join Competition',
      'Are you sure you want to join this competition?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join',
          onPress: () => {
            setJoined(true);
            Alert.alert('Success', 'You have joined the competition');
          },
        },
      ]
    );
  };

  // Handle leave competition
  const handleLeaveCompetition = () => {
    Alert.alert(
      'Leave Competition',
      'Are you sure you want to leave this competition?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          onPress: () => {
            setJoined(false);
            Alert.alert('Success', 'You have left the competition');
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Render leaderboard item
  const renderLeaderboardItem = ({ item }: { item: Participant }) => (
    <View style={styles.leaderboardItem}>
      <View style={styles.rankContainer}>
        <Text style={styles.rankText}>#{item.rank}</Text>
      </View>

      {item.profileImage ? (
        <Image
          source={{ uri: item.profileImage }}
          style={styles.participantImage}
        />
      ) : (
        <View style={styles.participantImagePlaceholder}>
          <Ionicons name="person" size={20} color="#007AFF" />
        </View>
      )}

      <View style={styles.participantInfo}>
        <Text style={styles.participantName}>{item.name}</Text>
        <Text style={styles.participantScore}>{item.score} points</Text>
      </View>

      {item.rank === 1 && (
        <Ionicons name="trophy" size={24} color="#FFB800" />
      )}
      {item.rank === 2 && (
        <Ionicons name="medal" size={24} color="#C0C0C0" />
      )}
      {item.rank === 3 && (
        <Ionicons name="medal" size={24} color="#CD7F32" />
      )}
    </View>
  );

  if (loading && !competition) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading competition...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!competition) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Competition not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header Image */}
        {competition.image && (
          <Image
            source={{ uri: competition.image }}
            style={styles.headerImage}
          />
        )}

        {/* Competition Info */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{competition.title}</Text>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            {competition.participants && (
              <View style={styles.metaItem}>
                <Ionicons name="people" size={18} color="#007AFF" />
                <Text style={styles.metaText}>
                  {competition.participants} participants
                </Text>
              </View>
            )}
            {competition.prize && (
              <View style={styles.metaItem}>
                <Ionicons name="gift" size={18} color="#FFB800" />
                <Text style={styles.metaText}>{competition.prize}</Text>
              </View>
            )}
          </View>

          {/* Dates */}
          {(competition.startDate || competition.endDate) && (
            <View style={styles.datesContainer}>
              {competition.startDate && (
                <View style={styles.dateItem}>
                  <Ionicons name="calendar" size={16} color="#666" />
                  <Text style={styles.dateText}>
                    Start: {new Date(competition.startDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
              {competition.endDate && (
                <View style={styles.dateItem}>
                  <Ionicons name="calendar" size={16} color="#666" />
                  <Text style={styles.dateText}>
                    End: {new Date(competition.endDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'details' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('details')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'details' && styles.tabTextActive,
              ]}
            >
              Details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'leaderboard' && styles.tabActive,
            ]}
            onPress={() => setActiveTab('leaderboard')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'leaderboard' && styles.tabTextActive,
              ]}
            >
              Leaderboard
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'details' ? (
          <View style={styles.contentSection}>
            {/* Description */}
            {competition.description && (
              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>About</Text>
                <Text style={styles.detailText}>{competition.description}</Text>
              </View>
            )}

            {/* Rules */}
            {competition.rules && (
              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>Rules</Text>
                <Text style={styles.detailText}>{competition.rules}</Text>
              </View>
            )}

            {/* Prize Info */}
            {competition.prize && (
              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>Prize Pool</Text>
                <Text style={styles.detailText}>{competition.prize}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.contentSection}>
            {/* Leaderboard */}
            {participants.length > 0 ? (
              <FlatList
                data={participants}
                renderItem={renderLeaderboardItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="trophy-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No participants yet</Text>
              </View>
            )}
          </View>
        )}

        {/* Action Button */}
        <View style={styles.actionSection}>
          {joined ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.leaveButton]}
              onPress={handleLeaveCompetition}
            >
              <Ionicons name="exit" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Leave Competition</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.joinButton]}
              onPress={handleJoinCompetition}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Join Competition</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer Spacing */}
        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
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
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
  },
  headerImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  infoSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  datesContainer: {
    gap: 8,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#007AFF',
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  participantImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  participantImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  participantScore: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  actionSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  joinButton: {
    backgroundColor: '#007AFF',
  },
  leaveButton: {
    backgroundColor: '#d32f2f',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerSpacing: {
    height: 20,
  },
});
