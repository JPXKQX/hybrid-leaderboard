import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import html2canvas from 'html2canvas';
import StoryCard1 from './StoryCards/StoryCard1';
import { useParticipant } from '../hooks/useParticipant';
import { formatRank } from '../utils/formatters';


const InstagramStory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { participant, category, totalParticipants, globalRank } = useParticipant(id);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleDownloadStory = async () => {
    const element = document.getElementById('story-card');
    if (!element) return;
  
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
    });
  
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `hybrid2025-santander-crossfit-${participant?.name}.png`;
    link.click();
  };

  if (!participant) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Participante no encontrado</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 text-blue-600 hover:text-blue-800 inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  const storyCards = [
    <StoryCard1
      key="summary"
      name={participant.name}
      time={participant.totalTime}
      rank={globalRank}
      total={totalParticipants}
    />,
    <StoryCard1
      key="ranking"
      name={participant.name}
      time={`#${globalRank} / ${totalParticipants}`}
      rank={globalRank}
      total={totalParticipants}
    />,
    <StoryCard1
      key="achievement"
      name={participant.name}
      time="🔥 Completed All Challenges!"
      rank={globalRank}
      total={totalParticipants}
    />,
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % storyCards.length);
  };
  
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + storyCards.length) % storyCards.length
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
          <button
            onClick={handleDownloadStory}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Descargar Story
          </button>
        </div>

        <div className="text-center mt-6 text-gray-600">
          <ol className="list-decimal list-inside space-y-1">
            <li>Desliza hasta encontrar la Story que más te gusta.</li>
            <li>Haz click en "Descargar Story" para guardar la imagen en tu dispositivo.</li>
            <li>Entra a Instagram y comparte la imagen descargada.</li>
          </ol>
        </div>
        
        <div className="w-full flex justify-center transition-all duration-300">
          {storyCards[currentIndex]}
        </div>
    
        <div className="w-full flex justify-center space-x-4">
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            ⬅️ Anterior
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Siguiente ➡️
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstagramStory;