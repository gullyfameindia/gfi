import apiClient from "../axios";
import { ApiResponse } from "../types";
import API_ENDPOINTS from "../endpoints";
export interface ChatListItem {
  chatter_user_id: string;
  latest_message: string;
  last_message_time: string;
}

export interface ChatListResponse {
  chatlist: ChatListItem[];
}

export interface SendChatRequest {
  receiver_id: string;
  message: string;
}

export interface SendChatResponse {
  message?: string;
  [key: string]: any;
}

export interface ChatMessageAPIData {
  _id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  createdAt: string;
}

export interface ChatDetailsResponse {
  messages: ChatMessageAPIData[];
  totalMessageCount: number;
  page: number;
  limit: number;
}

// ==================== API Functions ====================

/**
 * Get chat list for the current user
 */
// Temporary mock data fallback
const getMockChatList = (): ChatListResponse => {
  console.warn("[chatService] Using temporary mock data - API not available");

  // Create some timestamps for realistic UI testing
  const now = new Date();
  const fiveMinsAgo = new Date(now.getTime() - 5 * 60000);
  const fiveYearsAgo = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
  return {
    chatlist: [
      {
        chatter_user_id: "mock_user_1", // This will map to isSent: false (received message)
        latest_message:
          "Hey! The API isn't ready yet, so here is a mock message.",
        last_message_time: fiveMinsAgo.toISOString(),
      },
      {
        chatter_user_id: "sender_id_11",
        latest_message: "Looks good, the UI is rendering correctly!",

        last_message_time: fiveYearsAgo.toISOString(),
      },
    ],
  };
};

export async function getChatList(): Promise<ApiResponse<ChatListResponse>> {
  try {
    console.log("[chatService] GET Chat List");
    console.log("Fails here");
    console.log("[chatService] Base URL:", apiClient.defaults.baseURL);
    console.log(
      "[chatService] Full URL will be:",
      `${apiClient.defaults.baseURL}/chat/chatlist`,
    );

    const response = await apiClient.get<any>(API_ENDPOINTS.CHAT.GET_CONVERSATIONS, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const contentType =
      response.headers?.["content-type"] ||
      response.headers?.["Content-Type"] ||
      "";
    console.log("[chatService] Response Content-Type:", contentType);

    let responseData: any;

    // If response is a string (HTML/text), use fallback
    if (typeof response.data === "string" || responseData.code !== 1) {
      console.warn(
        "[chatService] Received HTML or error, falling back to mock data",
      );
      return {
        success: true,
        data: getMockChatList(),
        message: "Using mock data",
      };
    }

    console.log("[chatService] GET Chat List - Full response object:", {
      status: response.status,
      statusText: response.statusText,
      contentType: contentType,
    });
    console.log(
      "[chatService] GET Chat List - Raw response.data:",
      JSON.stringify(responseData, null, 2),
    );
    console.log(
      "[chatService] GET Chat List - responseData type:",
      typeof responseData,
    );
    console.log(
      "[chatService] GET Chat List - responseData.code:",
      responseData?.code,
    );
    console.log(
      "[chatService] GET Chat List - responseData.data:",
      responseData?.data,
    );
    console.log(
      "[chatService] GET Chat List - responseData.data?.chatlist:",
      responseData?.data?.chatlist,
    );

    // Handle different response structures
    let chatlistData: any = null;

    // Check if response has code === 1
    if (responseData && responseData.code === 1) {
      console.log("[chatService] Response code is 1, parsing data...");

      // Standard structure: { code: 1, data: { chatlist: [...] } }
      if (responseData.data) {
        if (
          responseData.data.chatlist &&
          Array.isArray(responseData.data.chatlist)
        ) {
          console.log(
            "[chatService] Found chatlist in responseData.data.chatlist",
          );
          chatlistData = responseData.data.chatlist;
        }
        // Alternative: { code: 1, data: [...] } (direct array)
        else if (Array.isArray(responseData.data)) {
          console.log("[chatService] Found array in responseData.data");
          chatlistData = responseData.data;
        }
        // Check if data is an object with chatlist property
        else if (
          typeof responseData.data === "object" &&
          responseData.data.chatlist
        ) {
          console.log("[chatService] Found chatlist in nested data object");
          chatlistData = responseData.data.chatlist;
        }
      }
      // Alternative: { code: 1, chatlist: [...] } (chatlist at root)
      else if (responseData.chatlist && Array.isArray(responseData.chatlist)) {
        console.log("[chatService] Found chatlist at root level");
        chatlistData = responseData.chatlist;
      }
    } else {
      console.warn(
        "[chatService] Response code is not 1 or responseData is invalid:",
        {
          code: responseData?.code,
          hasData: !!responseData?.data,
        },
      );
    }

    if (chatlistData !== null && Array.isArray(chatlistData)) {
      const chatList: ChatListResponse = {
        chatlist: chatlistData,
      };

      console.log(
        "[chatService] GET Chat List - Success:",
        chatList.chatlist.length,
        "chats",
      );
      return {
        success: true,
        data: chatList,
        message: responseData.message || "Chat list fetched successfully",
      };
    }

    console.error(
      "[chatService] GET Chat List - Unexpected response structure",
    );
    console.error(
      "[chatService] Full responseData:",
      JSON.stringify(responseData, null, 2),
    );
    console.error("[chatService] chatlistData value:", chatlistData);
    console.error(
      "[chatService] chatlistData is array?",
      Array.isArray(chatlistData),
    );

    return {
      success: false,
      message:
        responseData?.message ||
        "Failed to fetch chat list - unexpected response format",
      error: "API returned unexpected response structure",
      data: {
        chatlist: [],
      },
    };
  } catch (error: any) {
    // Check if it's a network error (API not available)
    const isNetworkError =
      error.isNetworkError ||
      error.message?.includes("Network") ||
      error.message?.includes("ECONNREFUSED") ||
      !error.response;

    // Only log detailed errors if it's not a simple network error
    if (!isNetworkError) {
      console.error("[chatService] GET Chat List error:", error);
      console.error("[chatService] Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    } else {
      // For network errors, just log a simple warning
      console.warn(
        "[chatService] API server not available. Using temporary mock data.",
      );
    }

    // Use mock data as fallback if API fails
    const mockData = getMockChatList();
    return {
      success: true,
      data: mockData,
      message:
        "Using temporary data - API unavailable. Please check your server connection.",
    };
  }
}

/**
 * Send a chat message
 */
export async function sendChat(
  receiverId: string,
  message: string,
): Promise<ApiResponse<SendChatResponse>> {
  try {
    console.log("[chatService] POST Send Chat", { receiverId, message });

    const requestBody: SendChatRequest = {
      receiver_id: receiverId,
      message: message,
    };

    const response = await apiClient.post<any>(API_ENDPOINTS.CHAT.SEND_MESSAGE, requestBody);
    const responseData = response.data as any;

    if (responseData.code === 1) {
      console.log("[chatService] POST Send Chat - Success");
      return {
        success: true,
        data: responseData.data || {},
        message: responseData.message || "Message sent successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to send message",
      error: "API returned unsuccessful response",
      data: undefined,
    };
  } catch (error: any) {
    console.error("[chatService] POST Send Chat error:", error.message);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Network error occurred",
      error: error.message || "Network error",
      data: undefined,
    };
  }
}
const getMockChatDetails = (
  page: number,
  limit: number,
  chatUserId: string,
): ChatDetailsResponse => {
  console.warn("[chatService] Using temporary mock data - API not available");

  const now = new Date();
  const fiveMinsAgo = new Date(now.getTime() - 5 * 60000);

  return {
    messages: [
      {
        _id: "mock_msg_1",
        sender_id: "mock_user_1",
        receiver_id: chatUserId,
        message: "Hey! The API isn't ready yet, so here is a mock message.",

        createdAt: fiveMinsAgo.toISOString(),
      },
      {
        _id: "mock_msg_2",
        sender_id: chatUserId,
        receiver_id: "mock_user_1",
        message: "Looks good, the UI is rendering correctly!",
        createdAt: now.toISOString(),
      },
    ],
    totalMessageCount: 2,
    page: page,
    limit: limit,
  };
};

export async function getChatDetails(
  chatUserId: string,
  page: number = 1,
  limit: number = 10,
): Promise<ApiResponse<ChatDetailsResponse>> {
  try {
    console.log("[chatService] GET Chat Details", { chatUserId, page, limit });

    const response = await apiClient.get<any>(API_ENDPOINTS.CHAT.GET_MESSAGES.replace(":id", chatUserId), {
      params: {
        chat_user_id: chatUserId,
        page: page,
        limit: limit,
      },
    });

    // Explicitly assign responseData
    let responseData = response.data;

    // INTERCEPT: If response is HTML/text or doesn't have success code, use fallback
    if (typeof responseData === "string" || responseData.code !== 1) {
      console.warn(
        "[chatService] Received HTML or error, falling back to mock data",
      );
      return {
        success: true, // Set to true so UI renders it
        data: getMockChatDetails(page, limit, chatUserId),
        message: "Using mock data",
      };
    }

    if (responseData.code === 1 && responseData.data) {
      const chatDetails: ChatDetailsResponse = {
        messages: responseData.data.detail || [],
        totalMessageCount: responseData.data.detailcount || 0,
        page: responseData.data.page || page,
        limit: responseData.data.limit || limit,
      };

      console.log(
        "[chatService] GET Chat Details - Success:",
        chatDetails.messages.length,
        "messages",
      );
      return {
        success: true,
        data: chatDetails,
        message: responseData.message || "Chat details fetched successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to fetch chat details",
      error: "API returned unsuccessful response",
      data: {
        messages: [],
        totalMessageCount: 0,
        page: page,
        limit: limit,
      },
    };
  } catch (error: any) {
    console.error("[chatService] GET Chat Details error:", error.message);

    // Fall back to mock data even if network fails entirely
    return {
      success: true,
      data: getMockChatDetails(page, limit, chatUserId),
      message: "Network error, using mock data",
    };
  }
}

// ==================== Service Export ====================

export const chatService = {
  getChatList,
  sendChat,
  getChatDetails,
};
