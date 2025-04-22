import React, { useState, useEffect } from 'react';
import LeaderboardHeader from './LeaderboardHeader';
import CategorySelector from './CategorySelector';
import SearchBar from './SearchBar';
import LeaderboardTable from './LeaderboardTable';
import { fetchLeaderboardData } from '../services/googleSheetsService';
import { Participant, Category } from '../types';

const LeaderboardContainer: React.FC = () => {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [allParticipants, setAllParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch data from Google Sheets
        const fetchedData = await fetchLeaderboardData();
        setData(fetchedData);
        setAllParticipants(fetchedData.participants);
        setFilteredParticipants(fetchedData.participants);
        setCategories(fetchedData.categories);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load leaderboard data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter participants when category or search term changes
  useEffect(() => {
    let result = allParticipants;
    
    // Apply category filter
    if (selectedCategory) {
      const categoryName = categories.find(c => c.id === selectedCategory)?.name;
      if (categoryName) {
        result = result.filter(p => p.category === categoryName);
      }
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term)
      );
    }
    
    setFilteredParticipants(result);
  }, [selectedCategory, searchTerm, allParticipants, categories]);

  const handleCategorySelect = (categoryId?: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading leaderboard data...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <LeaderboardHeader />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <CategorySelector 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
          />
        </div>
        
        <LeaderboardTable 
          participants={filteredParticipants}
          searchTerm={searchTerm}
          partNames={data?.partNames || []}
        />
        
        <div className="mt-4 text-sm text-center">
          <span className="text-gray-500">
            Powered by <span className="font-bold text-green-600">Santander CrossFit</span> | Competición Híbrida 2025
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardContainer;