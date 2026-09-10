/**
 * Error Fallback Component
 * Displays user-friendly error states with retry and fallback options
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { AppError } from "../utils/errorHandler";

interface ErrorFallbackProps {
  error: AppError;
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
  onViewMockData?: () => void;
  loading?: boolean;
}

export default function ErrorFallback({
  error,
  title,
  subtitle,
  onRetry,
  onViewMockData,
  loading = false,
}: ErrorFallbackProps) {
  const getIcon = () => {
    switch (error.type) {
      case "network":
        return (
          <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
            <Path
              d="M1 9L2.8 9.63C3.6 9.35 4.3 9 5 9C5.7 9 6.4 9.35 7.2 9.63L9 9M5 13C5 11.3 3.6 10 2 10C0.4 10 -1 11.3 -1 13M9 21H1C0.4 21 0 20.6 0 20V11C0 10.4 0.4 10 1 10H9C9.6 10 10 10.4 10 11V20C10 20.6 9.6 21 9 21ZM19 2C17.3 2 16 3.3 16 5C16 6.7 17.3 8 19 8C20.7 8 22 6.7 22 5C22 3.3 20.7 2 19 2ZM19 10C16.2 10 14 12.2 14 15V22H24V15C24 12.2 21.8 10 19 10Z"
              stroke="#EC9A15"
              strokeWidth="1.5"
            />
          </Svg>
        );
      case "api":
        return (
          <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke="#FF5252" strokeWidth="2" />
            <Path d="M12 7V13M12 17H12.01" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );
      case "timeout":
        return (
          <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke="#FFA726" strokeWidth="2" />
            <Path d="M12 6V12L16 16" stroke="#FFA726" strokeWidth="2" strokeLinecap="round" />
          </Svg>
        );
      case "unauthorized":
        return (
          <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11ZM8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11ZM12 17.5C13.66 17.5 15.08 16.84 15.8 15.8C15.92 15.6 15.77 15.35 15.54 15.35H8.46C8.23 15.35 8.08 15.6 8.2 15.8C8.92 16.84 10.34 17.5 12 17.5Z"
              fill="#E91E63"
            />
          </Svg>
        );
      default:
        return (
          <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
              fill="#9575CD"
            />
          </Svg>
        );
    }
  };

  const getColorByType = () => {
    switch (error.type) {
      case "network":
        return "#EC9A15";
      case "api":
        return "#FF5252";
      case "timeout":
        return "#FFA726";
      case "unauthorized":
        return "#E91E63";
      default:
        return "#9575CD";
    }
  };

  return (
    <View style={[styles.container, { borderTopColor: getColorByType() }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>{getIcon()}</View>

        <Text style={styles.errorTitle}>
          {title || "Oops! Something went wrong"}
        </Text>

        <Text style={styles.errorMessage}>
          {subtitle || error.message}
        </Text>

        {error.shouldUseMockData && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💾 Showing cached/mock data instead of live data
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          {onRetry && error.canRetry && (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={onRetry}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.primaryButtonText}>🔄 Try Again</Text>
              )}
            </TouchableOpacity>
          )}

          {onViewMockData && error.shouldUseMockData && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onViewMockData}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>📋 View Cached Data</Text>
            </TouchableOpacity>
          )}
        </View>

        {error.type === "unauthorized" && (
          <Text style={styles.helpText}>
            Your session has expired. Please log in again.
          </Text>
        )}

        {error.type === "validation" && (
          <Text style={styles.helpText}>
            Please check the information and try again.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderTopWidth: 3,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: "rgba(236, 154, 21, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#EC9A15",
  },
  infoText: {
    fontSize: 12,
    color: "#EC9A15",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 40,
  },
  primaryButton: {
    backgroundColor: "#EC9A15",
  },
  primaryButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 12,
  },
  secondaryButton: {
    backgroundColor: "rgba(236, 154, 21, 0.2)",
    borderWidth: 1,
    borderColor: "#EC9A15",
  },
  secondaryButtonText: {
    color: "#EC9A15",
    fontWeight: "600",
    fontSize: 12,
  },
  helpText: {
    fontSize: 11,
    color: "#666",
    marginTop: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
});
