





import { io, Socket } from "socket.io-client";
import { BASE_URL } from "../axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_STORAGE_KEY = "authToken";



const getSocketUrl = (): string => {
  if (!BASE_URL) return "https://gullyfame.com";
  
  
  
  try {
    const url = new URL(BASE_URL);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "https://gullyfame.com";
  }
};

const SOCKET_URL = getSocketUrl();

interface ChatSocketMessage {
  _id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  createdAt: string;
}

export interface SocketChatCallbacks {
  onMessageReceived?: (message: ChatSocketMessage) => void;
  onMessageDelivered?: (messageId: string) => void;
  onMessageDeleted?: (messageId: string) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: string) => void;
}

class SocketChatService {
  private socket: Socket | null = null;
  private callbacks: SocketChatCallbacks = {};
  private currentConversationId: string | null = null;

  



  async connect(conversationId: string, callbacks?: SocketChatCallbacks): Promise<void> {
    if (this.socket?.connected && this.currentConversationId === conversationId) {
      console.log("[socketChatService] Already connected to conversation:", conversationId);
      return;
    }

    try {
      console.log("[socketChatService] Connecting to websocket:", SOCKET_URL);

      
      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

      
      
      const socketUrl = `${SOCKET_URL}/chat`;
      this.socket = io(socketUrl, {
        path: "/socket.io/", 
        auth: {
          token: token || "",
          conversationId: conversationId,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        transports: ["websocket", "polling"], 
      });

      this.currentConversationId = conversationId;
      if (callbacks) {
        this.callbacks = callbacks;
      }

      
      this.setupListeners();

      console.log("[socketChatService] Socket connection initiated");
    } catch (error: any) {
      console.error("[socketChatService] Connection error:", error.message);
      this.callbacks.onError?.(error.message);
      throw error;
    }
  }

  


  private setupListeners(): void {
    if (!this.socket) return;

    
    this.socket.on("connect", () => {
      console.log("[socketChatService] Socket connected, ID:", this.socket?.id);
      this.callbacks.onConnected?.();
    });

    this.socket.on("disconnect", (reason: string) => {
      console.log("[socketChatService] Socket disconnected, reason:", reason);
      this.callbacks.onDisconnected?.();
    });

    this.socket.on("connect_error", (error: any) => {
      console.error("[socketChatService] Connection error:", error.message);
      this.callbacks.onError?.(error.message);
    });

    
    this.socket.on("message", (message: ChatSocketMessage) => {
      console.log("[socketChatService] Message received:", message._id, message.message);
      this.callbacks.onMessageReceived?.(message);
    });

    this.socket.on("message_delivered", (messageId: string) => {
      console.log("[socketChatService] Message delivered:", messageId);
      this.callbacks.onMessageDelivered?.(messageId);
    });

    this.socket.on("message_deleted", (messageId: string) => {
      console.log("[socketChatService] Message deleted:", messageId);
      this.callbacks.onMessageDeleted?.(messageId);
    });

    this.socket.on("error", (error: any) => {
      console.error("[socketChatService] Socket error:", error);
      this.callbacks.onError?.(error?.message || "Socket error occurred");
    });
  }

  



  async sendMessage(
    conversationId: string,
    receiverId: string,
    message: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (this.socket?.connected) {
        console.log("[socketChatService] Sending message via socket");
        return new Promise((resolve) => {
          this.socket?.emit(
            "send_message",
            { conversationId, receiverId, message },
            (response: any) => {
              if (response?.success) {
                console.log("[socketChatService] Message sent successfully:", response.messageId);
                resolve({ success: true, messageId: response.messageId });
              } else {
                console.error("[socketChatService] Send failed:", response?.error);
                resolve({ success: false, error: response?.error || "Send failed" });
              }
            }
          );
        });
      } else {
        console.warn("[socketChatService] Socket not connected, falling back to REST");
        
        return { success: false, error: "Socket not connected" };
      }
    } catch (error: any) {
      console.error("[socketChatService] Send error:", error.message);
      return { success: false, error: error.message };
    }
  }

  


  async deleteMessage(messageId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.socket?.connected) {
        console.log("[socketChatService] Deleting message via socket:", messageId);
        return new Promise((resolve) => {
          this.socket?.emit("delete_message", { messageId }, (response: any) => {
            if (response?.success) {
              console.log("[socketChatService] Message deleted");
              resolve({ success: true });
            } else {
              resolve({ success: false, error: response?.error || "Delete failed" });
            }
          });
        });
      } else {
        
        return { success: false, error: "Socket not connected" };
      }
    } catch (error: any) {
      console.error("[socketChatService] Delete error:", error.message);
      return { success: false, error: error.message };
    }
  }

  


  async markConversationRead(conversationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.socket?.connected) {
        console.log("[socketChatService] Marking conversation read via socket:", conversationId);
        return new Promise((resolve) => {
          this.socket?.emit("mark_read", { conversationId }, (response: any) => {
            if (response?.success) {
              console.log("[socketChatService] Conversation marked as read");
              resolve({ success: true });
            } else {
              resolve({ success: false, error: response?.error || "Mark read failed" });
            }
          });
        });
      } else {
        
        return { success: false, error: "Socket not connected" };
      }
    } catch (error: any) {
      console.error("[socketChatService] Mark read error:", error.message);
      return { success: false, error: error.message };
    }
  }

  


  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  



  disconnect(): void {
    if (this.socket?.connected) {
      console.log("[socketChatService] Disconnecting socket");
      this.socket.disconnect();
      this.socket = null;
      this.currentConversationId = null;
    }
  }

  


  async switchConversation(
    conversationId: string,
    callbacks?: SocketChatCallbacks
  ): Promise<void> {
    if (this.currentConversationId === conversationId && this.socket?.connected) {
      console.log("[socketChatService] Already connected to this conversation");
      return;
    }

    this.disconnect();
    await this.connect(conversationId, callbacks);
  }
}


export const socketChatService = new SocketChatService();
