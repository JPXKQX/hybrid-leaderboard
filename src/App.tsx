import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LeaderboardContainer from './components/LeaderboardContainer';
import ParticipantDetails from './components/ParticipantDetails';
import PartStatistics from './components/PartStatistics';
import InstagramStory from './components/InstagramStory';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<LeaderboardContainer />} />
          <Route path="/participant/:id" element={<ParticipantDetails />} />
          <Route path="/participant/:id/story" element={<InstagramStory />} />
          <Route path="/part/:partIndex" element={<PartStatistics />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App