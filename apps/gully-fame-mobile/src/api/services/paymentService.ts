import { Platform, Alert } from 'react-native';
import apiClient from '../axios';
import { ApiResponse } from '../types';

let RazorpayCheckout: any = null;

const isRazorpayAvailable = () => {
  return false;
};

export interface PaymentOrderData {
  amount: number;
  currency: string;
  receipt?: string;
  notes?: {
    competitionId?: string;
    competitionName?: string;
    userId?: string;
    [key: string]: string | undefined;
  };
}

export interface RazorpayOptions {
  description: string;
  image?: string;
  currency: string;
  key: string;
  amount: string;
  name: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  theme?: {
    color?: string;
  };
  order_id?: string;
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata?: {
    order_id?: string;
    payment_id?: string;
  };
}


const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || '';

const getMockUserData = () => ({
  email: 'user@example.com',
  contact: '9999999999',
  name: 'Test User',
});

export async function createPaymentOrder(data: PaymentOrderData): Promise<ApiResponse<{ orderId: string; amount: number; currency: string }>> {
  const endpoint = 'payments/create-order';
  
  try {
    console.log('[paymentService] POST payments/create-order');
    const response = await apiClient.post<ApiResponse<{ orderId: string; amount: number; currency: string }>>(endpoint, data);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return {
      success: false,
      message: response.data.message || 'Failed to create payment order',
      error: 'API returned unsuccessful response',
      data: undefined,
    };
  } catch (error: any) {
    console.error('[paymentService] createPaymentOrder error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: undefined,
    };
  }
}

export async function verifyPayment(paymentResponse: PaymentResponse): Promise<ApiResponse<{ verified: boolean; orderId: string; paymentId: string }>> {
  const endpoint = 'payments/verify';
  
  try {
    console.log('[paymentService] POST payments/verify');
    const response = await apiClient.post<ApiResponse<{ verified: boolean; orderId: string; paymentId: string }>>(endpoint, paymentResponse);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return {
      success: false,
      message: response.data.message || 'Payment verification failed',
      error: 'API returned unsuccessful response',
      data: undefined,
    };
  } catch (error: any) {
    console.error('[paymentService] verifyPayment error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: undefined,
    };
  }
}

export const convertRupeesToPaise = (rupees: number): number => {
  return Math.round(rupees * 100);
};

export const extractAmountFromString = (amountString: string): number => {
  const numericString = amountString.replace(/[₹,\s]/g, '').trim();
  const amount = parseFloat(numericString);
  
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Invalid amount format');
  }
  
  return amount;
};

export const formatAmount = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export interface InitiatePaymentParams {
  amount: number | string;
  description: string;
  competitionId?: string;
  competitionName?: string;
  userId?: string;
  userEmail?: string;
  userContact?: string;
  userName?: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
  errorCode?: string;
}

export const initiateRazorpayPayment = async (
  params: InitiatePaymentParams
): Promise<PaymentResult> => {
  return {
    success: false,
    error: 'Payment feature is temporarily disabled. Will be enabled when payment APIs are ready.',
    errorCode: 'FEATURE_DISABLED',
  };
};

export const handlePaymentError = (result: PaymentResult) => {
  if (result.success) {
    return;
  }

  let errorMessage = result.error || 'Payment failed. Please try again.';

  switch (result.errorCode) {
    case 'USER_CANCELLED':
      return;
    case 'SDK_NOT_AVAILABLE':
    case 'SDK_NOT_INITIALIZED':
      errorMessage = 'Payment SDK not available. Please rebuild the app with native modules.';
      break;
    case 'NETWORK_ERROR':
      errorMessage = 'Network error. Please check your internet connection and try again.';
      break;
    case 'VERIFICATION_FAILED':
      errorMessage = 'Payment verification failed. Please contact support if payment was deducted.';
      break;
    default:
      break;
  }

  Alert.alert(
    'Payment Failed',
    errorMessage,
    [{ text: 'OK' }]
  );
};

export const paymentService = {
  createPaymentOrder,
  verifyPayment,
  initiateRazorpayPayment,
  convertRupeesToPaise,
  extractAmountFromString,
  formatAmount,
  handlePaymentError,
};
