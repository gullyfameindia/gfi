import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Competition {
  id: string;
  title: string;
  description: string;
  status: "CREATED" | "APPROVED" | "LIVE" | "COMPLETED" | "CANCELLED";
  participants: number;
  prize: string;
  startDate: string;
  endDate: string;
  isJoined: boolean;
}

interface CompetitionsState {
  competitions: Competition[];
  currentCompetition: Competition | null;
  loading: boolean;
  error: string | null;
  filter: "ALL" | "LIVE" | "UPCOMING" | "COMPLETED";
}

const initialState: CompetitionsState = {
  competitions: [],
  currentCompetition: null,
  loading: false,
  error: null,
  filter: "ALL",
};

const competitionsSlice = createSlice({
  name: "competitions",
  initialState,
  reducers: {
    setCompetitions: (state, action: PayloadAction<Competition[]>) => {
      state.competitions = action.payload;
    },
    setCurrentCompetition: (state, action: PayloadAction<Competition | null>) => {
      state.currentCompetition = action.payload;
    },
    addCompetition: (state, action: PayloadAction<Competition>) => {
      state.competitions.unshift(action.payload);
    },
    updateCompetition: (state, action: PayloadAction<Competition>) => {
      const index = state.competitions.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.competitions[index] = action.payload;
      }
    },
    joinCompetition: (state, action: PayloadAction<string>) => {
      const competition = state.competitions.find((c) => c.id === action.payload);
      if (competition) {
        competition.isJoined = true;
        competition.participants += 1;
      }
    },
    leaveCompetition: (state, action: PayloadAction<string>) => {
      const competition = state.competitions.find((c) => c.id === action.payload);
      if (competition) {
        competition.isJoined = false;
        competition.participants -= 1;
      }
    },
    setFilter: (state, action: PayloadAction<"ALL" | "LIVE" | "UPCOMING" | "COMPLETED">) => {
      state.filter = action.payload;
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
  setCompetitions,
  setCurrentCompetition,
  addCompetition,
  updateCompetition,
  joinCompetition,
  leaveCompetition,
  setFilter,
  setLoading,
  setError,
} = competitionsSlice.actions;

export default competitionsSlice.reducer;
