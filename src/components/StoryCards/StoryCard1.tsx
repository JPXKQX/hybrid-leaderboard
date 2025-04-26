import React from 'react';
import logo from '../../assets/images/logo.png';
import { formatPartTime, formatTotalTime, formatRank } from '../../utils/formatters';

interface StoryCard1Props {
  name: string;
  time: number | string;
  rank: number;
  total: number;
}

const StoryCard1: React.FC<StoryCard1Props> = ({
  name,
  time,
  rank,
  total,
}) => {
  return (
    <div
      id="story-card"
      className="w-[360px] h-[640px] bg-gradient-to-br text-black font-sans flex flex-col items-center justify-between p-6 rounded-2xl shadow-2xl"
    >
      {/* Header */}
      <div className="text-center mt-4">
        <h2 className="text-xl font-semibold uppercase">🏆 Hybrid Competition 2025</h2>
        <p className="text-sm opacity-80">10 Mayo</p>
      </div>

      {/* Avatar */}
      <div className="w-32 h-32 overflow-hidden shadow-lg">
        <img
          src={logo}
          alt="Hybrid Logo"
          className="w-full h-full"
        />
      </div>

      {/* Info */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold">{name}</h1>
        <p className="text-lg mt-1">
          💪 Tiempo Total: <strong>{formatTotalTime(time)}</strong>
        </p>
        <p className="text-lg">
          🥇 Puesto: <strong>#{rank} / {total}</strong>
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-sm opacity-90 mt-2">
        <p className="font-bold text-green-600">📍Santander CrossFit </p>
        <p className="italic">"Stronger Every Day"</p>
      </div>

      <div className="text-center text-xs uppercase opacity-80 mt-4">
        <p>#hybridcompetition #community </p>
        <p>@santandercrossfit</p>
      </div>
    </div>
  );
};

export default StoryCard1
