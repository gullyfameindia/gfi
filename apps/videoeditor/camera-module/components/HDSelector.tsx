import React, { useRef, useState } from 'react';
import { Dimensions, Modal, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { cameraStyles } from '../styles/cameraStyles';

export type Resolution = 'hd' | '2k' | '4k';
export type FrameRate = 24 | 30 | 60;
export type ColorMode = 'sdr' | 'hdr';

interface HDSelectorProps {
  resolution: Resolution;
  frameRate: FrameRate;
  colorMode: ColorMode;
  onResolutionChange: (resolution: Resolution) => void;
  onFrameRateChange: (frameRate: FrameRate) => void;
  onColorModeChange: (colorMode: ColorMode) => void;
  cameraFacing?: 'front' | 'back';
  disabled?: boolean;
}

interface DeviceCapabilities {
  supportsHD: boolean;
  supports2K: boolean;
  supports4K: boolean;
  supports24fps: boolean;
  supports30fps: boolean;
  supports60fps: boolean;
  supportsHDR: boolean;
}

/**
 * HD selector component with HD icon.
 * Shows Resolution (HD, 2K, 4K), Frame Rate (24, 30, 60), and Color (SDR, HDR) options in a modal.
 */
const HDSelector: React.FC<HDSelectorProps> = ({
  resolution,
  frameRate,
  colorMode,
  onResolutionChange,
  onFrameRateChange,
  onColorModeChange,
  cameraFacing = 'back',
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    buttonY: 0,
    buttonHeight: 0,
    buttonCenterY: 0,
    arrowTop: 0,
  });
  const [popupLayout, setPopupLayout] = useState({ width: 0, height: 0 });
  
  // 🔥 DIRECT FIX: Sabhi options initially hi TRUE set kar diye gaye hain
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    supportsHD: true,
    supports2K: true,
    supports4K: true,
    supports24fps: true,
    supports30fps: true,
    supports60fps: true,
    supportsHDR: true,
  });

  const buttonRef = useRef<View>(null);
  const popupRef = useRef<View>(null);

  const handleOpenModal = () => {
    if (disabled) return;
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

        // Responsive spacing based on screen size
        const spacing = screenWidth * 0.02; // 2% of screen width
        const estimatedPopupWidth = screenWidth * 0.22; // 22% for wider content
        let popupLeft = pageX + width + spacing;

        // Ensure popup doesn't go off-screen on the right
        const safeAreaMargin = screenHeight * 0.015;
        if (popupLeft + estimatedPopupWidth > screenWidth - safeAreaMargin) {
          popupLeft = screenWidth - estimatedPopupWidth - safeAreaMargin;
        }

        // Calculate button center Y position
        const buttonCenterY = pageY + height / 2;

        // Estimated popup height (3 sections with options)
        const estimatedPopupHeight = screenHeight * 0.4; // ~40% of screen height

        // Center the popup on the button
        let popupTop = buttonCenterY - estimatedPopupHeight / 2;
        const minTop = safeAreaMargin;
        const maxTop = screenHeight - estimatedPopupHeight - safeAreaMargin;
        popupTop = Math.max(minTop, Math.min(popupTop, maxTop));

        // Calculate arrow position to point at button center
        const arrowTopPosition = buttonCenterY - popupTop - 30;

        setButtonLayout({
          x: popupLeft,
          y: popupTop,
          width: estimatedPopupWidth,
          height: estimatedPopupHeight,
          buttonY: pageY,
          buttonHeight: height,
          buttonCenterY,
          arrowTop: arrowTopPosition,
        });
        setPopupLayout({ width: estimatedPopupWidth, height: estimatedPopupHeight });
        setModalVisible(true);
      });
    }
  };

  const handlePopupLayout = () => {
    if (popupRef.current && buttonLayout.buttonCenterY) {
      popupRef.current.measure((x, y, width, height, pageX, pageY) => {
        const { height: screenHeight } = Dimensions.get('window');
        const actualPopupHeight = height;
        const buttonCenterY = buttonLayout.buttonCenterY;

        // Responsive safe area margin
        const safeAreaMargin = screenHeight * 0.015;
        let popupTop = buttonCenterY - actualPopupHeight / 2;
        const minTop = safeAreaMargin;
        const maxTop = screenHeight - actualPopupHeight - safeAreaMargin;
        popupTop = Math.max(minTop, Math.min(popupTop, maxTop));

        // Calculate arrow position to point at button center
        const arrowTopPosition = buttonCenterY - popupTop - 30;

        setButtonLayout(prev => ({
          ...prev,
          y: popupTop,
          arrowTop: arrowTopPosition,
        }));
        setPopupLayout({ width, height: actualPopupHeight });
      });
    }
  };

  const resolutionOptions: { value: Resolution; label: string; supported: boolean }[] = [
    { value: 'hd', label: 'HD', supported: capabilities.supportsHD },
    { value: '2k', label: '2K', supported: capabilities.supports2K },
    { value: '4k', label: '4K', supported: capabilities.supports4K },
  ];

  const frameRateOptions: { value: FrameRate; label: string; supported: boolean }[] = [
    { value: 24, label: '24', supported: capabilities.supports24fps },
    { value: 30, label: '30', supported: capabilities.supports30fps },
    { value: 60, label: '60', supported: capabilities.supports60fps },
  ];

  const colorOptions: { value: ColorMode; label: string; supported: boolean }[] = [
    { value: 'sdr', label: 'SDR', supported: true }, 
    { value: 'hdr', label: 'HDR', supported: capabilities.supportsHDR },
  ];

  const handleSelectResolution = (value: Resolution) => {
    if (resolutionOptions.find(opt => opt.value === value)?.supported) {
      onResolutionChange(value);
    }
  };

  const handleSelectFrameRate = (value: FrameRate) => {
    if (frameRateOptions.find(opt => opt.value === value)?.supported) {
      onFrameRateChange(value);
    }
  };

  const handleSelectColor = (value: ColorMode) => {
    if (colorOptions.find(opt => opt.value === value)?.supported) {
      onColorModeChange(value);
    }
  };

  const getResolutionLabel = (res: Resolution): string => {
    return resolutionOptions.find(opt => opt.value === res)?.label || 'HD';
  };

  return (
    <>
      <View ref={buttonRef} collapsable={false}>
        <TouchableOpacity
          style={[
            cameraStyles.hdSelectorButton,
            disabled && cameraStyles.disabledIconButton,
          ]}
          onPress={handleOpenModal}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`HD Settings: ${getResolutionLabel(resolution)} ${frameRate}fps ${colorMode.toUpperCase()}`}
          activeOpacity={0.8}
        >
          <Text style={[
            cameraStyles.hdSelectorText,
            disabled && cameraStyles.disabledIconText,
          ]}>
            HD+
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={cameraStyles.hdModalOverlay} pointerEvents="box-none">
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View
            ref={popupRef}
            onLayout={handlePopupLayout}
            style={[
              cameraStyles.hdModalContent,
              {
                left: buttonLayout.x,
                top: buttonLayout.y,
              },
            ]}
            pointerEvents="auto"
          >
            {buttonLayout.arrowTop > 0 && (
              <View
                style={[
                  cameraStyles.hdModalArrow,
                  {
                    top: buttonLayout.arrowTop - 7,
                  },
                ]}
              />
            )}

            {/* Resolution Section */}
            <View style={cameraStyles.hdModalSection}>
              <Text style={cameraStyles.hdModalSectionTitle}>Resolution</Text>
              <View style={cameraStyles.hdModalOptionsRow}>
                {resolutionOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      cameraStyles.hdModalOption,
                      resolution === option.value && cameraStyles.hdModalOptionActive,
                      !option.supported && cameraStyles.hdModalOptionDisabled,
                    ]}
                    onPress={() => handleSelectResolution(option.value)}
                    disabled={!option.supported}
                  >
                    <Text
                      style={[
                        cameraStyles.hdModalOptionText,
                        resolution === option.value && cameraStyles.hdModalOptionTextActive,
                        !option.supported && cameraStyles.hdModalOptionTextDisabled,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Frame Rate Section */}
            <View style={cameraStyles.hdModalSection}>
              <Text style={cameraStyles.hdModalSectionTitle}>Frame Rate</Text>
              <View style={cameraStyles.hdModalOptionsRow}>
                {frameRateOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      cameraStyles.hdModalOption,
                      frameRate === option.value && cameraStyles.hdModalOptionActive,
                      !option.supported && cameraStyles.hdModalOptionDisabled,
                    ]}
                    onPress={() => handleSelectFrameRate(option.value)}
                    disabled={!option.supported}
                  >
                    <Text
                      style={[
                        cameraStyles.hdModalOptionText,
                        frameRate === option.value && cameraStyles.hdModalOptionTextActive,
                        !option.supported && cameraStyles.hdModalOptionTextDisabled,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Color Section */}
            <View style={cameraStyles.hdModalSection}>
              <Text style={cameraStyles.hdModalSectionTitle}>Color</Text>
              <View style={cameraStyles.hdModalOptionsRow}>
                {colorOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      cameraStyles.hdModalOption,
                      colorMode === option.value && cameraStyles.hdModalOptionActive,
                      !option.supported && cameraStyles.hdModalOptionDisabled,
                    ]}
                    onPress={() => handleSelectColor(option.value)}
                    disabled={!option.supported}
                  >
                    <Text
                      style={[
                        cameraStyles.hdModalOptionText,
                        colorMode === option.value && cameraStyles.hdModalOptionTextActive,
                        !option.supported && cameraStyles.hdModalOptionTextDisabled,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default HDSelector;