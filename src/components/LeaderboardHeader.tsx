import React from 'react';
import logo from '../assets/images/logo.png';

const LeaderboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="flex items-center justify-center">
        <img src={logo} alt="Logo" className="w-12 h-12 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">Hybrid Santander CrossFit 2025</h1>
      </div>
      <p className="text-gray-600 text-center max-w-2xl">
        Clasificación en directo de todas las pruebas.
      </p>
    </div>
  );
};

export default LeaderboardHeader;