


import AsyncStorage from '@react-native-async-storage/async-storage';






const encrypt = (text: string): string => {
  return Buffer.from(text).toString('base64');
};






const decrypt = (encryptedText: string): string => {
  return Buffer.from(encryptedText, 'base64').toString('utf-8');
};








export const saveItem = async (
  key: string,
  value: any,
  shouldEncrypt: boolean = false
): Promise<void> => {
  try {
    let stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    if (shouldEncrypt) {
      stringValue = encrypt(stringValue);
    }

    await AsyncStorage.setItem(key, stringValue);
  } catch (error) {
    console.error(`Error saving item ${key}:`, error);
    throw error;
  }
};







export const getItem = async (
  key: string,
  isEncrypted: boolean = false
): Promise<any> => {
  try {
    let value = await AsyncStorage.getItem(key);

    if (!value) return null;

    if (isEncrypted) {
      value = decrypt(value);
    }

    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    throw error;
  }
};






export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
    throw error;
  }
};





export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};





export const getAllKeys = async (): Promise<readonly string[]> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    throw error;
  }
};






export const getMultipleItems = async (keys: string[]): Promise<Record<string, any>> => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    const result: Record<string, any> = {};

    values.forEach(([key, value]) => {
      if (value) {
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value;
        }
      }
    });

    return result;
  } catch (error) {
    console.error('Error getting multiple items:', error);
    throw error;
  }
};






export const saveMultipleItems = async (items: Record<string, any>): Promise<void> => {
  try {
    const pairs = Object.entries(items).map(([key, value]) => [
      key,
      typeof value === 'string' ? value : JSON.stringify(value),
    ]);

    await AsyncStorage.multiSet(pairs as [string, string][]);
  } catch (error) {
    console.error('Error saving multiple items:', error);
    throw error;
  }
};






export const removeMultipleItems = async (keys: string[]): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error removing multiple items:', error);
    throw error;
  }
};






export const hasItem = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error(`Error checking item ${key}:`, error);
    return false;
  }
};





export const getStorageSize = async (): Promise<number> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const values = await AsyncStorage.multiGet(keys);

    let totalSize = 0;
    values.forEach(([, value]) => {
      if (value) {
        totalSize += value.length;
      }
    });

    return totalSize;
  } catch (error) {
    console.error('Error getting storage size:', error);
    return 0;
  }
};






export const saveUserSession = async (userData: any): Promise<void> => {
  try {
    await saveMultipleItems({
      authToken: userData.token,
      isLoggedIn: true,
      userRole: userData.role,
      userEmail: userData.email,
      userFirstName: userData.firstName,
      userLastName: userData.lastName,
      userMobile: userData.mobile,
      userId: userData.id,
      profileCompleted: userData.profileCompleted || false,
      accountCreatedVia: userData.accountCreatedVia || 'email',
    });
  } catch (error) {
    console.error('Error saving user session:', error);
    throw error;
  }
};





export const getUserSession = async (): Promise<any> => {
  try {
    const keys = [
      'authToken',
      'isLoggedIn',
      'userRole',
      'userEmail',
      'userFirstName',
      'userLastName',
      'userMobile',
      'userId',
      'profileCompleted',
      'accountCreatedVia',
    ];

    return await getMultipleItems(keys);
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
};





export const clearUserSession = async (): Promise<void> => {
  try {
    const keys = [
      'authToken',
      'isLoggedIn',
      'userRole',
      'userEmail',
      'userFirstName',
      'userLastName',
      'userMobile',
      'userId',
      'profileCompleted',
      'accountCreatedVia',
    ];

    await removeMultipleItems(keys);
  } catch (error) {
    console.error('Error clearing user session:', error);
    throw error;
  }
};






export const savePreferences = async (preferences: Record<string, any>): Promise<void> => {
  try {
    await saveItem('appPreferences', preferences);
  } catch (error) {
    console.error('Error saving preferences:', error);
    throw error;
  }
};





export const getPreferences = async (): Promise<Record<string, any>> => {
  try {
    const prefs = await getItem('appPreferences');
    return prefs || {};
  } catch (error) {
    console.error('Error getting preferences:', error);
    return {};
  }
};







export const updatePreference = async (key: string, value: any): Promise<void> => {
  try {
    const prefs = await getPreferences();
    prefs[key] = value;
    await savePreferences(prefs);
  } catch (error) {
    console.error('Error updating preference:', error);
    throw error;
  }
};
