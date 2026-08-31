import apiClient from "../axios";
import { ApiResponse } from "../types";
import API_ENDPOINTS from "../endpoints";

export interface Category {
    id: string;
    name: string;
    icon?: string;
    image?: string;
    [key: string]: any;
}

export interface CategoriesResponse {
    items: Category[];
    total?: number;
    page?: number;
    limit?: number;
}

export async function getCategories(params?: {
    page?: number;
    limit?: number;
}): Promise<ApiResponse<CategoriesResponse>> {
    const page = params?.page || 1;
    const limit = params?.limit || 50;
    const endpoint = API_ENDPOINTS.CATEGORY.GET_ALL;

    try {
        // Categories should be publicly accessible - skip authentication
        const response = await apiClient.get<any>(endpoint, {
            skipAuth: true,
        });
        const responseData = response.data as any;
        console.log(
            `[Categories] ${responseData.code} ${responseData.data} ${response.status}`,
        );
        if (responseData.code === 1 && responseData.data) {
            let payload = responseData.data;
            let rawItems: any[] = [];

            if (Array.isArray(payload)) {
                rawItems = payload;
            } else if (Array.isArray(payload.items)) {
                rawItems = payload.items;
            } else if (Array.isArray(payload.categories)) {
                rawItems = payload.categories;
            } else if (Array.isArray(payload.data)) {
                rawItems = payload.data;
            }

            const items: Category[] = rawItems.map((c) => ({
                id:
                    c.id?.toString?.() ||
                    c._id?.toString?.() ||
                    c.categoryId?.toString?.() ||
                    "",
                name: c.name || c.title || "",
                icon: c.icon,
                image: c.image,
                ...c,
            }));

            const result: CategoriesResponse = {
                items,
                total: payload.total,
                page: payload.page || page,
                limit: payload.limit || limit,
            };

            return {
                success: true,
                data: result,
                message:
                    responseData.message || "Categories fetched successfully",
            };
        }

        return {
            success: false,
            message: responseData.message || "Failed to fetch categories",
            error: "API returned unsuccessful response",
            data: undefined,
        };
    } catch (error: any) {
        // Categories are public - suppress auth errors since app uses default categories
        if (
            error.response?.status === 401 ||
            error.message?.includes("token") ||
            error.message?.includes("Unauthorized")
        ) {
            // Backend requires auth but categories should be public
            // App will use default categories, so we don't need to log this as an error
            return {
                success: false,
                message: "Categories unavailable",
                error: "Unauthorized",
                data: undefined,
            };
        }

        // Only log non-auth errors
        console.error("[categoryService] getCategories error:", error.message);
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

export const categoryService = {
    getCategories,
};
