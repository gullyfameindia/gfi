import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Reel {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  likes: number;
  comments: number;
  views: number;
  isLiked: boolean;
  createdAt: string;
}

interface ReelsState {
  reels: Reel[];
  currentReel: Reel | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReelsState = {
  reels: [],
  currentReel: null,
  loading: false,
  error: null,
};

const reelsSlice = createSlice({
  name: "reels",
  initialState,
  reducers: {
    setReels: (state, action: PayloadAction<Reel[]>) => {
      state.reels = action.payload;
    },
    setCurrentReel: (state, action: PayloadAction<Reel | null>) => {
      state.currentReel = action.payload;
    },
    addReel: (state, action: PayloadAction<Reel>) => {
      state.reels.unshift(action.payload);
    },
    removeReel: (state, action: PayloadAction<string>) => {
      state.reels = state.reels.filter((reel) => reel.id !== action.payload);
    },
    updateReel: (state, action: PayloadAction<Reel>) => {
      const index = state.reels.findIndex((reel) => reel.id === action.payload.id);
      if (index !== -1) {
        state.reels[index] = action.payload;
      }
    },
    likeReel: (state, action: PayloadAction<string>) => {
      const reel = state.reels.find((r) => r.id === action.payload);
      if (reel) {
        reel.isLiked = true;
        reel.likes += 1;
      }
    },
    unlikeReel: (state, action: PayloadAction<string>) => {
      const reel = state.reels.find((r) => r.id === action.payload);
      if (reel) {
        reel.isLiked = false;
        reel.likes -= 1;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setReels,
  setCurrentReel,
  addReel,
  removeReel,
  updateReel,
  likeReel,
  unlikeReel,
  setLoading,
  setError,
} = reelsSlice.actions;

export default reelsSlice.reducer;
