import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Clock, Medal, Share2, Timer } from 'lucide-react';
import { useParticipant } from '../hooks/useParticipant';
import { formatPartTime, formatTotalTime, formatRank } from '../utils/formatters';
import { getRankColor } from '../utils/rankingStyles';

const ParticipantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { participant, category, partNames, totalParticipants, globalRank, partRanks } = useParticipant(id);

  if (!participant) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Pareja no encontrada</p>
          <Link to="/" className="mt-4 text-blue-600 hover:text-blue-800 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Vuelta a la clasificación
          </Link>
        </div>
      </div>
    );
  }

  // Calculate run statistics
  const runParts = [0, 4, 8]; // Indices of run parts
  const runTimes = runParts.map(idx => participant.parts[idx]?.time || 0);
  const totalRunTime = runTimes.reduce((acc, time) => acc + time, 0);
  const totalRunDistance = 4.8; // Total distance in kilometers
  const averagePace = totalRunTime / totalRunDistance;
  
  // Find fastest and slowest runs
  const runDetails = runTimes.map((time, idx) => ({
    time,
    pace: time / 1.6, // Each run is 1.6km
    partIndex: runParts[idx],
    runNumber: idx + 1
  })).filter(run => run.time > 0);

  const fastestRun = runDetails.length > 0 ? 
    runDetails.reduce((prev, curr) => prev.pace < curr.pace ? prev : curr) :
    null;

  const slowestRun = runDetails.length > 0 ? 
    runDetails.reduce((prev, curr) => prev.pace > curr.pace ? prev : curr) :
    null;

  // Format pace (converts seconds per km to MM:SS format)
  const formatPace = (paceInSeconds: number): string => {
    if (!paceInSeconds || paceInSeconds === 0) return '--:--';
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.floor(paceInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Vuelta a la clasificación
          </Link>
          <Link
            to={`/participant/${id}/story`}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Crear Story de Instagram
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white uppercase">{participant.name}</h1>
            <div className="text-blue-100 text-sm uppercase">{participant.atletaA}</div>
            <div className="text-blue-100 text-sm uppercase">{participant.atletaB}</div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{category?.label || participant.category}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Medal className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Puesto</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatRank(globalRank)} <span className="text-sm text-gray-500">/ {totalParticipants}</span>
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Tiempo Total</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatTotalTime(participant.totalTime)}
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Puesto General</h3>
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatRank(globalRank)} <span className="text-sm text-gray-500">/ {totalParticipants}</span>
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados RUN</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Timer className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Ritmo medio</h3>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {formatPace(averagePace)} <span className="text-sm text-gray-500">min/km</span>
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Timer className="w-5 h-5 text-orange-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Ritmo más rápido</h3>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {fastestRun ? (
                    <>
                      {formatPace(fastestRun.pace)} <span className="text-sm text-gray-500">min/km ({fastestRun.runNumber}º RUN)</span>
                    </>
                  ) : '--:--'}
                </p>
              </div>

              <div className="bg-rose-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Timer className="w-5 h-5 text-rose-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Ritmo más lento</h3>
                </div>
                <p className="text-2xl font-bold text-rose-600">
                  {slowestRun ? (
                    <>
                      {formatPace(slowestRun.pace)} <span className="text-sm text-gray-500">min/km ({slowestRun.runNumber}º RUN)</span>
                    </>
                  ) : '--:--'}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resultados detallados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {participant.parts.map((part, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium breakold text-gray-700 mb-4">
                    {partNames[index] || `Part ${index + 1}`}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Tiempo</p>
                      <p className="text-lg font-semibold">{formatPartTime(part.time)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Categoría</p>
                      <p className={`text-lg font-semibold ${getRankColor(partRanks[index]?.category)}`}>
                        {formatRank(partRanks[index]?.category)} <span className="text-sm text-gray-500">/ {partRanks[index]?.categoryParticipantCount}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">General</p>
                      <p className={`text-lg font-semibold ${getRankColor(partRanks[index]?.global)}`}>
                        {formatRank(partRanks[index]?.global)} <span className="text-sm text-gray-500">/ {totalParticipants}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetails;