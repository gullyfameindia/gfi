import { LeaderboardAPIData } from "@/types/leaderboard";
// A pool of names to make it look realistic for the Cultre Boat demographic
const firstNames = [
  "Aarav",
  "Neha",
  "Rohan",
  "Priya",
  "Vikram",
  "Ananya",
  "Aditya",
  "Kavya",
  "Siddharth",
  "Isha",
  "Rahul",
  "Pooja",
  "Karan",
  "Sneha",
  "Amit",
];
const lastNames = [
  "Sharma",
  "Gupta",
  "Patel",
  "Verma",
  "Singh",
  "Desai",
  "Joshi",
  "Iyer",
  "Rao",
  "Reddy",
  "Kumar",
  "Mehta",
  "Chopra",
  "Das",
  "Shah",
];
const generatePureUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
export const generateMockLeaderboardData = (
  count: number,
): LeaderboardAPIData[] => {
  return Array.from({ length: count }).map((_, index) => {
    const randomFirstName =
      firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName =
      lastNames[Math.floor(Math.random() * lastNames.length)];

    // Creates a realistic descending point curve
    const points = Math.max(
      0,
      150000 - index * 1200 - Math.floor(Math.random() * 800),
    );

    return {
      id: generatePureUUID(),
      name: `${randomFirstName} ${randomLastName}`,
      rank: index + 1,
      points: points,

      profilePictureUrl:
        Math.random() > 0.3
          ? `https://i.pravatar.cc/150?u=${index + 1}`
          : undefined,
    };
  });
};

export const MOCK_LEADERBOARD_DATA = generateMockLeaderboardData(100);
