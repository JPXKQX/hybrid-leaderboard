export type Participant = {
  id: string;
  name: string;
  category: string;
  parts: {
    time: number; // Time in seconds
    rank?: number; // Optional as it will be calculated
  }[];
  totalTime?: number; // Optional as it will be calculated
  totalRank?: number; // Optional as it will be calculated
};

export type Category = {
  id: string;
  name: string;
};

export type LeaderboardData = {
  participants: Participant[];
  categories: Category[];
  partNames: string[]; // Add part names to the data structure
};