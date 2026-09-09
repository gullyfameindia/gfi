
export type UserRole = "participants" | "fan" | string; 

export interface ProfileRouteConfig {
  own: string;
  user: string;
}


export const PROFILE_ROUTES: Record<string, ProfileRouteConfig> = {
  participants: {
    own: "/(main)/profile/own/participant",
    user: "/(main)/profile/user/participant/[id]",
  },
  fan: {
    own: "/(main)/profile/own/fan",
    user: "/(main)/profile/user/fan/[id]",
  },
  
  
  
  
  
};


export const DEFAULT_ROLE: UserRole = "participants";


export function getProfileRoute(role: UserRole, isOwnProfile: boolean): string {
  const roleConfig = PROFILE_ROUTES[role] || PROFILE_ROUTES[DEFAULT_ROLE];
  return isOwnProfile ? roleConfig.own : roleConfig.user;
}

