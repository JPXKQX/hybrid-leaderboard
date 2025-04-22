export type Participant = {
  id: string;
  name: string;
  category: string;
  parts: {
    time: number; // Time in seconds
  }[];
  totalTime: number; // Total time in seconds
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