import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Clock, Medal } from 'lucide-react';
import { useParticipant } from '../hooks/useParticipant';
import { formatPartTime, formatTotalTime, formatRank } from '../utils/formatters';

const ParticipantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const participant = useParticipant(id);

  if (!participant) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Participant not found</p>
          <Link to="/" className="mt-4 text-blue-600 hover:text-blue-800 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leaderboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Leaderboard
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{participant.name}</h1>
            <p className="text-blue-100">{participant.category}</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Overall Rank</h3>
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatRank(participant.totalRank)}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Total Time</h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatTotalTime(participant.totalTime || 0)}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Medal className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Best Rank</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatRank(Math.min(...participant.parts.map(p => p.rank || Infinity)))}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Part Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {participant.parts.map((part, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-700 mb-2">Part {index + 1}</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="text-lg font-semibold">{formatPartTime(part.time)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Rank</p>
                      <p className="text-lg font-semibold">{formatRank(part.rank)}</p>
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