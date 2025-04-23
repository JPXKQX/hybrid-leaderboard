import React from 'react';
import { Link } from 'react-router-dom';
import { Participant, Category } from '../types';
import { formatPartTime, formatTotalTime, formatRank, computeRanks } from '../utils/formatters';

interface ParticipantRowProps {
  participant: Participant;
  index: number;
  allParticipants: Participant[];
  category?: Category;
}

const ParticipantRow: React.FC<ParticipantRowProps> = ({ participant, index, allParticipants = [], category }) => {
  // Compute total rank
  const totalRanks = computeRanks(allParticipants, p => p.totalTime);
  const participantIndex = allParticipants.findIndex(p => p.id === participant.id);
  const totalRank = participantIndex >= 0 ? totalRanks[participantIndex] : 0;
  const isTop3 = totalRank <= 3 && totalRank > 0;
  
  // Compute part ranks
  const partRanks = participant.parts.map((_, partIndex) => {
    const ranks = computeRanks(allParticipants, p => p.parts[partIndex]?.time || 0);
    return participantIndex >= 0 ? ranks[participantIndex] : 0;
  });
  
  // Determine background color based on rank
  const getBgColor = () => {
    if (isTop3) {
      switch (totalRank) {
        case 1: return 'bg-yellow-50';
        case 2: return 'bg-gray-50';
        case 3: return 'bg-amber-50';
        default: return index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
      }
    }
    return index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
  };
  
  // Determine rank display color
  const getRankColor = () => {
    if (isTop3) {
      switch (totalRank) {
        case 1: return 'text-yellow-600 font-bold';
        case 2: return 'text-gray-600 font-bold';
        case 3: return 'text-amber-700 font-bold';
        default: return 'text-gray-800';
      }
    }
    return 'text-gray-800';
  };

  return (
    <tr className={`${getBgColor()} transition-colors hover:bg-blue-50`}>
      <td className={`px-4 py-3 text-center ${getRankColor()}`}>
        {formatRank(totalRank)}
      </td>
      <td className="px-4 py-3 font-medium text-gray-900">
        <Link 
          to={`/participant/${participant.id}`}
          className="text-black-400 hover:text-black-800 hover:underline"
        >
          {participant.name}
        </Link>
      </td>
      <td className="px-4 py-3 text-gray-700">
        {category?.label || 'Unknown Category'}
      </td>
      
      {/* Total time */}
      <td className="px-4 py-3 text-center font-medium">
        {formatTotalTime(participant.totalTime)}
      </td>

      {/* Part times */}
      {participant.parts.map((part, idx) => (
        <td key={idx} className="px-2 py-3 text-center">
          <div className="flex flex-col items-center">
            <span className="text-gray-800">{formatPartTime(part.time)}</span>
            <span className="text-xs text-gray-500">{formatRank(partRanks[idx])}</span>
          </div>
        </td>
      ))}
    </tr>
  );
};

export default ParticipantRow;