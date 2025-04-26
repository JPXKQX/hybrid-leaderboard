import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { ArrowLeft, ArrowRight, ArrowLeftCircle } from 'lucide-react';
import { useParticipant } from '../hooks/useParticipant';
import { formatPartTime } from '../utils/formatters';
import { getRankColor, getRankBg } from '../utils/rankingStyles';

interface PodiumProps {
  category: string;
  participants: Array<{
    name: string;
    time: number;
    rank: number;
  }>;
  isRun?: boolean;
}

const formatPace = (timeInSeconds: number, showUnits: boolean = true): string => {
  if (!timeInSeconds) return '--:--';
  const paceInSeconds = timeInSeconds / 1.6;
  const minutes = Math.floor(paceInSeconds / 60);
  const seconds = Math.floor(paceInSeconds % 60);
  const pace = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  return showUnits ? `${pace} min/km` : pace;
};

const Podium: React.FC<PodiumProps> = React.memo(({ category, participants, isRun }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">{category}</h3>
      <div className="space-y-2">
        {participants.map((participant, index) => (
          <div 
            key={index} 
            className={`flex items-center justify-between p-2 rounded ${getRankBg(participant.rank, index)}`}
          >
            <div className="flex items-center">
              <span className={`text-lg font-bold mr-3 ${getRankColor(participant.rank)}`}>
                {participant.rank}º
              </span>
              <span className="font-medium">{participant.name}</span>
            </div>
            <span className="font-mono">
              {isRun ? formatPace(participant.time, true) : formatPartTime(participant.time)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

const PartStatistics: React.FC = () => {
  const { partIndex } = useParams<{ partIndex: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useParticipant(undefined);
  
  const currentIndex = parseInt(partIndex || '0');
  
  const { plotData, podiumData, partName, isRun, xAxisConfig } = useMemo(() => {
    if (!data) {
      return { plotData: [], podiumData: [], partName: '', isRun: false, xAxisConfig: {} };
    }
    
    const partName = data.partNames[currentIndex] || `Part ${currentIndex + 1}`;
    const isRun = partName.toLowerCase().includes('run');
    
    // Create legend data for category levels
    const levelMarkers = [
      { name: 'RX', symbol: 'circle' },
      { name: 'OPEN', symbol: 'square' },
      { name: 'SCALED', symbol: 'diamond' }
    ];
    
    // Get all times for x-axis configuration
    const allTimes = data.participants
      .flatMap(p => p.parts[currentIndex]?.time || 0)
      .filter(t => t > 0)
      .sort((a, b) => a - b);

    const minTime = Math.min(...allTimes);
    const maxTime = Math.max(...allTimes);
    const timeRange = maxTime - minTime;
    const tickCount = 10;
    const tickStep = timeRange / (tickCount - 1);
    
    const tickvals = Array.from({ length: tickCount }, (_, i) => 
      Math.round(minTime + (i * tickStep))
    );
    
    const ticktext = tickvals.map(x => 
      isRun ? formatPace(x, false) : formatPartTime(x)
    );
    
    // Prepare data for the strip plot
    const plotData = [
      // Add invisible traces for the legend
      ...levelMarkers.map(marker => ({
        x: [null],
        y: [null],
        type: 'scatter' as const,
        mode: 'markers' as const,
        name: marker.name,
        marker: {
          symbol: marker.symbol,
          size: 10,
          color: '#666666'
        },
        showlegend: true
      })),
      // Add actual data traces without legends
      ...data.categories.map(category => {
        const categoryParticipants = data.participants
          .filter(p => p.category === category.id);
          
        return {
          x: categoryParticipants
            .map(p => p.parts[currentIndex]?.time || 0)
            .filter(t => t > 0),
          y: Array(categoryParticipants.length).fill(category.sex === 'fem' ? 1 : 0)
            .map(() => Math.random() * 0.4 - 0.2 + (category.sex === 'fem' ? 1 : 0)),
          text: categoryParticipants
            .filter(p => p.parts[currentIndex]?.time > 0)
            .map(p => p.name),
          type: 'scatter' as const,
          mode: 'markers' as const,
          name: category.label,
          marker: {
            symbol: category.level === 'rx' ? 'circle' : category.level === 'open' ? 'square' : 'diamond',
            size: 10,
            color: category.sex === 'fem' ? '#e83e8c' : '#007bff'
          },
          hovertemplate: isRun ? 
            '%{customdata} min/km<br>%{text}<extra></extra>' : 
            '%{customdata}<br>%{text}<extra></extra>',
          customdata: categoryParticipants
            .map(p => p.parts[currentIndex]?.time || 0)
            .filter(t => t > 0)
            .map(t => isRun ? formatPace(t, false) : formatPartTime(t)),
          showlegend: false
        };
      })
    ];

    // Prepare podium data for each category
    const podiumData = data.categories.map(category => {
      const categoryParticipants = data.participants
        .filter(p => p.category === category.id)
        .map(p => ({
          name: p.name,
          time: p.parts[currentIndex]?.time || 0,
          rank: 0,
        }))
        .filter(p => p.time > 0)
        .sort((a, b) => a.time - b.time)
        .slice(0, 3)
        .map((p, idx) => ({ ...p, rank: idx + 1 }));

      return {
        category: category.label,
        participants: categoryParticipants,
      };
    });

    return { 
      plotData, 
      podiumData, 
      partName, 
      isRun,
      xAxisConfig: {
        tickvals,
        ticktext,
        range: [minTime - tickStep/2, maxTime + tickStep/2]
      }
    };
  }, [data, currentIndex]);

  const handleNavigation = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (data && newIndex >= 0 && newIndex < data.partNames.length) {
      navigate(`/part/${newIndex}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-600 mb-4">Failed to load statistics</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Volver a la clasificación
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeftCircle className="w-5 h-5 mr-2" />
            Volver a la clasificación
          </Link>
          <div className="flex space-x-4">
            <button
              onClick={() => handleNavigation('prev')}
              disabled={currentIndex === 0}
              className={`flex items-center ${currentIndex === 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Anterior
            </button>
            <button
              onClick={() => handleNavigation('next')}
              disabled={currentIndex === data.partNames.length - 1}
              className={`flex items-center ${currentIndex === data.partNames.length - 1 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
            >
              Siguiente
              <ArrowRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-center mb-8">{partName}</h1>
          <div className="w-full h-[400px]">
            <Plot
              data={plotData}
              layout={{
                title: '',
                xaxis: { 
                  title: isRun ? 'Ritmo (min/km)' : 'Tiempo (MM:SS)',
                  tickformat: undefined,
                  ticktext: xAxisConfig.ticktext,
                  tickvals: xAxisConfig.tickvals,
                  range: xAxisConfig.range,
                },
                yaxis: { 
                  title: '',
                  ticktext: ['Masculino', 'Femenino'],
                  tickvals: [0, 1],
                  range: [-0.5, 1.5],
                  zeroline: false,
                  tickangle: 90
                },
                showlegend: true,
                legend: { 
                  orientation: 'h',
                  y: 1.2,
                  x: 0.5,
                  xanchor: 'center',
                  title: { text: 'Nivel', font: {size: 16} }
                },
                margin: { t: 50, r: 20, b: 100, l: 50 },
              }}
              useResizeHandler
              className="w-full h-full"
              config={{ responsive: true }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podiumData.map((data, index) => (
            <Podium key={index} {...data} isRun={isRun} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartStatistics;