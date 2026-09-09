import apiClient from '../axios';
import { ApiResponse } from '../types';
import API_ENDPOINTS from '../endpoints';

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
  notification_id?: string;
  status?: 'read' | 'unRead';
}

export interface UpdateNotificationStatusResponse {
  message?: string;
  [key: string]: any;
}

export async function getNotifications(
  time: number = 1,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<NotificationListResponse>> {
  try {
    let response: any;
    try {
      response = await apiClient.get<any>('notification/notification', {
        params: { time, page, limit },
      });
    } catch {
      response = await apiClient.get<any>('notifications', {
        params: { time, page, limit },
      });
    }

    const responseData = response.data as any;

    if (responseData.code === 1 || responseData.success) {
      const notificationData = responseData.data;

      if (notificationData && (notificationData.notification || Array.isArray(notificationData))) {
        const notificationList: NotificationListResponse = {
          notification: notificationData.notification || (Array.isArray(notificationData) ? notificationData : []),
          total_notification: notificationData.total_notification || 0,
          unrad_count: notificationData.unrad_count || notificationData.unread_count || 0,
          time: notificationData.time || time.toString(),
          page: notificationData.page || page,
          limit: notificationData.limit || limit,
        };

        return {
          success: true,
          data: notificationList,
          message: responseData.message || 'Notifications fetched successfully',
        };
      }
    }

    return {
      success: false,
      message: responseData.message || 'Failed to fetch notifications',
      error: 'API returned unsuccessful response',
      data: {
        notification: [],
        total_notification: 0,
        unrad_count: 0,
        time: time.toString(),
        page,
        limit,
      },
    };
  } catch (error: any) {
    console.error('[notificationService] GET notifications error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: {
        notification: [],
        total_notification: 0,
        unrad_count: 0,
        time: time.toString(),
        page,
        limit,
      },
    };
  }
}

export async function sendNotification(
  userId: string,
  title: string,
  message: string
): Promise<ApiResponse<SendNotificationResponse>> {
  try {
    const requestBody: SendNotificationRequest = { userId, title, message };
    const response = await apiClient.post<any>('admin/notification', requestBody);
    const responseData = response.data as any;

    if (responseData.code === 1 || responseData.success) {
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

export async function updateNotificationStatus(
  notificationId: string,
  status: 'read' | 'unRead' = 'read'
): Promise<ApiResponse<UpdateNotificationStatusResponse>> {
  try {
    const requestBody: UpdateNotificationStatusRequest = {
      notification_id: notificationId,
      status,
    };

    let response: any;
    try {
      response = await apiClient.put<any>(`notification/${notificationId}/read`, requestBody);
    } catch {
      response = await apiClient.put<any>(`notifications/${notificationId}/read`, requestBody);
    }

    const responseData = response.data as any;

    if (responseData.code === 1 || responseData.success) {
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
    console.error('[notificationService] PUT notification read error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: undefined,
    };
  }
}

export async function markAllNotificationsAsRead(): Promise<ApiResponse<any>> {
  try {
    let response: any;
    try {
      response = await apiClient.put<any>('notification/read-all', {});
    } catch {
      response = await apiClient.put<any>('notifications/read-all', {});
    }

    const responseData = response.data as any;

    if (responseData.code === 1 || responseData.success) {
      return {
        success: true,
        data: responseData.data || {},
        message: responseData.message || 'All notifications marked as read',
      };
    }

    return {
      success: false,
      message: responseData.message || 'Failed to mark all as read',
      error: 'API returned unsuccessful response',
    };
  } catch (error: any) {
    console.error('[notificationService] PUT markAllNotificationsAsRead error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
    };
  }
}

export const notificationService = {
  getNotifications,
  sendNotification,
  updateNotificationStatus,
  markAllNotificationsAsRead,
};

export default notificationService;
