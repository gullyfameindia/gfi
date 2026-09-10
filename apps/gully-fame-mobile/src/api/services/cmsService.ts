import apiClient from '../axios';
import { ApiResponse } from '../types';

export interface CMSContentResponse {
  content?: string;
  termsAndConditions?: string;
  aboutUs?: string;
  privacyPolicy?: string;
  competitionRules?: string;
  [key: string]: any;
}

export async function getTermsAndConditions(): Promise<ApiResponse<CMSContentResponse>> {
  const endpoint = 'admin/termAndCondition';

  try {
    const response = await apiClient.get<any>(endpoint);
    const responseData = response.data as any;

    if (responseData.code === 1) {
      // Handle different response formats
      let content = '';
      if (typeof responseData.data === 'string') {
        // If data is a string directly
        content = responseData.data;
      } else if (responseData.data && typeof responseData.data === 'object') {
        // If data is an object, check for termsAndConditions or content field
        content = responseData.data.termsAndConditions || responseData.data.content || '';
      }
      
      return {
        success: true,
        data: { content, termsAndConditions: content },
        message: responseData.message || 'Terms and conditions fetched successfully',
      };
    }

    return {
      success: false,
      message: responseData.message || 'Failed to fetch terms and conditions',
      error: 'API returned unsuccessful response',
      data: undefined,
    };
  } catch (error: any) {
    console.error('[cmsService] getTermsAndConditions error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: undefined,
    };
  }
}

export async function getAboutUs(): Promise<ApiResponse<CMSContentResponse>> {
  const endpoint = 'admin/aboutUs';

  try {
    const response = await apiClient.get<any>(endpoint);
    const responseData = response.data as any;

    if (responseData.code === 1) {
      // Handle different response formats
      let content = '';
      if (typeof responseData.data === 'string') {
        content = responseData.data;
      } else if (responseData.data && typeof responseData.data === 'object') {
        content = responseData.data.aboutUs || responseData.data.content || '';
      }
      
      return {
        success: true,
        data: { content, aboutUs: content },
        message: responseData.message || 'About us fetched successfully',
      };
    }

    return {
      success: false,
      message: responseData.message || 'Failed to fetch about us',
      error: 'API returned unsuccessful response',
      data: undefined,
    };
  } catch (error: any) {
    console.error('[cmsService] getAboutUs error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: undefined,
    };
  }
}

export async function getPrivacyPolicy(): Promise<ApiResponse<CMSContentResponse>> {
  const endpoint = 'admin/privacyPolicy';

  try {
    const response = await apiClient.get<any>(endpoint);
    const responseData = response.data as any;

    if (responseData.code === 1) {
      // Handle different response formats
      let content = '';
      if (typeof responseData.data === 'string') {
        content = responseData.data;
      } else if (responseData.data && typeof responseData.data === 'object') {
        content = responseData.data.privacyPolicy || responseData.data.content || '';
      }
      
      return {
        success: true,
        data: { content, privacyPolicy: content },
        message: responseData.message || 'Privacy policy fetched successfully',
      };
    }

    return {
      success: false,
      message: responseData.message || 'Failed to fetch privacy policy',
      error: 'API returned unsuccessful response',
      data: undefined,
    };
  } catch (error: any) {
    console.error('[cmsService] getPrivacyPolicy error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: undefined,
    };
  }
}

export async function getCompetitionRules(): Promise<ApiResponse<CMSContentResponse>> {
  const endpoint = 'admin/competitionRules';

  try {
    const response = await apiClient.get<any>(endpoint);
    const responseData = response.data as any;

    if (responseData.code === 1) {
      // Handle different response formats
      let content = '';
      if (typeof responseData.data === 'string') {
        content = responseData.data;
      } else if (responseData.data && typeof responseData.data === 'object') {
        content = responseData.data.competitionRules || responseData.data.content || '';
      }
      
      return {
        success: true,
        data: { content, competitionRules: content },
        message: responseData.message || 'Competition rules fetched successfully',
      };
    }

    return {
      success: false,
      message: responseData.message || 'Failed to fetch competition rules',
      error: 'API returned unsuccessful response',
      data: undefined,
    };
  } catch (error: any) {
    console.error('[cmsService] getCompetitionRules error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: undefined,
    };
  }
}

export const cmsService = {
  getTermsAndConditions,
  getAboutUs,
  getPrivacyPolicy,
  getCompetitionRules,
};

