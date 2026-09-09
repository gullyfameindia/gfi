import React, { useRef, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { cameraStyles } from '../styles/cameraStyles';

export type TimerDuration = 10 | 15 | 30;

interface TimerSelectorProps {
  duration: TimerDuration;
  onDurationChange: (duration: TimerDuration) => void;
  disabled?: boolean;
}

/**
 * Timer selector component with clock icon.
 * Shows 10, 15, 30 second options in a modal.
 */
const TimerSelector: React.FC<TimerSelectorProps> = ({ duration, onDurationChange, disabled = false }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0, buttonY: 0, buttonHeight: 0, buttonCenterY: 0, arrowTop: 0 });
  const [popupLayout, setPopupLayout] = useState({ width: 0, height: 0 });
  const buttonRef = useRef<View>(null);
  const popupRef = useRef<View>(null);

  const handleOpenModal = () => {
    if (disabled) return;
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
        
        // Responsive spacing based on screen size
        const spacing = screenWidth * 0.02; // 2% of screen width
        const estimatedPopupWidth = screenWidth * 0.18; // 18% of screen width (min 60px)
        let popupLeft = pageX + width + spacing;
        
        // Ensure popup doesn't go off-screen on the right
        const safeAreaMargin = screenHeight * 0.015; // 1.5% of screen height
        if (popupLeft + estimatedPopupWidth > screenWidth - safeAreaMargin) {
          popupLeft = screenWidth - estimatedPopupWidth - safeAreaMargin;
        }
        
        // Calculate button center Y position
        const buttonCenterY = pageY + height / 2;
        
        // Use estimated popup height (will be corrected on layout)
        // Rough estimate: ~35px per option including padding/margins
        const optionsCount = 3;
        const estimatedPopupHeight = optionsCount * (screenHeight * 0.045); // ~4.5% per option
        
        // Center the popup on the button (will be adjusted when actual dimensions are known)
        let popupTop = buttonCenterY - (estimatedPopupHeight / 2);
        
        // Ensure popup doesn't go off-screen
        const minTop = safeAreaMargin;
        const maxTop = screenHeight - estimatedPopupHeight - safeAreaMargin;
        popupTop = Math.max(minTop, Math.min(popupTop, maxTop));
        
        // Store initial layout - will update when popup is measured
        setButtonLayout({ 
          x: popupLeft,
          y: popupTop,
          buttonY: pageY,
          buttonHeight: height,
          buttonCenterY,
          width, 
          height,
          arrowTop: 0 // Will be calculated after popup measurement
        });
        setModalVisible(true);
      });
    }
  };
  const handleSelectDuration = (newDuration: TimerDuration) => {
    onDurationChange(newDuration);
    setModalVisible(false);
  };

  const handlePopupLayout = () => {
    if (popupRef.current && buttonLayout.buttonCenterY) {
      popupRef.current.measure((x, y, width, height, pageX, pageY) => {
        const { height: screenHeight } = Dimensions.get('window');
        const actualPopupHeight = height;
        const buttonCenterY = buttonLayout.buttonCenterY;
        
        // Responsive safe area margin
        const safeAreaMargin = screenHeight * 0.015; // 1.5% of screen height
        
        // Recalculate popup position with actual height
        let popupTop = buttonCenterY - (actualPopupHeight / 2) - 30;
        const minTop = safeAreaMargin;
        const maxTop = screenHeight - actualPopupHeight - safeAreaMargin;
        popupTop = Math.max(minTop, Math.min(popupTop, maxTop));
        
        // Calculate arrow position to point at button center
        const arrowTopPosition = buttonCenterY - popupTop - 30;
        
        setButtonLayout(prev => ({
          ...prev,
          y: popupTop,
          arrowTop: arrowTopPosition
        }));
        setPopupLayout({ width, height: actualPopupHeight });
      });
    }
  };

  return (
    <>
      <View ref={buttonRef} collapsable={false}>
        <TouchableOpacity
          style={[
            cameraStyles.timerSelectorButton,
            disabled && cameraStyles.disabledIconButton,
          ]}
          onPress={handleOpenModal}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Timer: ${duration} s`}
          activeOpacity={0.8}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
              stroke={disabled ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M12 6V12"
              stroke={disabled ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M16.24 16.24L12 12"
              stroke={disabled ? 'rgba(255, 255, 255, 0.4)' : '#ffffff'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={cameraStyles.timerModalOverlay} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View
            ref={popupRef}
            onLayout={handlePopupLayout}
            style={[
              cameraStyles.timerModalContent,
              {
                left: buttonLayout.x,
                top: buttonLayout.y,
              },
            ]}
            pointerEvents="auto"
          >
            {/* Arrow pointing left - aligned to button center */}
            {buttonLayout.arrowTop > 0 && (
              <View style={[cameraStyles.timerModalArrow, { 
                top: buttonLayout.arrowTop - (cameraStyles.timerModalArrow.borderTopWidth || 7)
              }]} />
            )}
            {([10, 15, 30] as TimerDuration[]).map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  cameraStyles.timerModalOption,
                  duration === option && cameraStyles.timerModalOptionActive,
                ]}
                onPress={() => handleSelectDuration(option)}
              >
                <Text
                  style={[
                    cameraStyles.timerModalOptionText,
                    duration === option && cameraStyles.timerModalOptionTextActive,
                  ]}
                >
                  {option}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default TimerSelector;

