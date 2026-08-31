/**
 * Mock Data Controls Component
 * Development-only UI for toggling mock data settings
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import { mockDataLoader } from "../../utils/mockDataLoader";

/**
 * Development-only component for mock data configuration
 * Add to dev menu or hidden settings screen
 * 
 * Usage:
 * ```tsx
 * import MockDataControls from "@/components/dev/MockDataControls";
 * 
 * export default function DevSettings() {
 *   return (
 *     <ScrollView>
 *       <MockDataControls />
 *     </ScrollView>
 *   );
 * }
 * ```
 */
export default function MockDataControls() {
  const [config, setConfig] = useState(mockDataLoader.getConfig());
  const [delayInput, setDelayInput] = useState(String(config.mockResponseDelay));

  const updateConfig = (updates: any) => {
    mockDataLoader.setConfig(updates);
    setConfig(mockDataLoader.getConfig());
  };

  const handleSaveConfig = async () => {
    await mockDataLoader.saveConfig();
    Alert.alert("Success", "Mock data configuration saved");
  };

  const handleResetConfig = async () => {
    Alert.alert("Reset", "Are you sure you want to reset to defaults?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Reset",
        onPress: async () => {
          await mockDataLoader.resetConfig();
          setConfig(mockDataLoader.getConfig());
          Alert.alert("Success", "Configuration reset to defaults");
        },
      },
    ]);
  };

  const handlePrintStatus = () => {
    mockDataLoader.printStatus();
    Alert.alert("Success", "Status printed to console");
  };

  const handleLogMockData = () => {
    mockDataLoader.logMockDataAvailability();
    Alert.alert("Success", "Mock data availability logged to console");
  };

  const handleSetDelay = () => {
    const delay = parseInt(delayInput, 10);
    if (isNaN(delay) || delay < 0) {
      Alert.alert("Error", "Please enter a valid number (milliseconds)");
      return;
    }
    updateConfig({ mockResponseDelay: delay });
    Alert.alert("Success", `Mock response delay set to ${delay}ms`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧪 Mock Data Controls</Text>
        <Text style={styles.subtitle}>Development Only</Text>
      </View>

      {/* Status Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Current Mode:</Text>
          <Text style={styles.statusValue}>{mockDataLoader.getMode()}</Text>
        </View>
      </View>

      {/* Toggle Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Toggles</Text>

        {/* Enabled */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Mock Data Enabled</Text>
          <Switch
            value={config.enabled}
            onValueChange={(value) => updateConfig({ enabled: value })}
            trackColor={{ false: "#767577", true: "#81c784" }}
            thumbColor={config.enabled ? "#ec9a15" : "#f4f3f4"}
          />
        </View>

        {/* Force Mock */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Force Mock (Override API)</Text>
          <Switch
            value={config.forceMock}
            onValueChange={(value) => updateConfig({ forceMock: value })}
            trackColor={{ false: "#767577", true: "#81c784" }}
            thumbColor={config.forceMock ? "#ec9a15" : "#f4f3f4"}
          />
        </View>

        {/* Fallback */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Fallback to Mock on API Error</Text>
          <Switch
            value={config.fallbackEnabled}
            onValueChange={(value) => updateConfig({ fallbackEnabled: value })}
            trackColor={{ false: "#767577", true: "#81c784" }}
            thumbColor={config.fallbackEnabled ? "#ec9a15" : "#f4f3f4"}
          />
        </View>

        {/* Verbose Logging */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Verbose Logging</Text>
          <Switch
            value={config.verboseLogging}
            onValueChange={(value) => updateConfig({ verboseLogging: value })}
            trackColor={{ false: "#767577", true: "#81c784" }}
            thumbColor={config.verboseLogging ? "#ec9a15" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Response Delay Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mock Response Delay</Text>
        <View style={styles.delayRow}>
          <TextInput
            style={styles.delayInput}
            placeholder="Delay in milliseconds"
            value={delayInput}
            onChangeText={setDelayInput}
            keyboardType="number-pad"
            maxLength={5}
          />
          <TouchableOpacity style={styles.delayButton} onPress={handleSetDelay}>
            <Text style={styles.delayButtonText}>Set</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.delayHint}>
          Current: {config.mockResponseDelay}ms (for testing loading states)
        </Text>
      </View>

      {/* Quick Actions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={() => mockDataLoader.forceMockData()}
        >
          <Text style={styles.buttonText}>🔒 Force Mock Data Mode</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => mockDataLoader.allowAPI()}
        >
          <Text style={styles.buttonText}>🌐 Allow API (with Fallback)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => mockDataLoader.enableVerboseLogging()}
        >
          <Text style={styles.buttonText}>📝 Enable Verbose Logging</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => mockDataLoader.disableVerboseLogging()}
        >
          <Text style={styles.buttonText}>🔇 Disable Verbose Logging</Text>
        </TouchableOpacity>
      </View>

      {/* Utility Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utilities</Text>

        <TouchableOpacity
          style={[styles.button, styles.buttonInfo]}
          onPress={handlePrintStatus}
        >
          <Text style={styles.buttonText}>📊 Print Full Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonInfo]}
          onPress={handleLogMockData}
        >
          <Text style={styles.buttonText}>📋 Log Mock Data Available</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSuccess]}
          onPress={handleSaveConfig}
        >
          <Text style={styles.buttonText}>💾 Save Configuration</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={handleResetConfig}
        >
          <Text style={styles.buttonText}>🔄 Reset to Defaults</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          These controls are for development only and should not be exposed in production.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingVertical: 20,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#999",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ec9a15",
    marginBottom: 12,
  },
  statusBox: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#ec9a15",
  },
  statusLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  toggleLabel: {
    fontSize: 13,
    color: "#ffffff",
    flex: 1,
  },
  delayRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  delayInput: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#ffffff",
    fontSize: 13,
  },
  delayButton: {
    backgroundColor: "#ec9a15",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: "center",
  },
  delayButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 12,
  },
  delayHint: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  buttonPrimary: {
    backgroundColor: "#ec9a15",
  },
  buttonPrimaryText: {
    color: "#000",
  },
  buttonSecondary: {
    backgroundColor: "rgba(236, 154, 21, 0.2)",
    borderWidth: 1,
    borderColor: "#ec9a15",
  },
  buttonSecondaryText: {
    color: "#ec9a15",
  },
  buttonInfo: {
    backgroundColor: "rgba(30, 136, 229, 0.2)",
    borderWidth: 1,
    borderColor: "#1e88e5",
  },
  buttonInfoText: {
    color: "#1e88e5",
  },
  buttonSuccess: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderWidth: 1,
    borderColor: "#4caf50",
  },
  buttonSuccessText: {
    color: "#4caf50",
  },
  buttonDanger: {
    backgroundColor: "rgba(244, 67, 54, 0.2)",
    borderWidth: 1,
    borderColor: "#f44336",
  },
  buttonDangerText: {
    color: "#f44336",
  },
  footer: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  footerText: {
    fontSize: 11,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
  },
});
