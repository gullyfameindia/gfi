





import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorInfo {
  componentStack: string;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Error info:", errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    console.log("[ErrorBoundary] Resetting error state");
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      
      return (
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.content}
            style={styles.scrollContainer}
          >
            <View style={styles.errorIconContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
            </View>

            <Text style={styles.errorTitle}>Something Went Wrong</Text>

            <Text style={styles.errorMessage}>
              The video grid encountered an error and couldn't be displayed.
            </Text>

            {__DEV__ && this.state.error && (
              <>
                <View style={styles.errorBox}>
                  <Text style={styles.errorLabel}>Error:</Text>
                  <Text style={styles.errorText}>
                    {this.state.error.toString()}
                  </Text>
                </View>

                {this.state.errorInfo && (
                  <View style={styles.stackBox}>
                    <Text style={styles.errorLabel}>Stack:</Text>
                    <Text style={styles.stackText}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </View>
                )}
              </>
            )}

            <Text style={styles.helpText}>
              Try refreshing the page or contact support if the problem persists.
            </Text>
          </ScrollView>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={this.handleReset}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1410",
    justifyContent: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  errorIconContainer: {
    marginBottom: 20,
  },
  errorIcon: {
    fontSize: 64,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    color: "#cccccc",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  errorBox: {
    backgroundColor: "#2d2420",
    borderLeftWidth: 3,
    borderLeftColor: "#ff6b6b",
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
    width: "100%",
  },
  errorLabel: {
    color: "#ff6b6b",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  errorText: {
    color: "#cccccc",
    fontSize: 11,
    fontFamily: "Courier New",
  },
  stackBox: {
    backgroundColor: "#2d2420",
    borderLeftWidth: 3,
    borderLeftColor: "#EC9A15",
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
    width: "100%",
  },
  stackText: {
    color: "#999",
    fontSize: 9,
    fontFamily: "Courier New",
    lineHeight: 14,
  },
  helpText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 12,
  },
  retryButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: "#EC9A15",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonText: {
    color: "#1a1410",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ErrorBoundary;
