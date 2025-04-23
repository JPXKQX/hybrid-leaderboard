import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LeaderboardContainer from './components/LeaderboardContainer';
import ParticipantDetails from './components/ParticipantDetails';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<LeaderboardContainer />} />
          <Route path="/participant/:id" element={<ParticipantDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;