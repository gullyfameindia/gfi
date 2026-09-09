import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}












export class CameraErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('🚨 CameraErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('📸 Camera Component Error:', error);
    console.error('📸 Error Info:', errorInfo.componentStack);
  }

  handleReset = () => {
    console.log('🔄 Resetting camera error boundary');
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>📸</Text>
            <Text style={styles.title}>Camera Error</Text>
            <Text style={styles.message}>
              {this.state.error?.message || 'An unexpected camera error occurred.'}
            </Text>
            <Text style={styles.note}>
              This might be a hardware issue. Try switching cameras, restarting the app, or checking camera permissions.
            </Text>
            
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={this.handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.retryButton, styles.backButton]}
              onPress={() => this.props.onReset?.()}
              activeOpacity={0.8}
            >
              <Text style={[styles.retryText, styles.backText]}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  note: {
    fontSize: 13,
    color: '#B0B0B0',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  retryButton: {
    backgroundColor: '#FF5F5F',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 26,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backText: {
    color: '#E0E0E0',
  },
});

export default CameraErrorBoundary;
