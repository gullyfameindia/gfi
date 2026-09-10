// Created by Kiro
// Error Boundary - Catch errors and display fallback UI

import React, { ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component - Catches errors in child components
 * Usage:
 * <ErrorBoundary onError={(error, info) => console.log(error, info)}>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<Props, State> {
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    // Update state
    this.setState({
      error,
      errorInfo,
    });

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to error tracking service (e.g., Sentry, Firebase)
    this.logErrorToService(error, errorInfo);
  }

  /**
   * Log error to external service
   * @param error - Error object
   * @param errorInfo - Error info
   */
  private logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    try {
      // Example: Send to error tracking service
      // Sentry.captureException(error, { contexts: { react: errorInfo } });
      // Firebase.crashlytics().recordError(error);

      console.log('Error logged to service:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Failed to log error to service:', err);
    }
  };

  /**
   * Reset error boundary
   */
  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            {/* Error Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="alert-circle" size={64} color="#d32f2f" />
            </View>

            {/* Error Title */}
            <Text style={styles.title}>Oops! Something went wrong</Text>

            {/* Error Message */}
            <Text style={styles.message}>
              We encountered an unexpected error. Please try again or contact support if the problem persists.
            </Text>

            {/* Error Details (Development only) */}
            {__DEV__ && this.state.error && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Error Details:</Text>

                {/* Error Message */}
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Message:</Text>
                  <Text style={styles.detailValue}>{this.state.error.message}</Text>
                </View>

                {/* Error Stack */}
                {this.state.error.stack && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Stack:</Text>
                    <Text style={styles.detailValue}>{this.state.error.stack}</Text>
                  </View>
                )}

                {/* Component Stack */}
                {this.state.errorInfo?.componentStack && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Component Stack:</Text>
                    <Text style={styles.detailValue}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={this.resetError}
              >
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.buttonText}>Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.homeButton]}
                onPress={() => {
                  this.resetError();
                  // Navigate to home screen
                  // navigation.navigate('Home');
                }}
              >
                <Ionicons name="home" size={20} color="#007AFF" />
                <Text style={[styles.buttonText, styles.homeButtonText]}>Go Home</Text>
              </TouchableOpacity>
            </View>

            {/* Support Info */}
            <View style={styles.supportContainer}>
              <Text style={styles.supportText}>
                If this problem continues, please contact our support team.
              </Text>
              <TouchableOpacity style={styles.supportLink}>
                <Ionicons name="mail" size={16} color="#007AFF" />
                <Text style={styles.supportLinkText}>support@gullyfame.com</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  resetButton: {
    backgroundColor: '#d32f2f',
  },
  homeButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  homeButtonText: {
    color: '#007AFF',
  },
  supportContainer: {
    alignItems: 'center',
    gap: 12,
  },
  supportText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  supportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  supportLinkText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default ErrorBoundary;
