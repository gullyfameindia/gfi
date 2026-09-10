// apps/gully-fame-mobile/src/components/ui/ErrorBoundary.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    // Sentry mein log karo (baad mein integrate karenge)
    console.error('App Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Kuch galat ho gaya 😕</Text>
          <Text style={{ color: '#666', marginBottom: 24, textAlign: 'center' }}>
            App mein koi error aaya. Please retry karein.
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false })}
            style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Dobara Try Karo</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}