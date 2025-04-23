import React from 'react';
import { Link } from 'react-router-dom';
import { Participant, Category } from '../types';
import { formatPartTime, formatTotalTime, formatRank, computeRanks } from '../utils/formatters';
import { getRankColor, getRankBg } from '../utils/rankingStyles';

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

  return (
    <tr className={`${getRankBg(totalRank, index)} transition-colors hover:bg-blue-50`}>
      <td className={`px-4 py-3 text-center ${getRankColor(totalRank)}`}>
        {formatRank(totalRank)}
      </td>
      <td className="px-4 py-3 font-sm text-gray-900">
        <Link 
          to={`/participant/${participant.id}`}
          className="text-black-400 hover:text-black-800 hover:underline uppercase"
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
            <span className={`text-xs ${getRankColor(partRanks[idx])}`}>{formatRank(partRanks[idx])}</span>
          </div>
        </td>
      ))}
    </tr>
  );
};

export default ParticipantRow