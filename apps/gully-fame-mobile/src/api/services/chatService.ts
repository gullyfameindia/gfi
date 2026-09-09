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


const getMockChatList = (): ChatListResponse => {
  console.warn("[chatService] Mock data removed - API error will be shown to user");
  return { chatlist: [] };
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

    
    if (typeof response.data === "string") {
      console.error("[chatService] Received HTML instead of JSON");
      return {
        success: false,
        message: "Server returned invalid response",
        error: "Invalid response format",
        data: { chatlist: [] },
      };
    }

    let responseData = response.data;

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

    
    let chatlistData: any = null;

    
    if (responseData && responseData.code === 1) {
      console.log("[chatService] Response code is 1, parsing data...");

      
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
        
        else if (Array.isArray(responseData.data)) {
          console.log("[chatService] Found array in responseData.data");
          chatlistData = responseData.data;
        }
        
        else if (
          typeof responseData.data === "object" &&
          responseData.data.chatlist
        ) {
          console.log("[chatService] Found chatlist in nested data object");
          chatlistData = responseData.data.chatlist;
        }
      }
      
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
    console.error("[chatService] GET Chat List error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to fetch chat list",
      error: error.message,
      data: { chatlist: [] },
    };
  }
}




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
  console.warn("[chatService] Mock data removed - API error will be shown to user");
  return {
    messages: [],
    totalMessageCount: 0,
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

    
    let responseData = response.data;

    
    if (typeof responseData === "string") {
      console.error("[chatService] Received HTML instead of JSON");
      return {
        success: false,
        message: "Server returned invalid response",
        error: "Invalid response format",
        data: {
          messages: [],
          totalMessageCount: 0,
          page: page,
          limit: limit,
        },
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
    return {
      success: false,
      message: error.message || "Failed to fetch chat details",
      error: error.message,
      data: {
        messages: [],
        totalMessageCount: 0,
        page: page,
        limit: limit,
      },
    };
  }
}



export async function deleteMessage(
  messageId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    console.log("[chatService] DELETE Message", { messageId });

    const response = await apiClient.delete<any>(
      API_ENDPOINTS.CHAT.DELETE_MESSAGE.replace(":id", messageId)
    );
    const responseData = response.data as any;

    if (responseData.code === 1) {
      console.log("[chatService] DELETE Message - Success");
      return {
        success: true,
        data: { success: true },
        message: responseData.message || "Message deleted successfully",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to delete message",
      error: "API returned unsuccessful response",
      data: { success: false },
    };
  } catch (error: any) {
    console.error("[chatService] DELETE Message error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to delete message",
      error: error.message,
      data: { success: false },
    };
  }
}



export async function markConversationRead(
  conversationId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    console.log("[chatService] POST Mark Conversation Read", { conversationId });

    const response = await apiClient.post<any>(
      API_ENDPOINTS.CHAT.MARK_READ.replace(":id", conversationId),
      {}
    );
    const responseData = response.data as any;

    if (responseData.code === 1) {
      console.log("[chatService] POST Mark Conversation Read - Success");
      return {
        success: true,
        data: { success: true },
        message: responseData.message || "Conversation marked as read",
      };
    }

    return {
      success: false,
      message: responseData.message || "Failed to mark as read",
      error: "API returned unsuccessful response",
      data: { success: false },
    };
  } catch (error: any) {
    console.error("[chatService] Mark read error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to mark as read",
      error: error.message,
      data: { success: false },
    };
  }
}



export const chatService = {
  getChatList,
  sendChat,
  getChatDetails,
  deleteMessage,
  markConversationRead,
};
