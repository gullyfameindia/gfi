




import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  AccessibilityInfo,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
  visible?: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  duration = 3000,
  onDismiss,
  action,
  visible = true,
}) => {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (isVisible) {
      
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      
      if (duration > 0) {
        const timer = setTimeout(dismiss, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible]);

  const dismiss = () => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      onDismiss?.();
    });
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Ionicons name="checkmark-circle" size={20} color="#51cf66" />;
      case "error":
        return <Ionicons name="close-circle" size={20} color="#ff6b6b" />;
      case "warning":
        return <Ionicons name="warning" size={20} color="#fcc419" />;
      case "info":
      default:
        return <Ionicons name="information-circle" size={20} color="#EC9A15" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#1b5e20";
      case "error":
        return "#b71c1c";
      case "warning":
        return "#f57f17";
      case "info":
      default:
        return "#1a1410";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "#51cf66";
      case "error":
        return "#ff6b6b";
      case "warning":
        return "#fcc419";
      case "info":
      default:
        return "#EC9A15";
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      accessible={true}
      accessibilityLabel={`Toast: ${message}`}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: getBackgroundColor(),
          },
        ]}
      >
        {}
        <View style={styles.iconContainer}>{getIcon()}</View>

        {}
        <Text
          style={[
            styles.message,
            {
              color: getTextColor(),
            },
          ]}
          numberOfLines={2}
        >
          {message}
        </Text>

        {}
        {action && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              action.onPress();
              dismiss();
            }}
          >
            <Text
              style={[
                styles.actionText,
                {
                  color: getTextColor(),
                },
              ]}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        )}

        {}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={dismiss}
          accessibilityLabel="Dismiss toast"
        >
          <Ionicons name="close" size={18} color={getTextColor()} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#EC9A15",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
});

export default Toast;




let toastInstance: React.ReactNode = null;

export interface ToastManagerOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const ToastManager = {
  show: (options: ToastManagerOptions) => {
    console.log("[ToastManager] Showing toast:", options.message);
    
    
  },

  success: (message: string, duration?: number) => {
    ToastManager.show({ message, type: "success", duration });
  },

  error: (message: string, duration?: number) => {
    ToastManager.show({ message, type: "error", duration });
  },

  info: (message: string, duration?: number) => {
    ToastManager.show({ message, type: "info", duration });
  },

  warning: (message: string, duration?: number) => {
    ToastManager.show({ message, type: "warning", duration });
  },
};
