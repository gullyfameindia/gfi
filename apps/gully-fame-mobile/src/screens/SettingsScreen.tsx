// Created by Kiro
// Settings Screen - Account settings, notifications, privacy, and app info

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SettingsScreen({ navigation }: any) {
  // Notification settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Privacy settings
  const [profilePrivate, setProfilePrivate] = useState(false);
  const [showActivity, setShowActivity] = useState(true);

  // Handle notification toggle
  const handleNotificationToggle = (type: string, value: boolean) => {
    switch (type) {
      case 'push':
        setPushNotifications(value);
        break;
      case 'email':
        setEmailNotifications(value);
        break;
      case 'sms':
        setSmsNotifications(value);
        break;
    }
  };

  // Handle privacy toggle
  const handlePrivacyToggle = (type: string, value: boolean) => {
    switch (type) {
      case 'private':
        setProfilePrivate(value);
        break;
      case 'activity':
        setShowActivity(value);
        break;
    }
  };

  // Handle change password
  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Redirect to change password screen', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => navigation.navigate('ChangePassword') },
    ]);
  };

  // Handle clear cache
  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear app cache?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="person" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Edit Profile</Text>
                <Text style={styles.settingDesc}>Update your profile info</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangePassword}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <Text style={styles.settingDesc}>Update your password</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDesc}>Receive push alerts</Text>
              </View>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={(value) =>
                handleNotificationToggle('push', value)
              }
              trackColor={{ false: '#ccc', true: '#81C784' }}
              thumbColor={pushNotifications ? '#007AFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Email Notifications</Text>
                <Text style={styles.settingDesc}>Receive email updates</Text>
              </View>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={(value) =>
                handleNotificationToggle('email', value)
              }
              trackColor={{ false: '#ccc', true: '#81C784' }}
              thumbColor={emailNotifications ? '#007AFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="call" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>SMS Notifications</Text>
                <Text style={styles.settingDesc}>Receive SMS alerts</Text>
              </View>
            </View>
            <Switch
              value={smsNotifications}
              onValueChange={(value) =>
                handleNotificationToggle('sms', value)
              }
              trackColor={{ false: '#ccc', true: '#81C784' }}
              thumbColor={smsNotifications ? '#007AFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="eye-off" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Private Profile</Text>
                <Text style={styles.settingDesc}>Hide profile from others</Text>
              </View>
            </View>
            <Switch
              value={profilePrivate}
              onValueChange={(value) =>
                handlePrivacyToggle('private', value)
              }
              trackColor={{ false: '#ccc', true: '#81C784' }}
              thumbColor={profilePrivate ? '#007AFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="trending-up" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Show Activity</Text>
                <Text style={styles.settingDesc}>Show your activity status</Text>
              </View>
            </View>
            <Switch
              value={showActivity}
              onValueChange={(value) =>
                handlePrivacyToggle('activity', value)
              }
              trackColor={{ false: '#ccc', true: '#81C784' }}
              thumbColor={showActivity ? '#007AFF' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="document-text" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
                <Text style={styles.settingDesc}>Read our privacy policy</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="document" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Terms & Conditions</Text>
                <Text style={styles.settingDesc}>Read our terms</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleClearCache}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="trash" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Clear Cache</Text>
                <Text style={styles.settingDesc}>Free up storage space</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="information-circle" size={24} color="#007AFF" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>About App</Text>
                <Text style={styles.settingDesc}>Version 1.0.0</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>

          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="trash-bin" size={24} color="#d32f2f" />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, styles.dangerText]}>
                  Delete Account
                </Text>
                <Text style={styles.settingDesc}>
                  Permanently delete your account
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#d32f2f" />
          </TouchableOpacity>
        </View>

        {/* Footer Spacing */}
        <View style={styles.footerSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 12,
    color: '#999',
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#d32f2f',
  },
  footerSpacing: {
    height: 20,
  },
});
