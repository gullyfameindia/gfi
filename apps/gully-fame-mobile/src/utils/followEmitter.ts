// Created by Kiro - Follow Update Emitter
// Global event emitter for real-time follow/unfollow updates

// ✅ CREATED BY KIRO - Event emitter for real-time follow updates
class FollowUpdateEmitter {
  private listeners: ((event: { type: "follow" | "unfollow"; userId: string }) => void)[] = [];

  on(callback: (event: { type: "follow" | "unfollow"; userId: string }) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  emit(event: { type: "follow" | "unfollow"; userId: string }) {
    this.listeners.forEach((listener) => listener(event));
  }
}

// Global emitter instance
export const followUpdateEmitter = new FollowUpdateEmitter();
