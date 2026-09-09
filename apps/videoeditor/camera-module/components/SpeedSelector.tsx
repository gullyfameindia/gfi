import React, { useRef, useState } from "react";
import { Dimensions, Modal, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Svg, { Path } from "react-native-svg"; 
import { cameraStyles } from "../styles/cameraStyles";

export interface VelocityCurve {
  name: string;
  points: [number, number, number, number]; 
  svgPath: string; 
  label: string;
}

export type SpeedMultiplier = 0.5 | 1 | 2 | 3 | 5;
export type SpeedSelection = {
  type: 'constant' | 'curve';
  value: SpeedMultiplier | string;
  curveConfig?: VelocityCurve;
};

// CameraScreen.tsx ke actual incoming props ke sath 100% sync kiya
interface SpeedSelectorProps {
  speed: number; 
  onSpeedChange: (newSpeed: number) => void;
  disabled?: boolean;
}

export const VELOCITY_CURVES: Record<string, VelocityCurve> = {
  Montage: {
    name: "Montage",
    points: [0.25, 0.1, 0.25, 1.0],
    svgPath: "M 0 40 C 15 40, 20 0, 40 0 C 60 0, 65 40, 80 40",
    label: "⚡ Montage (Fast-Slow-Fast)"
  },
  Hero: {
    name: "Hero",
    points: [0.4, 0.0, 0.2, 1.0],
    svgPath: "M 0 40 C 30 40, 10 0, 50 0 L 80 0",
    label: "🎬 Hero Entry (Cinematic)"
  },
  Bullet: {
    name: "Bullet",
    points: [0.1, 0.9, 0.9, 0.1],
    svgPath: "M 0 40 L 20 40 C 30 40, 30 0, 40 0 L 80 0",
    label: "💥 Bullet Time (Action Hit)"
  },
  JumpCut: {
    name: "JumpCut",
    points: [0.0, 0.0, 1.0, 1.0],
    svgPath: "M 0 40 L 40 40 L 40 0 L 80 0",
    label: "✂️ Jump Cut Drop"
  }
};

const SpeedSelector: React.FC<SpeedSelectorProps> = ({
  speed,
  onSpeedChange,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({
    x: 0, y: 0, width: 0, height: 0, buttonY: 0, buttonHeight: 0, buttonCenterY: 0, arrowTop: 0,
  });
  const buttonRef = useRef<View>(null);
  const popupRef = useRef<View>(null);

  const constantOptions: SpeedMultiplier[] = [0.5, 1, 2, 3, 5];

  // SAFE GUARD: Incoming speed ko currentSelection object mein map kiya taaki niche ka UI na tute
  const currentSelection: SpeedSelection = {
    type: 'constant',
    value: (speed as SpeedMultiplier) || 1
  };

  const handleOpenModal = () => {
    if (disabled) return;
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
        const spacing = screenWidth * 0.02;
        const estimatedPopupWidth = screenWidth * 0.55; 
        let popupLeft = pageX + width + spacing;

        if (popupLeft + estimatedPopupWidth > screenWidth) {
          popupLeft = screenWidth - estimatedPopupWidth - 10;
        }

        const buttonCenterY = pageY + height / 2;
        let popupTop = buttonCenterY - 180; 

        const safeAreaMargin = screenHeight * 0.015;
        popupTop = Math.max(safeAreaMargin, Math.min(popupTop, screenHeight - 380));

        setButtonLayout({
          x: popupLeft,
          y: popupTop,
          buttonY: pageY,
          buttonHeight: height,
          buttonCenterY,
          width,
          height,
          arrowTop: buttonCenterY - popupTop,
        });
        setModalVisible(true);
      });
    }
  };

  const handleSelectConstant = (val: SpeedMultiplier) => {
    onSpeedChange(val); // Directly calling CameraScreen's state handler
    setModalVisible(false);
  };

  const handleSelectCurve = (curveKey: string) => {
    // Parent simple numbers accept karta h, isliye safe custom numeric multiplier trigger kar rahe hain
    onSpeedChange(2); 
    setModalVisible(false);
  };

  const renderActiveLabel = () => {
    if (!currentSelection || currentSelection.type === 'curve') {
      return `${speed || 1}x`;
    }
    return `${currentSelection.value}x`;
  };

  return (
    <>
      <View ref={buttonRef} collapsable={false}>
        <TouchableOpacity
          style={[cameraStyles.speedSelectorButton, disabled && cameraStyles.disabledIconButton, { minWidth: 65 }]}
          onPress={handleOpenModal}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={[cameraStyles.speedSelectorText, disabled && cameraStyles.disabledIconText, { fontSize: 12 }]}>
            {renderActiveLabel()}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={cameraStyles.speedModalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View
            ref={popupRef}
            style={[
              cameraStyles.speedModalContent,
              {
                left: buttonLayout.x,
                top: buttonLayout.y,
                width: Dimensions.get("window").width * 0.58,
                maxHeight: 360,
                padding: 12,
              },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              
              {/* 🛑 Section 1: Constant Speed Matrices */}
              <Text style={{ color: '#aaa', fontSize: 11, fontWeight: 'bold', marginBottom: 8 }}>
                CONSTANT SPEED
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {constantOptions.map((option) => {
                  const isActive = speed === option;
                  return (
                    <TouchableOpacity
                      key={option}
                      style={[
                        cameraStyles.speedModalOption,
                        isActive && cameraStyles.speedModalOptionActive,
                        { minWidth: 45, paddingVertical: 6, alignItems: 'center', justifyContent: 'center' }
                      ]}
                      onPress={() => handleSelectConstant(option)}
                    >
                      <Text style={[cameraStyles.speedModalOptionText, isActive && cameraStyles.speedModalOptionTextActive]}>
                        {option}x
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* 📈 Section 2: Real-time Velocity Curves */}
              <Text style={{ color: '#aaa', fontSize: 11, fontWeight: 'bold', marginBottom: 8 }}>
                VELOCITY CURVES (INSTAGRAM EDIT)
              </Text>
              <View style={{ gap: 8 }}>
                {Object.keys(VELOCITY_CURVES).map((key) => {
                  const curve = VELOCITY_CURVES[key];
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[
                        cameraStyles.speedModalOption,
                        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 8 }
                      ]}
                      onPress={() => handleSelectCurve(key)}
                    >
                      <Text style={[cameraStyles.speedModalOptionText, { fontSize: 12 }]}>
                        {curve.name}
                      </Text>
                      
                      {/* Live Mini Vector Graph Matrix Preview */}
                      <View style={{ width: 45, height: 22, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                        <Svg width="100%" height="100%" viewBox="0 0 80 40">
                          <Path
                            d={curve.svgPath}
                            fill="none"
                            stroke="#ff007f"
                            strokeWidth="3"
                          />
                        </Svg>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default SpeedSelector;