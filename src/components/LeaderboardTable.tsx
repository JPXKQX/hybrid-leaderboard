import React from 'react';
import { Participant, Category } from '../types';
import ParticipantRow from './ParticipantRow';
import { ArrowUpDown } from 'lucide-react';
import { computeRanks } from '../utils/formatters';

interface LeaderboardTableProps {
  participants: Participant[];
  categories: Category[];
  searchTerm: string;
  partNames: string[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  participants,
  categories,
  searchTerm,
  partNames
}) => {
  const [sortField, setSortField] = React.useState<string>('totalTime');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  
  // Filter participants by search term
  const filteredParticipants = participants.filter(participant => 
    participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute ranks for all participants
  const totalRanks = computeRanks(filteredParticipants, p => p.totalTime);
  
  // Sort participants based on the sort field and direction
  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    
    if (sortField === 'totalTime') {
      const aIndex = filteredParticipants.findIndex(p => p.id === a.id);
      const bIndex = filteredParticipants.findIndex(p => p.id === b.id);
      const aRank = totalRanks[aIndex] || Infinity;
      const bRank = totalRanks[bIndex] || Infinity;
      
      // Put unranked participants (rank 0) at the end
      if (aRank === 0 && bRank === 0) return 0;
      if (aRank === 0) return 1;
      if (bRank === 0) return -1;
      
      return sortDirection === 'asc' ? aRank - bRank : bRank - aRank;
    }
    
    // Sort by part time
    if (sortField.startsWith('part_')) {
      const partIndex = parseInt(sortField.split('_')[1]);
      const aTime = a.parts[partIndex]?.time || Infinity;
      const bTime = b.parts[partIndex]?.time || Infinity;
      
      // Put participants with no time (0) at the end
      if (aTime === 0 && bTime === 0) return 0;
      if (aTime === 0) return 1;
      if (bTime === 0) return -1;
      
      return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
    }
    
    return 0;
  });
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Create a clickable header cell
  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <th 
      className="px-2 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-center">
        {children}
        <ArrowUpDown className={`ml-1 w-4 h-4 ${sortField === field ? 'text-blue-600' : 'text-gray-400'}`} />
      </div>
    </th>
  );
  
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <SortableHeader field="totalTime">Rank</SortableHeader>
            <SortableHeader field="name">Nombre</SortableHeader>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <SortableHeader field="totalTime">
              <div className="bg-gray-50 px-2">
                Tiempo Total
              </div>
            </SortableHeader>
            
            {/* Part headers */}
            {partNames.map((name, idx) => (
              <SortableHeader key={idx} field={`part_${idx}`}>
                <span>{name || `Part ${idx + 1}`}</span>
              </SortableHeader>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedParticipants.map((participant, index) => {
            const category = categories?.find(c => c.id === participant.category);
            return (
              <ParticipantRow 
                key={participant.id} 
                participant={participant} 
                index={index}
                allParticipants={participants}
                category={category}
              />
            );
          })}
          
          {(!sortedParticipants || sortedParticipants.length === 0) && (
            <tr>
              <td colSpan={13} className="px-4 py-4 text-center text-gray-500">
                {searchTerm ? 'No participants matching your search' : 'No participants found'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;