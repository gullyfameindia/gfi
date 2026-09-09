import apiClient from '../axios';
import { ApiResponse } from '../types';



export interface CompetitionSponsor {
  _id: string;
  email: string;
  sponsorCode?: string;
  [key: string]: any;
}

export interface CompetitionWinner {
  userId: string;
  rank: number;
  prize: number;
  _id: string;
  [key: string]: any;
}

export interface Competition {
  _id: string;
  title: string;
  description: string;
  sponsorId?: CompetitionSponsor;
  entryFee: number;
  prizePool: number;
  startDate: string;
  endDate: string;
  status: 'CREATED' | 'APPROVED' | 'CANCELLED' | 'COMPLETED' | 'live';
  participants: any[];
  isActive: boolean;
  isDeleted: boolean;
  winners: CompetitionWinner[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
  [key: string]: any;
}

export interface CompetitionsResponse {
  items: Competition[];
  total?: number;
}







export async function getCompetitions(params?: {
  page?: number;
  limit?: number;
}): Promise<ApiResponse<CompetitionsResponse>> {
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  
  try {
    console.log('[competitionService] GET user/competitions', { page, limit });
    
    const response = await apiClient.get<any>('user/competitions', {
      params: { page, limit },
    });
    const responseData = response.data as any;

    if (responseData.code === 1 && responseData.data) {
      let competitions: Competition[] = [];
      
      if (Array.isArray(responseData.data)) {
        competitions = responseData.data;
      } else if (Array.isArray(responseData.data.items)) {
        competitions = responseData.data.items;
      } else if (Array.isArray(responseData.data.competitions)) {
        competitions = responseData.data.competitions;
      }

      const result: CompetitionsResponse = {
        items: competitions,
        total: responseData.data.total || competitions.length,
        page,
        limit,
      };

      console.log('[competitionService] GET user/competitions - Success:', competitions.length, 'competitions');
      return {
        success: true,
        data: result,
        message: responseData.message || 'Competitions fetched successfully',
      };
    }

    return {
      success: false,
      message: responseData.message || 'Failed to fetch competitions',
      error: 'API returned unsuccessful response',
      data: {
        items: [],
        total: 0,
      },
    };
  } catch (error: any) {
    console.error('[competitionService] GET user/competitions error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: {
        items: [],
        total: 0,
      },
    };
  }
}




export async function getCompetitionById(competitionId: string): Promise<ApiResponse<Competition>> {
  try {
    console.log('[competitionService] GET competitions/:id', { competitionId });
    
    try {
      const response = await apiClient.get<any>(`competitions/${competitionId}`);
      const responseData = response.data as any;
      if (responseData.code === 1 && responseData.data) {
        return {
          success: true,
          data: responseData.data,
          message: responseData.message || 'Competition fetched successfully',
        };
      }
    } catch {
      // fallback to searching in list
    }

    const competitionsResponse = await getCompetitions({ page: 1, limit: 100 });
    
    if (competitionsResponse.success && competitionsResponse.data) {
      const competition = competitionsResponse.data.items.find(
        (comp) => comp._id === competitionId || comp.id === competitionId
      );
      
      if (competition) {
        return {
          success: true,
          data: competition,
          message: 'Competition fetched successfully',
        };
      }
    }

    return {
      success: false,
      message: 'Competition not found',
      error: 'NOT_FOUND',
      data: undefined,
    };
  } catch (error: any) {
    console.error('[competitionService] GET competitions/:id error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: undefined,
    };
  }
}

export async function joinCompetition(competitionId: string): Promise<ApiResponse<any>> {
  try {
    console.log('[competitionService] POST competitions/:id/join', { competitionId });
    const response = await apiClient.post<any>(`competitions/${competitionId}/join`);
    const responseData = response.data as any;

    return {
      success: responseData.code === 1 || responseData.success,
      data: responseData.data,
      message: responseData.message || 'Joined competition successfully',
    };
  } catch (error: any) {
    console.error('[competitionService] joinCompetition error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to join competition',
      error: error.message,
    };
  }
}

export async function getCompetitionLeaderboard(
  competitionId: string,
  params?: { page?: number; limit?: number }
): Promise<ApiResponse<any[]>> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const response = await apiClient.get<any>(`competitions/${competitionId}/leaderboard`, {
      params: { page, limit },
    });
    const responseData = response.data as any;

    const list = Array.isArray(responseData.data)
      ? responseData.data
      : responseData.data?.leaderboard || responseData.data?.items || [];

    return {
      success: true,
      data: list,
      message: responseData.message || 'Leaderboard fetched successfully',
    };
  } catch (error: any) {
    console.error('[competitionService] getCompetitionLeaderboard error:', error.message);
    return {
      success: false,
      message: error.message || 'Failed to fetch leaderboard',
      data: [],
    };
  }
}

export async function getCompetitionReels(
  competitionId: string,
  limit: number = 10
): Promise<ApiResponse<any[]>> {
  try {
    const response = await apiClient.get<any>(`competitions/${competitionId}/reels`, {
      params: { limit },
    });
    const responseData = response.data as any;

    const reels = Array.isArray(responseData.data)
      ? responseData.data
      : responseData.data?.reels || responseData.data?.items || [];

    return {
      success: true,
      data: reels,
      message: responseData.message || 'Reels fetched successfully',
    };
  } catch (error: any) {
    console.error('[competitionService] getCompetitionReels error:', error.message);
    return {
      success: false,
      message: error.message || 'Failed to fetch competition reels',
      data: [],
    };
  }
}

export async function getCompetitionRules(): Promise<ApiResponse<any>> {
  try {
    const response = await apiClient.get<any>('public/competitionRules', { skipAuth: true });
    const responseData = response.data as any;

    return {
      success: true,
      data: responseData.data,
      message: responseData.message || 'Rules fetched successfully',
    };
  } catch (error: any) {
    console.error('[competitionService] getCompetitionRules error:', error.message);
    return {
      success: false,
      message: error.message || 'Failed to fetch competition rules',
    };
  }
}




export async function getCompetitionsByStatus(
  status: 'CREATED' | 'APPROVED' | 'CANCELLED' | 'COMPLETED' | 'live',
  params?: { page?: number; limit?: number }
): Promise<ApiResponse<CompetitionsResponse>> {
  try {
    console.log('[competitionService] GET competitions by status', { status });
    
    const competitionsResponse = await getCompetitions(params);
    
    if (competitionsResponse.success && competitionsResponse.data) {
      const filteredCompetitions = competitionsResponse.data.items.filter(
        (comp) => comp.status === status
      );
      
      return {
        success: true,
        data: {
          items: filteredCompetitions,
          total: filteredCompetitions.length,
        },
        message: 'Competitions fetched successfully',
      };
    }

    return competitionsResponse;
  } catch (error: any) {
    console.error('[competitionService] GET competitions by status error:', error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Network error occurred',
      error: error.message || 'Network error',
      data: {
        items: [],
        total: 0,
      },
    };
  }
}



export const competitionService = {
  getCompetitions,
  getCompetitionById,
  getCompetitionsByStatus,
};

