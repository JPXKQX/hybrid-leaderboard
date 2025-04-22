/**
 * Formats time in seconds to MM:SS format (for individual parts)
 */
export const formatPartTime = (timeInSeconds: number): string => {
  if (timeInSeconds === 0 || !timeInSeconds) return '--:--';
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Formats time in seconds to HH:MM:SS format (for total time)
 */
export const formatTotalTime = (timeInSeconds: number): string => {
  if (timeInSeconds === 0 || !timeInSeconds) return '--:--:--';
  
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Computes ranks for an array of values
 * @param values Array of values to rank
 * @param getValue Function to extract the value to rank from each item
 * @returns Array of ranks (1-based)
 */
export const computeRanks = <T>(
  items: T[],
  getValue: (item: T) => number
): number[] => {
  // Create array of {index, value} pairs, filtering out empty values
  const indexedValues = items
    .map((item, index) => ({
      index,
      value: getValue(item)
    }))
    .filter(item => item.value > 0); // Only include non-zero values

  // Sort by value (ascending)
  indexedValues.sort((a, b) => a.value - b.value);

  // Assign ranks
  const ranks = new Array(items.length).fill(0); // Initialize with 0 for empty values
  let currentRank = 1;
  let currentValue = indexedValues[0]?.value;

  indexedValues.forEach((item, i) => {
    if (item.value > currentValue) {
      currentRank = i + 1;
      currentValue = item.value;
    }
    ranks[item.index] = currentRank;
  });

  return ranks;
};

/**
 * Formats rank with appropriate suffix
 */
export const formatRank = (rank?: number): string => {
  if (!rank) return '-';
  
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const relevantDigit = rank % 100;
  const suffix = suffixes[(relevantDigit > 10 && relevantDigit < 14) ? 0 : Math.min(relevantDigit % 10, 3)];
  
  return `${rank}${suffix}`;
};