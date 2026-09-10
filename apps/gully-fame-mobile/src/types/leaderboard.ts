export interface LeaderboardAPIData {
  id: string;
  name: string;
  rank: number;
  points: number;
  profilePictureUrl?: string;
  userId?: string | number;
}
