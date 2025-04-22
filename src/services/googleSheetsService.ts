/**
 * Service to fetch data from Google Sheets
 */

import { Participant, Category, LeaderboardData } from '../types';
import { computeRanks } from '../utils/formatters';

// Get API key and Sheet ID from environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;

if (!API_KEY || !SHEET_ID) {
  throw new Error('Missing required environment variables: VITE_GOOGLE_SHEETS_API_KEY and VITE_GOOGLE_SHEET_ID');
}

/**
 * Fetches data from Google Sheets
 */
export const fetchLeaderboardData = async (): Promise<LeaderboardData> => {
  try {
    // Fetch the data from Google Sheets, specifically rows 1-14
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Clasificacion!A1:X100?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch data from Google Sheets');
    }
    
    const data = await response.json();
    return processSheetData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

/**
 * Process data from Google Sheets response format to our app format
 */
const processSheetData = (data: any): LeaderboardData => {
  const values = data.values || [];
  console.log('Raw values from Google Sheets:', values);
  
  // Get part names from row 2 (index 1), starting from column E (index 4)
  const rawPartNames = values[1]?.slice(4, 24) || [];
  console.log('Raw part names:', rawPartNames);
  
  // Clean up the part names (remove any empty strings or undefined values)
  const partNames = rawPartNames
    .filter((name: string) => name && name.trim() !== '')
    .map((name: string) => name.trim());
  console.log('Processed part names:', partNames);
  
  // Process participants for each category
  const participants: Participant[] = [];
  
  // Define categories with their properties
  const categories: Category[] = [
    { id: 'scaled-fem', label: 'SCALED Femenino', sex: 'fem', level: 'scaled' },
    { id: 'scaled-masc', label: 'SCALED Masculino', sex: 'masc', level: 'scaled' },
    { id: 'open-fem', label: 'OPEN Femenino', sex: 'fem', level: 'open' },
    { id: 'open-masc', label: 'OPEN Masculino', sex: 'masc', level: 'open' },
    { id: 'rx-masc', label: 'RX Masculino', sex: 'masc', level: 'rx' }
  ];
  
  // SCALED Femenino: rows 4-14
  processCategoryRows(values, 4, 13, categories[0], participants);
  
  // SCALED Masculino: rows 17-28
  processCategoryRows(values, 17, 20, categories[1], participants);

  // OPEN Femenino: rows 31-41
  processCategoryRows(values, 31, 39, categories[2], participants);

  // OPEN Masculino: rows 44-59
  processCategoryRows(values, 44, 59, categories[3], participants);

  // RX Masculino: rows 64-75
  processCategoryRows(values, 64, 75, categories[4], participants);
  
  return { participants, categories, partNames };
};

// Helper function to process rows for a specific category
const processCategoryRows = (
  values: any[][],
  startIndex: number,
  endIndex: number,
  category: Category,
  participants: Participant[]
) => {
  for (let i = startIndex - 1; i <= endIndex - 1; i++) {
    const row = values[i];
    if (!row || row.length < 4) {
      console.log(`Skipping invalid row ${i}:`, row);
      continue;
    }
    
    const participant: Participant = {
      id: `p${i}`,
      name: row[1] || 'Unknown', // Name from column B
      category: category.id,
      parts: [],
      totalTime: totalTimeStringToSeconds(row[2]) || 0
    };
    
    // Process part times (starting from column E)
    for (let j = 0; j < 10; j++) {
      const timeIndex = 4 + (j * 2); // E, G, I, ...
      
      participant.parts.push({
        time: partTimeStringToSeconds(row[timeIndex])
      });
    }
    
    console.log(`Processed participant ${i} for ${category.label}:`, participant);
    participants.push(participant);
  }
};

// Helper function to convert HH:MM:SS to seconds
const partTimeStringToSeconds = (timeStr: string): number => {
  if (!timeStr || timeStr === '--:--') return 0;
  
  const parts = timeStr.split(':');
  if (parts.length !== 2) return 0;
  
  const minutes = parseInt(parts[0]) || 0;
  const seconds = parseInt(parts[1]) || 0;
  
  return (minutes * 60) + seconds;
};

// Helper function to convert HH:MM:SS to seconds
const totalTimeStringToSeconds = (timeStr: string): number => {
  if (!timeStr || timeStr === '--:--:--') return 0;
  
  const parts = timeStr.split(':');
  if (parts.length !== 3) return 0;
  
  const hours = parseInt(parts[0]) || 0;
  const minutes = parseInt(parts[1]) || 0;
  const seconds = parseInt(parts[2]) || 0;
  
  return (hours * 3600) + (minutes * 60) + seconds;
};
