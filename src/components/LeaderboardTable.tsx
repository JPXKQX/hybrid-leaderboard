import React from 'react';
import { Participant } from '../types';
import ParticipantRow from './ParticipantRow';
import { ArrowUpDown } from 'lucide-react';

interface LeaderboardTableProps {
  participants: Participant[];
  searchTerm: string;
  partNames: string[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  participants,
  searchTerm,
  partNames
}) => {
  console.log('LeaderboardTable received participants:', participants);
  console.log('Search term:', searchTerm);
  console.log('Part names in table:', partNames);
  
  const [sortField, setSortField] = React.useState<string>('totalRank');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  
  // Filter participants by search term
  const filteredParticipants = participants.filter(participant => 
    participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log('Filtered participants:', filteredParticipants);
  
  // Sort participants based on the sort field and direction
  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    if (sortField === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    
    if (sortField === 'totalRank') {
      const aRank = a.totalRank || Infinity;
      const bRank = b.totalRank || Infinity;
      return sortDirection === 'asc' ? aRank - bRank : bRank - aRank;
    }
    
    if (sortField === 'totalTime') {
      const aTime = a.totalTime || Infinity;
      const bTime = b.totalTime || Infinity;
      return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
    }
    
    // Sort by part time
    if (sortField.startsWith('part_')) {
      const partIndex = parseInt(sortField.split('_')[1]);
      const aTime = a.parts[partIndex]?.time || Infinity;
      const bTime = b.parts[partIndex]?.time || Infinity;
      return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
    }
    
    return 0;
  });
  console.log('Sorted participants:', sortedParticipants);
  
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
            <SortableHeader field="totalRank">Rank</SortableHeader>
            <SortableHeader field="name">Name</SortableHeader>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <SortableHeader field="totalTime">
              <div className="bg-gray-50 px-2">
                Total Time
              </div>
            </SortableHeader>
            
            {/* Part headers */}
            {partNames.map((name, idx) => {
              console.log(`Rendering part header ${idx}:`, name);
              return (
                <SortableHeader key={idx} field={`part_${idx}`}>
                  <span>{name || `Part ${idx + 1}`}</span>
                </SortableHeader>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedParticipants.map((participant, index) => (
            <ParticipantRow 
              key={participant.id} 
              participant={participant} 
              index={index}
            />
          ))}
          
          {sortedParticipants.length === 0 && (
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