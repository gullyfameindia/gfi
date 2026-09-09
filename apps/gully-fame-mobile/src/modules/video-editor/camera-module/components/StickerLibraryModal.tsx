// PATH: apps/gully-fame-mobile/src/modules/video-editor/camera-module/components/StickerLibraryModal.tsx

import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface StickerLibraryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSticker?: (sticker: any) => void;
}

const StickerLibraryModal: React.FC<StickerLibraryModalProps> = ({
  visible,
  onClose,
  onSelectSticker,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (item: string) => {
    if (onSelectSticker) onSelectSticker(item);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheetContainer}>
          {/* Drag Handle */}
          <TouchableOpacity style={styles.dragHandleContainer} onPress={onClose} activeOpacity={1}>
            <View style={styles.dragHandle} />
          </TouchableOpacity>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={styles.searchIcon}>
              <Path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M21 21L16.65 16.65" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* Cutouts Section */}
            <View style={styles.cutoutSection}>
              <TouchableOpacity style={styles.cutoutButton} onPress={() => handleSelect('CUTOUTS')}>
                <Text style={styles.cutoutIcon}>✂️</Text>
                <Text style={styles.cutoutButtonText}>CUTOUTS</Text>
              </TouchableOpacity>
              <Text style={styles.cutoutTitle}>Create with Cutouts</Text>
              <Text style={styles.cutoutSubtitle}>
                Turn photos into stickers to use in reels and stories.{'\n'}
                They'll be saved here so you can use them anytime.
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Widgets (Pills) Section */}
            <View style={styles.widgetsGrid}>
              <TouchableOpacity style={styles.widgetPill} onPress={() => handleSelect('LOCATION')}>
                <Text style={styles.widgetIconColor}>📍</Text>
                <Text style={styles.widgetText}>LOCATION</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.widgetPill} onPress={() => handleSelect('CAPTIONS')}>
                <View style={styles.blueCircleIcon}><Text style={styles.smallIconText}>CC</Text></View>
                <Text style={styles.widgetText}>CAPTIONS</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.widgetPill} onPress={() => handleSelect('PHOTO')}>
                <Text style={styles.widgetIconColor}>🖼️</Text>
                <Text style={styles.widgetText}>PHOTO</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.widgetPill} onPress={() => handleSelect('GIF')}>
                <Text style={styles.widgetIconColor}>🔍</Text>
                <Text style={styles.widgetText}>GIF</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.widgetPillSlider} onPress={() => handleSelect('SLIDER')}>
                <Text style={styles.sliderEmoji}>😍</Text>
                <View style={styles.sliderLine} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.widgetPill} onPress={() => handleSelect('QUIZ')}>
                <Text style={styles.widgetIconColor}>✅</Text>
                <Text style={styles.widgetText}>QUIZ</Text>
              </TouchableOpacity>
            </View>

            {/* Visual Stickers Grid (Dummy styling to match screenshot) */}
            <View style={styles.visualStickersGrid}>
              {/* Row 1 */}
              <TouchableOpacity style={styles.stickerItem} onPress={() => handleSelect('TEMP')}>
                <Text style={styles.tempText}>31°C</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stickerItem} onPress={() => handleSelect('CLOCK')}>
                <View style={styles.digitalClock}>
                  <Text style={styles.clockText}>1 10</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stickerItem} onPress={() => handleSelect('HEART')}>
                <View style={styles.heartBubble}>
                  <Text style={styles.heartText}>🤍 1</Text>
                </View>
              </TouchableOpacity>

              {/* Row 2 */}
              <TouchableOpacity style={styles.stickerItem} onPress={() => handleSelect('SOUND_ON')}>
                <Text style={[styles.graphicText, { color: '#FF4500' }]}>SOUND ON!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stickerItem} onPress={() => handleSelect('VIBES')}>
                <Text style={[styles.graphicText, { color: '#FFD700' }]}>Vibes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stickerItem} onPress={() => handleSelect('THURSDAY')}>
                <Text style={[styles.graphicText, { color: '#9370DB' }]}>THURSDAY</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    height: SCREEN_HEIGHT * 0.88,
    backgroundColor: '#1E1E1E', // Match exact dark grey of screenshot
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    ...Platform.select({ android: { padding: 0 } }),
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  cutoutSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cutoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 16,
  },
  cutoutIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  cutoutButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  cutoutTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cutoutSubtitle: {
    color: '#AAA',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    marginBottom: 24,
  },
  widgetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  widgetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  widgetPillSlider: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 110,
  },
  widgetIconColor: {
    fontSize: 16,
    marginRight: 6,
  },
  blueCircleIcon: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  smallIconText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  widgetText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sliderEmoji: {
    fontSize: 20,
    marginRight: 8,
    zIndex: 2,
  },
  sliderLine: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  visualStickersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
  },
  stickerItem: {
    width: '30%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tempText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '400',
  },
  digitalClock: {
    backgroundColor: '#888',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  clockText: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  heartBubble: {
    backgroundColor: '#FF0040',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 4,
  },
  heartText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  graphicText: {
    fontSize: 18,
    fontWeight: '900',
    fontStyle: 'italic',
  }
});

export default StickerLibraryModal;