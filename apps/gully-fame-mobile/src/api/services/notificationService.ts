import apiClient from '../axios';
import { ApiResponse } from '../types';
import API_ENDPOINTS, { replaceParams } from '../endpoints';

// ==================== Type Definitions ====================

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  status: 'read' | 'unRead';
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface NotificationListResponse {
  notification: Notification[];
  total_notification: number;
  unrad_count: number;
  time: string;
  page: number;
  limit: number;
}

export interface SendNotificationRequest {
  userId: string;
  message: string;
  title: string;
}

export interface SendNotificationResponse {
  message?: string;
  [key: string]: any;
}

export interface UpdateNotificationStatusRequest {
  notification_id: string;
  status: 'read' | 'unRead';
}

export interface UpdateNotificationStatusResponse {
  message?: string;
  [key: string]: any;
}

// ==================== API Functions ====================

/**
 * Get notifications for the current user with pagination
 */
export async function getNotifications(
  time: number = 1,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<NotificationListResponse>> {
  try {
    console.log('[notificationService] GET Notifications', { time, page, limit });
    
    const response = await apiClient.get<any>(API_ENDPOINTS.NOTIFICATION.GET_ALL, {
      params: {
        time: time,
        page: page,
        limit: limit,
      },
    });
    const responseData = response.data as any;

    console.log('[notificationService] GET Notifications - Raw response:', JSON.stringify(responseData, null, 2));

    // Handle different response structures
    if (responseData.code === 1) {
      // Standard structure: { code: 1, data: { notification: [...], ... } }
      let notificationData = responseData.data;
      
      // If data is directly the notification object
      if (notificationData && (notificationData.notification || Array.isArray(notificationData))) {
        const notificationList: NotificationListResponse = {
          notification: notificationData.notification || (Array.isArray(notificationData) ? notificationData : []),
          total_notification: notificationData.total_notification || 0,
          unrad_count: notificationData.unrad_count || notificationData.unread_count || 0,
          time: notificationData.time || time.toString(),
          page: notificationData.page || page,
          limit: notificationData.limit || limit,
        };

        console.log('[notificationService] GET Notifications - Success:', notificationList.notification.length, 'notifications');
        return {
          success: true,
          data: notificationList,
          message: responseData.message || 'Notifications fetched successfully',
        };
      }
    }

    console.error('[notificationService] GET Notifications - Unexpected response structure:', responseData);

    return {
      success: false,
      message: responseData.message || 'Failed to fetch notifications',
      error: 'API returned unsuccessful response',
      data: {
        notification: [],
        total_notification: 0,
        unrad_count: 0,
        time: time.toString(),
        page: page,
        limit: limit,
      },
    };
  } catch (error: any) {
    console.error('[notificationService] GET Notifications error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: {
        notification: [],
        total_notification: 0,
        unrad_count: 0,
        time: time.toString(),
        page: page,
        limit: limit,
      },
    };
  }
}

/**
 * Send a notification (Admin only)
 */
export async function sendNotification(
  userId: string,
  title: string,
  message: string
): Promise<ApiResponse<SendNotificationResponse>> {
  try {
    console.log('[notificationService] POST Send Notification', { userId, title, message });
    
    const requestBody: SendNotificationRequest = {
      userId: userId,
      title: title,
      message: message,
    };

    const response = await apiClient.post<any>('admin/notification', requestBody);
    const responseData = response.data as any;

    if (responseData.code === 1) {
      console.log('[notificationService] POST Send Notification - Success');
      return {
        success: true,
        data: responseData.data || {},
        message: responseData.message || 'Notification sent successfully',
      };
    }

    return {
      success: false,
      message: responseData.message || 'Failed to send notification',
      error: 'API returned unsuccessful response',
      data: undefined,
    };
  } catch (error: any) {
    console.error('[notificationService] POST Send Notification error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: undefined,
    };
  }
}

/**
 * Update notification status (read/unRead)
 */
export async function updateNotificationStatus(
  notificationId: string,
  status: 'read' | 'unRead'
): Promise<ApiResponse<UpdateNotificationStatusResponse>> {
  try {
    console.log('[notificationService] PUT Update Notification Status', { notificationId, status });
    
    const requestBody: UpdateNotificationStatusRequest = {
      notification_id: notificationId,
      status: status,
    };

    const endpoint = replaceParams(API_ENDPOINTS.NOTIFICATION.MARK_READ, { id: notificationId });
    const response = await apiClient.put<any>(endpoint, requestBody);
    const responseData = response.data as any;

    if (responseData.code === 1) {
      console.log('[notificationService] PUT Update Notification Status - Success');
      return {
        success: true,
        data: responseData.data || {},
        message: responseData.message || 'Notification status updated successfully',
      };
    }

    return {
      success: false,
      message: responseData.message || 'Failed to update notification status',
      error: 'API returned unsuccessful response',
      data: undefined,
    };
  } catch (error: any) {
    console.error('[notificationService] PUT Update Notification Status error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: undefined,
    };
  }
}

// ==================== Service Export ====================

export const notificationService = {
  getNotifications,
  sendNotification,
  updateNotificationStatus,
};

