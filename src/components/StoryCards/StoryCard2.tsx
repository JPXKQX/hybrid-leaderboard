import React from 'react';
import logo from '../../assets/logo.png';

interface StoryCard2Props {
  name: string;
  score: number | string;
  rank: number;
  total: number;
}

const StoryCard2: React.FC<StoryCard2Props> = ({
  name,
  score,
  rank,
  total,
}) => {
  return (
    <div
      id="story-card"
      className="w-[360px] h-[640px] bg-gradient-to-br from-purple-600 to-pink-500 text-white font-sans flex flex-col items-center justify-between p-6 rounded-2xl shadow-2xl"
    >
      {/* Header */}
      <div className="text-center mt-4">
        <h2 className="text-xl font-semibold uppercase">🏆 Fitness Challenge</h2>
        <p className="text-sm opacity-80">Week 3 Leaderboard</p>
      </div>

      {/* Avatar */}
      <div className="w-32 h-32 overflow-hidden shadow-lg">
        <img
          src={logo}
          alt="Participant Avatar"
          className="w-full h-full"
        />
      </div>

      {/* Info */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold">{name}</h1>
        <p className="text-lg mt-1">
          💪 Score: <strong>{score}</strong>
        </p>
        <p className="text-lg">
          🥇 Rank: <strong>#{rank} / {total}</strong>
        </p>
      </div>

      {/* Footer */}
      <div className="text-center text-sm opacity-90 mt-2">
        <p>📍 Santander Crossfit </p>
        <p className="italic">"Stronger Every Day"</p>
      </div>

      <div className="text-center text-xs uppercase opacity-80 mt-4">
        <p>#hybridcompetition #community </p>
        <p>@santandercrossfit</p>
      </div>
    </div>
  );
};

export default StoryCard2
