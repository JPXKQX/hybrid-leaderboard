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
 * Formats rank with appropriate suffix
 */
export const formatRank = (rank?: number): string => {
  if (!rank) return '-';
  
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const relevantDigit = rank % 100;
  const suffix = suffixes[(relevantDigit > 10 && relevantDigit < 14) ? 0 : Math.min(relevantDigit % 10, 3)];
  
  return `${rank}${suffix}`;
};