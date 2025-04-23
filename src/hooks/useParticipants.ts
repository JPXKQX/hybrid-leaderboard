import { useState, useEffect } from 'react';
import { Participant } from '../types';
import { fetchLeaderboardData } from '../services/googleSheetsService';

export const useParticipant = (id: string | undefined) => {
  const [participant, setParticipant] = useState<Participant | null>(null);

  useEffect(() => {
    const loadParticipant = async () => {
      if (!id) return;

      try {
        const data = await fetchLeaderboardData();
        const found = data.participants.find(p => p.id === id);
        setParticipant(found || null);
      } catch (error) {
        console.error('Error loading participant:', error);
        setParticipant(null);
      }
    };

    loadParticipant();
  }, [id]);

  return participant;
};