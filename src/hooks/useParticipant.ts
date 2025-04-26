import { useState, useEffect } from 'react';
import { Participant, Category, LeaderboardData } from '../types';
import { fetchLeaderboardData } from '../services/googleSheetsService';
import { computeRanks } from '../utils/formatters';

interface UseParticipantReturn {
  participant: Participant | null;
  category: Category | null;
  partNames: string[];
  totalParticipants: number;
  globalRank: number;
  partRanks: { global: number; category: number; totalParticipants: number; categoryParticipantCount: number; }[];
  data: LeaderboardData | null;
  isLoading: boolean;
  error: string | null;
}

export const useParticipant = (id: string | undefined): UseParticipantReturn => {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [partNames, setPartNames] = useState<string[]>([]);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [globalRank, setGlobalRank] = useState<number>(0);
  const [partRanks, setPartRanks] = useState<{ global: number; category: number; totalParticipants: number; categoryParticipantCount: number; }[]>([]);
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParticipant = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const fetchedData = await fetchLeaderboardData();
        setData(fetchedData);
        
        if (id) {
          const found = fetchedData.participants.find(p => p.id === id);
          
          if (found) {
            setParticipant(found);
            setPartNames(fetchedData.partNames);
            setTotalParticipants(fetchedData.participants.length);
            
            // Find category
            const foundCategory = fetchedData.categories.find(c => c.id === found.category);
            setCategory(foundCategory || null);
            
            // Calculate global rank
            const ranks = computeRanks(fetchedData.participants, p => p.totalTime);
            const participantIndex = fetchedData.participants.findIndex(p => p.id === id);
            setGlobalRank(ranks[participantIndex]);
            
            // Calculate part ranks (both global and category)
            const categoryParticipants = fetchedData.participants.filter(p => p.category === found.category);
            const categoryParticipantCount = categoryParticipants.length;
            
            const partRanksList = found.parts.map((_, partIndex) => {
              // Global ranks
              const globalRanks = computeRanks(fetchedData.participants, p => p.parts[partIndex]?.time || 0);
              const globalRank = globalRanks[participantIndex];
              
              // Category ranks
              const categoryRanks = computeRanks(categoryParticipants, p => p.parts[partIndex]?.time || 0);
              const categoryParticipantIndex = categoryParticipants.findIndex(p => p.id === id);
              const categoryRank = categoryRanks[categoryParticipantIndex];
              
              return {
                global: globalRank,
                category: categoryRank,
                totalParticipants,
                categoryParticipantCount
              };
            });
            
            setPartRanks(partRanksList);
          } else {
            setParticipant(null);
            setCategory(null);
            setPartNames([]);
            setTotalParticipants(0);
            setGlobalRank(0);
            setPartRanks([]);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading participant:', error);
        setError('Failed to load data');
        setParticipant(null);
        setCategory(null);
        setPartNames([]);
        setTotalParticipants(0);
        setGlobalRank(0);
        setPartRanks([]);
        setIsLoading(false);
      }
    };

    loadParticipant();
  }, [id]);

  return { 
    participant, 
    category, 
    partNames, 
    totalParticipants, 
    globalRank,
    partRanks,
    data,
    isLoading,
    error
  };
};