import React from 'react';
import { Participant } from '../types';
import { formatPartTime, formatTotalTime, formatRank } from '../utils/formatters';

interface ParticipantRowProps {
  participant: Participant;
  index: number;
}

const ParticipantRow: React.FC<ParticipantRowProps> = ({ participant, index }) => {
  const isTop3 = participant.totalRank !== undefined && participant.totalRank <= 3;
  
  // Determine background color based on rank
  const getBgColor = () => {
    if (isTop3) {
      switch (participant.totalRank) {
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
      switch (participant.totalRank) {
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
        {formatRank(participant.totalRank)}
      </td>
      <td className="px-4 py-3 text-sm uppercase font-medium text-gray-900">
        {participant.name}
      </td>
      <td className="px-4 py-3 text-gray-700">
        {participant.category}
      </td>
      
      {/* Total time */}
      <td className="px-4 py-3 text-center font-medium">
        {formatTotalTime(participant.totalTime || 0)}
      </td>

      {/* Part times */}
      {participant.parts.map((part, idx) => (
        <td key={idx} className="px-2 py-3 text-center">
          <div className="flex flex-col items-center">
            <span className="text-gray-800">{formatPartTime(part.time)}</span>
            <span className="text-xs text-gray-500">{formatRank(part.rank)}</span>
          </div>
        </td>
      ))}
    </tr>
  );
};

export default ParticipantRow;