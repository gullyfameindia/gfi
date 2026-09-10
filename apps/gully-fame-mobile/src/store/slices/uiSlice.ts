import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isLoading: boolean;
  isRefreshing: boolean;
  showModal: boolean;
  modalType: "ALERT" | "CONFIRM" | "INPUT" | null;
  modalTitle: string;
  modalMessage: string;
  showBottomSheet: boolean;
  bottomSheetContent: string;
  toastMessage: string | null;
  toastType: "SUCCESS" | "ERROR" | "WARNING" | "INFO" | null;
  networkConnected: boolean;
}

const initialState: UIState = {
  isLoading: false,
  isRefreshing: false,
  showModal: false,
  modalType: null,
  modalTitle: "",
  modalMessage: "",
  showBottomSheet: false,
  bottomSheetContent: "",
  toastMessage: null,
  toastType: null,
  networkConnected: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    showAlert: (state, action: PayloadAction<{ title: string; message: string }>) => {
      state.showModal = true;
      state.modalType = "ALERT";
      state.modalTitle = action.payload.title;
      state.modalMessage = action.payload.message;
    },
    showConfirm: (state, action: PayloadAction<{ title: string; message: string }>) => {
      state.showModal = true;
      state.modalType = "CONFIRM";
      state.modalTitle = action.payload.title;
      state.modalMessage = action.payload.message;
    },
    closeModal: (state) => {
      state.showModal = false;
      state.modalType = null;
      state.modalTitle = "";
      state.modalMessage = "";
    },
    showBottomSheetModal: (state, action: PayloadAction<string>) => {
      state.showBottomSheet = true;
      state.bottomSheetContent = action.payload;
    },
    closeBottomSheet: (state) => {
      state.showBottomSheet = false;
      state.bottomSheetContent = "";
    },
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: "SUCCESS" | "ERROR" | "WARNING" | "INFO" }>
    ) => {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type;
    },
    hideToast: (state) => {
      state.toastMessage = null;
      state.toastType = null;
    },
    setNetworkConnected: (state, action: PayloadAction<boolean>) => {
      state.networkConnected = action.payload;
    },
  },
});

export const {
  setLoading,
  setRefreshing,
  showAlert,
  showConfirm,
  closeModal,
  showBottomSheetModal,
  closeBottomSheet,
  showToast,
  hideToast,
  setNetworkConnected,
} = uiSlice.actions;

export default uiSlice.reducer;
