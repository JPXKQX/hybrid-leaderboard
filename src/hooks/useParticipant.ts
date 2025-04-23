import { useState, useEffect } from 'react';
import { Participant, Category, LeaderboardData } from '../types';
import { fetchLeaderboardData } from '../services/googleSheetsService';
import { computeRanks } from '../utils/formatters';

export const useParticipant = (id: string | undefined) => {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [partNames, setPartNames] = useState<string[]>([]);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [globalRank, setGlobalRank] = useState<number>(0);
  const [partRanks, setPartRanks] = useState<{ global: number; category: number }[]>([]);

  useEffect(() => {
    const loadParticipant = async () => {
      if (!id) return;

      try {
        const data = await fetchLeaderboardData();
        const found = data.participants.find(p => p.id === id);
        
        if (found) {
          setParticipant(found);
          setPartNames(data.partNames);
          setTotalParticipants(data.participants.length);
          
          // Find category
          const foundCategory = data.categories.find(c => c.id === found.category);
          setCategory(foundCategory || null);
          
          // Calculate global rank
          const ranks = computeRanks(data.participants, p => p.totalTime);
          const participantIndex = data.participants.findIndex(p => p.id === id);
          setGlobalRank(ranks[participantIndex]);
          
          // Calculate part ranks (both global and category)
          const categoryParticipants = data.participants.filter(p => p.category === found.category);
          const categoryParticipantCount = categoryParticipants.length;
          
          const partRanksList = found.parts.map((_, partIndex) => {
            // Global ranks
            const globalRanks = computeRanks(data.participants, p => p.parts[partIndex]?.time || 0);
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
      } catch (error) {
        console.error('Error loading participant:', error);
        setParticipant(null);
        setCategory(null);
        setPartNames([]);
        setTotalParticipants(0);
        setGlobalRank(0);
        setPartRanks([]);
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
    partRanks 
  };
};