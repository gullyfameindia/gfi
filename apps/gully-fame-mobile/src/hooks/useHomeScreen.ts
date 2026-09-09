import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api";
import { BASE_URL } from "@/api/axios";
import {
    fallbackCategories,
    upcomingCompetitionsMock,
    pastCompetitionsMock,
    heroSlides,
} from "@/data/home/mockData";

export interface HomeScreenData {
    banners: any[];
    trending: any[];
    liveCompetitions: any[];
    pastCompetitions: any[];
    upcomingCompetitions: any[];
    topCompetitors: any[];
    categories: any[];
}

const FALLBACK_DATA: HomeScreenData = {
    banners:              heroSlides,
    trending:             [],
    liveCompetitions:     upcomingCompetitionsMock,
    pastCompetitions:     pastCompetitionsMock,
    upcomingCompetitions: upcomingCompetitionsMock,
    topCompetitors:       [],
    categories:           fallbackCategories,
};


const toFullUrl = (path: string | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path; 
    
    
    const serverUrl = BASE_URL?.replace('/v1/api/', '') ?? '';
    return `${serverUrl}${path}`;
};

async function fetchHomeScreen(): Promise<HomeScreenData> {
    console.log('🔄 [HomeScreen] API call...');
    try {
        const resp = await apiClient.get("/user/homeScreen");
        console.log('✅ [HomeScreen] Success:', resp.status);

        const data = resp.data?.data;
        if (!data) return FALLBACK_DATA;

        
        const banners = data.banners?.map((b: any) => ({
            ...b,
            image: toFullUrl(b.image),
        })) ?? heroSlides;

        
        const categories = data.categories?.map((c: any) => ({
            ...c,
            icon: toFullUrl(c.icon),
            image: toFullUrl(c.image),
        })) ?? fallbackCategories;

        
        const trending = data.trending?.map((t: any) => ({
            ...t,
            image: toFullUrl(t.image),
        })) ?? [];

        
        const upcomingCompetitions = data.upcomingCompetitions?.map((c: any) => ({
            ...c,
            image: toFullUrl(c.image),
        })) ?? upcomingCompetitionsMock;

        
        const pastCompetitions = data.pastCompetitions?.map((c: any) => ({
            ...c,
            image: toFullUrl(c.image),
        })) ?? pastCompetitionsMock;

        
        
        const liveCompetitions = data.liveCompetitions?.map((c: any) => ({
            ...c,
            image: toFullUrl(c.image),
        })) ?? [];

        
        const topCompetitors = data.topCompetitors?.map((c: any) => ({
            ...c,
            image: toFullUrl(c.image),
        })) ?? [];

        console.log('✅ Data processed:', {
            banners: banners.length,
            categories: categories.length,
            trending: trending.length,
            upcoming: upcomingCompetitions.length,
            past: pastCompetitions.length,
        });

        return {
            banners,
            categories,
            trending,
            upcomingCompetitions,
            pastCompetitions,
            liveCompetitions,
            topCompetitors,
        };

    } catch (error: any) {
        console.log('❌ [HomeScreen] Failed:', error.message);
        return FALLBACK_DATA;
    }
}

export function useHomeScreen() {
    const query = useQuery({
        queryKey: ["homeScreen"],
        queryFn: fetchHomeScreen,
        staleTime: 1000 * 60 * 5,
        retry: 1,
        placeholderData: FALLBACK_DATA,
    });

    return {
        banners:              query.data?.banners              ?? heroSlides,
        trending:             query.data?.trending             ?? [],
        liveCompetitions:     query.data?.liveCompetitions     ?? [],
        pastCompetitions:     query.data?.pastCompetitions     ?? pastCompetitionsMock,
        upcomingCompetitions: query.data?.upcomingCompetitions ?? upcomingCompetitionsMock,
        topCompetitors:       query.data?.topCompetitors       ?? [],
        categories:           query.data?.categories           ?? fallbackCategories,
        isLoading:  query.isLoading,
        isFetching: query.isFetching,
        isError:    query.isError,
        error:      query.error,
        refetch:    query.refetch,
    };
}