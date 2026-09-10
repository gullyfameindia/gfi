// Profile routing configuration - Easy to extend for new roles
export type UserRole = "participants" | "fan" | string; // Add more roles here as needed

export interface ProfileRouteConfig {
  own: string;
  user: string;
}

// Role-based routing map - Add new roles here
export const PROFILE_ROUTES: Record<string, ProfileRouteConfig> = {
  participants: {
    own: "/(main)/profile/own/participant",
    user: "/(main)/profile/user/participant/[id]",
  },
  fan: {
    own: "/(main)/profile/own/fan",
    user: "/(main)/profile/user/fan/[id]",
  },
  // Add more roles here in the future:
  // admin: {
  //   own: "/(main)/profile/own/admin",
  //   user: "/(main)/profile/user/admin/[id]",
  // },
};

// Default role if not specified
export const DEFAULT_ROLE: UserRole = "participants";

// Get route for a role
export function getProfileRoute(role: UserRole, isOwnProfile: boolean): string {
  const roleConfig = PROFILE_ROUTES[role] || PROFILE_ROUTES[DEFAULT_ROLE];
  return isOwnProfile ? roleConfig.own : roleConfig.user;
}

