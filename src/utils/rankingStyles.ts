export const getRankColor = (rank: number): string => {
    if (rank > 0 && rank <= 3) {
      switch (rank) {
        case 1: return 'text-yellow-600 font-bold';
        case 2: return 'text-gray-600 font-bold';
        case 3: return 'text-amber-700 font-bold';
        default: return 'text-gray-800';
      }
    }
    return 'text-gray-800';
  };
  
  export const getRankBg = (rank: number, index: number): string => {
    if (rank > 0 && rank <= 3) {
      switch (rank) {
        case 1: return 'bg-yellow-50';
        case 2: return 'bg-gray-50';
        case 3: return 'bg-amber-50';
        default: return index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
      }
    }
    return index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
  };