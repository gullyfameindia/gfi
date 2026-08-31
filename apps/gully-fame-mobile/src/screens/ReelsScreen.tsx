import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { getReelsFeed } from '../api/services/reelsService';
import type { Reel } from '../types/reels';
import { Video, ResizeMode } from 'expo-video';
// Importing the newly updated Support Popup
import { TipPopup } from '../components/tip/TipComponents';

const { height, width } = Dimensions.get('window');


const DUMMY_VIDEOS = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://download.samplelib.com/mp4/sample-5s.mp4',
  'https://download.samplelib.com/mp4/sample-10s.mp4',
  'https://download.samplelib.com/mp4/sample-15s.mp4',
  'https://download.samplelib.com/mp4/sample-20s.mp4',
  'https://download.samplelib.com/mp4/sample-30s.mp4',
];

const ReelsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [reels, setReels] = useState<Reel[]>([]);
  const [error, setError] = useState('');

  // States for Support Modal flow
  const [isSupportVisible, setIsSupportVisible] = useState(false);
  const [selectedReelId, setSelectedReelId] = useState<number | null>(null);

  const [activeReelIndex, setActiveReelIndex] = useState(0);

  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setActiveReelIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getReelsFeed({ page: 1, limit: 10 });
      let fetchedReels = (response.data?.items as any) || [];

      // Inject dummy reels if none are found from the API
      if (fetchedReels.length === 0) {
        fetchedReels = DUMMY_VIDEOS.map((url, index) => ({
          id: `dummy-${index}`,
          videoUrl: url,
          caption: `This is dummy reel #${index + 1}! 🕺🔥`,
          user: { username: `creator_${index + 1}` },
        }));
      }

      setReels(fetchedReels);
    } catch (err: any) {
      // Fallback to dummy data on error
      const fallbackReels = DUMMY_VIDEOS.map((url, index) => ({
        id: `dummy-${index}`,
        videoUrl: url,
        caption: `Offline dummy reel #${index + 1}! 💃✨`,
        user: { username: `dancer_${index + 1}` },
      }));
      setReels(fallbackReels as any);
      // setError(err?.message || 'Failed to load reels');
    } finally {
      setLoading(false);
    }
  };

  const handleSupportPress = (reelId: any) => {
    // Parsing ID to number as expected by the component
    setSelectedReelId(Number(reelId) || 0);
    setIsSupportVisible(true);
  };

  const handleSupportSuccess = (amount: number) => {
    console.log(`Successfully sent support of amount: ${amount} for reel: ${selectedReelId}`);
  };

  const renderItem = ({ item, index }: { item: Reel, index: number }) => {
    const isActive = activeReelIndex === index;
    const isNearby = Math.abs(activeReelIndex - index) <= 1;
    const videoSource = (item as any).videoUrl || DUMMY_VIDEOS[index % DUMMY_VIDEOS.length];
    console.log(`Reel ${index} videoSource:`, videoSource);
console.log('REEL DEBUG:', JSON.stringify(item));

    return (
      <View style={styles.reelItem}>
        {/* Real-time Dummy Video */}
        {isNearby ? (
          <Video
            source={{ uri: videoSource }}
            style={StyleSheet.absoluteFillObject}
            resizeMode={ResizeMode.COVER}
            shouldPlay={isActive}
            isLooping
            isMuted={false}
            useNativeControls={false}
            onError={(e) => console.error(`Video ${index} Error:`, e)}
          />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#111' }]} />
        )}

        {/* Right Sidebar Icons Layout */}
        <View style={styles.rightSidebar}>
          <TouchableOpacity style={styles.sidebarButton}>
            <Text style={styles.sidebarIconText}>💬</Text>
            <Text style={styles.sidebarCount}>45</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton}>
            <Text style={styles.sidebarIconText}>➡️</Text>
            <Text style={styles.sidebarCount}>23</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton}>
            <Text style={styles.sidebarIconText}>📥</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Content Area */}
        <View style={styles.bottomContentContainer}>
          {/* User Info Row */}
          <View style={styles.userInfoRow}>
            <View style={styles.avatarMock} />
            <Text style={styles.username}>@{item.user.username || 'DancerPro'}</Text>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>

          {/* Caption */}
          <Text style={styles.caption} numberOfLines={2}>
            {item.caption || 'Showing off my moves! 💃 #dance #gullyfame'}
          </Text>

          {/* Audio Track Info */}
          <Text style={styles.audioTrack}>
            🎵 Original Sound - {item.user.username || 'DancerPro'}
          </Text>

          {/* Main Action Buttons Row (Matching the screenshot layout) */}
          <View style={styles.actionButtonsRow}>
            {/* Updated 'Tip' Button ➡️ 'Support' Button */}
            <TouchableOpacity
              style={styles.supportButton}
              activeOpacity={0.8}
              onPress={() => handleSupportPress(item.id)}
            >
              <View style={styles.coinIconWrapper}>
                <Text style={styles.coinDollarSymbol}>$</Text>
              </View>
              <Text style={styles.supportButtonText}>Support</Text>
            </TouchableOpacity>

            {/* Vote Action Button */}
            <TouchableOpacity style={styles.votedButton} activeOpacity={0.8}>
              <Text style={styles.votedButtonText}>★ Voted • 256</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#EC9A15" />
        <Text style={styles.infoText}>Loading reels...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!reels.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>No reels found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <FlatList
        data={reels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToAlignment="start"
        decelerationRate="fast"
      />

      {/* Global Support Popup Sheet */}
      {selectedReelId !== null && (
        <TipPopup
          visible={isSupportVisible}
          onClose={() => setIsSupportVisible(false)}
          reelId={selectedReelId}
          onTipSuccess={handleSupportSuccess}
        />
      )}
    </View>
  );
};

export default ReelsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  reelItem: {
    height: height,
    width: width,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  rightSidebar: {
    position: 'absolute',
    right: 12,
    bottom: height * 0.22,
    alignItems: 'center',
    gap: 16,
    zIndex: 10,
  },
  sidebarButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarIconText: {
    fontSize: 28,
    color: '#fff',
  },
  sidebarCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  bottomContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40, // Keeps spacing clear of bottom navigation tab bar area
    width: '100%',
    zIndex: 5,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  avatarMock: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#444',
    borderWidth: 1,
    borderColor: '#EC9A15',
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  followButton: {
    backgroundColor: '#EC9A15',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  audioTrack: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  supportButton: {
    flex: 1,
    backgroundColor: '#EC9A15',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    height: 48,
    gap: 8,
  },
  coinIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinDollarSymbol: {
    color: '#EC9A15',
    fontSize: 13,
    fontWeight: '800',
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  votedButton: {
    flex: 1,
    backgroundColor: '#EC9A15',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    height: 48,
  },
  votedButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});