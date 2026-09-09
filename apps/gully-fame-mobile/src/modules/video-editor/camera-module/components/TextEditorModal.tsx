// PATH: apps/gully-fame-mobile/src/modules/video-editor/camera-module/components/TextEditorModal.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import type { TextOverlay, TextAlign } from '../types/textOverlay.types';

interface TextEditorModalProps {
  visible: boolean;
  overlay: TextOverlay | null;
  onSave: (overlay: TextOverlay) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
  containerWidth: number;
  containerHeight: number;
}

const FONTS = ['System', 'serif', 'monospace', 'sans-serif-condensed'];
const COLORS = ['#FFFFFF', '#000000', '#FF0050', '#00F2FE', '#FFD700', '#00E676', '#9D00FF'];

const TextEditorModal: React.FC<TextEditorModalProps> = ({
  visible,
  overlay,
  onSave,
  onDelete,
  onClose,
  containerWidth,
  containerHeight,
}) => {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#FFFFFF');
  const [fontFamily, setFontFamily] = useState(FONTS[0]);
  const [textAlign, setTextAlign] = useState<TextAlign>('center');
  const [hasBackground, setHasBackground] = useState(false);
  
  // Keep original data intact
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5);
  const [x, setX] = useState(0.5);
  const [y, setY] = useState(0.5);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(1);

  // Tab state fixed: 'font' | 'color'
  const [activeTab, setActiveTab] = useState<'font' | 'color'>('font');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      if (overlay) {
        setText(overlay.text || '');
        setColor(overlay.color || '#FFFFFF');
        setFontFamily(overlay.fontFamily || FONTS[0]);
        setTextAlign(overlay.textAlign || 'center');
        setHasBackground(!!overlay.backgroundColor);
        
        // Restore timeline/position data
        setStartTime(overlay.startTime ?? 0);
        setEndTime(overlay.endTime ?? 5);
        setX(overlay.x ?? 0.5);
        setY(overlay.y ?? 0.5);
        setRotation(overlay.rotation ?? 0);
        setOpacity(overlay.opacity ?? 1);
      } else {
        // Defaults for new text
        setText('');
        setColor('#FFFFFF');
        setFontFamily(FONTS[0]);
        setTextAlign('center');
        setHasBackground(false);
        setStartTime(0);
        setEndTime(5);
        setX(0.5);
        setY(0.5);
      }
      
      // Auto focus keyboard with slight delay for smooth animation
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      Keyboard.dismiss();
    }
  }, [visible, overlay]);

  const handleSave = useCallback(() => {
    if (!text.trim()) {
      if (overlay && onDelete) onDelete(overlay.id);
      onClose();
      return;
    }

    const updatedOverlay: TextOverlay = {
      id: overlay?.id || `text-${Date.now()}`,
      text: text.trim(),
      color,
      fontFamily,
      textAlign,
      backgroundColor: hasBackground ? (color === '#FFFFFF' ? '#000000' : '#FFFFFF') : undefined,
      fontSize: 36, // Base size
      fontWeight: 'bold',
      x,
      y,
      rotation,
      opacity,
      startTime,
      endTime,
    };

    onSave(updatedOverlay);
    onClose();
  }, [text, color, fontFamily, textAlign, hasBackground, x, y, rotation, opacity, startTime, endTime, overlay, onSave, onDelete, onClose]);

  const toggleAlignment = () => {
    setTextAlign(prev => prev === 'center' ? 'left' : prev === 'left' ? 'right' : 'center');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleSave}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Transparent background overlay - Tapping outside saves and closes */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleSave} />

        <SafeAreaView style={styles.safeArea}>
          {/* Top Header - Done Button */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleSave} style={styles.doneButton}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Main Typing Area */}
          <View style={styles.typingArea} pointerEvents="box-none">
            <View style={[
              styles.textInputWrapper,
              hasBackground && { 
                backgroundColor: color === '#FFFFFF' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
              }
            ]}>
              <TextInput
                ref={inputRef}
                style={[
                  styles.textInput,
                  {
                    color: hasBackground && color === '#FFFFFF' ? '#FFFFFF' : hasBackground ? '#000000' : color,
                    fontFamily: fontFamily,
                    textAlign: textAlign,
                  }
                ]}
                value={text}
                onChangeText={setText}
                multiline
                placeholder="Type something..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                autoCapitalize="sentences"
              />
            </View>
          </View>

          {/* Bottom Tools Menu (Above Keyboard) */}
          <View style={styles.toolsContainer}>
            <View style={styles.dragIndicator} />
            
            {/* Main Toolbar Icons */}
            <View style={styles.toolbarRow}>
              
              {/* Keyboard Icon */}
              <TouchableOpacity style={styles.iconButtonSolid} onPress={() => inputRef.current?.focus()}>
                <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <Rect x="2" y="6" width="20" height="12" rx="2" stroke="#FFF" strokeWidth="2"/>
                  <Circle cx="6" cy="10" r="1" fill="#FFF"/><Circle cx="10" cy="10" r="1" fill="#FFF"/><Circle cx="14" cy="10" r="1" fill="#FFF"/><Circle cx="18" cy="10" r="1" fill="#FFF"/>
                  <Circle cx="6" cy="14" r="1" fill="#FFF"/><Circle cx="10" cy="14" r="1" fill="#FFF"/><Circle cx="14" cy="14" r="1" fill="#FFF"/><Circle cx="18" cy="14" r="1" fill="#FFF"/>
                  <Path d="M8 18H16" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                </Svg>
              </TouchableOpacity>

              {/* Font Style Tab */}
              <TouchableOpacity onPress={() => setActiveTab('font')}>
                <Text style={[styles.toolIconText, activeTab === 'font' && styles.activeToolText]}>Aa</Text>
              </TouchableOpacity>

              {/* Color Wheel Tab */}
              <TouchableOpacity onPress={() => setActiveTab('color')}>
                <View style={[styles.colorWheel, activeTab === 'color' && styles.activeColorWheel]}>
                  <View style={[styles.colorWheelInner, { backgroundColor: color }]} />
                </View>
              </TouchableOpacity>

              {/* Background Toggle */}
              <TouchableOpacity style={styles.bgToggleButton} onPress={() => setHasBackground(!hasBackground)}>
                <Text style={[styles.toolIconText, hasBackground && styles.activeToolText]}>A</Text>
              </TouchableOpacity>

              {/* Alignment Toggle */}
              <TouchableOpacity onPress={toggleAlignment}>
                <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <Path d={textAlign === 'center' ? "M4 6H20M7 12H17M4 18H20" : textAlign === 'left' ? "M4 6H20M4 12H14M4 18H20" : "M4 6H20M10 12H20M4 18H20"} stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
                </Svg>
              </TouchableOpacity>
            </View>

            {/* Sub-menu (Fonts or Colors) */}
            <View style={styles.subMenuContainer}>
              {activeTab === 'font' ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fontScroll}>
                  {FONTS.map((font) => (
                    <TouchableOpacity key={font} onPress={() => setFontFamily(font)} style={styles.fontPreviewContainer}>
                      <Text style={[
                        styles.fontPreviewText,
                        { fontFamily: font },
                        fontFamily === font && styles.activeFontPreview
                      ]}>
                        {text || 'Aa'}
                      </Text>
                      {fontFamily === font && <View style={styles.activeDot} />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorScroll}>
                  {COLORS.map((c) => (
                    <TouchableOpacity 
                      key={c} 
                      style={[styles.colorBubble, { backgroundColor: c }, color === c && styles.activeColorBubble]} 
                      onPress={() => setColor(c)} 
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  safeArea: { flex: 1, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 10, zIndex: 10 },
  doneButton: { paddingHorizontal: 16, paddingVertical: 8 },
  doneText: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  typingArea: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  textInputWrapper: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  textInput: { fontSize: 36, fontWeight: 'bold', minWidth: 150, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  toolsContainer: { backgroundColor: '#1E1E1E', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: Platform.OS === 'ios' ? 20 : 10 },
  dragIndicator: { width: 40, height: 4, backgroundColor: '#555', borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 16 },
  toolbarRow: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: 16 },
  iconButtonSolid: { backgroundColor: '#333', padding: 8, borderRadius: 8 },
  toolIconText: { color: '#FFF', fontSize: 20, fontWeight: 'bold', fontFamily: 'serif' },
  activeToolText: { color: '#ec9a15' },
  colorWheel: { width: 28, height: 28, borderRadius: 14, padding: 2, borderWidth: 2, borderColor: '#555' },
  activeColorWheel: { borderColor: '#FFF' },
  colorWheelInner: { flex: 1, borderRadius: 12 },
  bgToggleButton: { borderWidth: 1.5, borderColor: '#FFF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  subMenuContainer: { height: 60, justifyContent: 'center' },
  fontScroll: { paddingHorizontal: 20, gap: 30, alignItems: 'center' },
  fontPreviewContainer: { alignItems: 'center' },
  fontPreviewText: { color: '#888', fontSize: 18, fontWeight: 'bold' },
  activeFontPreview: { color: '#FFF' },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF', marginTop: 4 },
  colorScroll: { paddingHorizontal: 20, gap: 16, alignItems: 'center' },
  colorBubble: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#555' },
  activeColorBubble: { borderWidth: 2, borderColor: '#FFF', transform: [{ scale: 1.1 }] },
});

export default TextEditorModal;