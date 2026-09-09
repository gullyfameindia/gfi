


import React, { createContext, useContext, useState, useCallback } from 'react';
import { competitionService } from '../api/services/competitionService';

export interface Competition {
  id: string;
  title: string;
  description: string;
  image?: string;
  participants?: number;
  prize?: string;
  status?: 'active' | 'upcoming' | 'ended';
  startDate?: string;
  endDate?: string;
  rules?: string;
}

interface CompetitionContextType {
  
  competitions: Competition[];
  filteredCompetitions: Competition[];
  selectedCompetition: Competition | null;
  loading: boolean;
  error: string | null;

  
  searchQuery: string;
  selectedFilter: 'all' | 'active' | 'upcoming' | 'ended';

  
  fetchCompetitions: () => Promise<void>;
  fetchCompetitionById: (id: string) => Promise<Competition | null>;
  setSearchQuery: (query: string) => void;
  setSelectedFilter: (filter: 'all' | 'active' | 'upcoming' | 'ended') => void;
  filterCompetitions: () => void;
  clearFilters: () => void;
  clearError: () => void;
}

const CompetitionContext = createContext<CompetitionContextType | undefined>(undefined);

export const CompetitionProvider = ({ children }: { children: React.ReactNode }) => {
  
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'upcoming' | 'ended'>('all');

  
  const fetchCompetitions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await competitionService.getCompetitions();

      if (result.success && result.data) {
        setCompetitions(result.data);
        filterCompetitions();
      } else {
        setError(result.error || 'Failed to fetch competitions');
      }
    } catch (err: any) {
      console.error('Error fetching competitions:', err);
      setError(err.message || 'Failed to fetch competitions');
    } finally {
      setLoading(false);
    }
  }, []);

  
  const fetchCompetitionById = useCallback(
    async (id: string): Promise<Competition | null> => {
      try {
        setLoading(true);
        setError(null);

        
        const existing = competitions.find((c) => c.id === id);
        if (existing) {
          setSelectedCompetition(existing);
          return existing;
        }

        
        const result = await competitionService.getCompetitions();
        if (result.success && result.data) {
          const competition = result.data.find((c) => c.id === id);
          if (competition) {
            setSelectedCompetition(competition);
            return competition;
          }
        }

        setError('Competition not found');
        return null;
      } catch (err: any) {
        console.error('Error fetching competition:', err);
        setError(err.message || 'Failed to fetch competition');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [competitions]
  );

  
  const filterCompetitions = useCallback(() => {
    let filtered = competitions;

    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((comp) => comp.status === selectedFilter);
    }

    
    if (searchQuery.trim()) {
      filtered = filtered.filter((comp) =>
        comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCompetitions(filtered);
  }, [competitions, searchQuery, selectedFilter]);

  
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedFilter('all');
    setFilteredCompetitions(competitions);
  }, [competitions]);

  
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  
  React.useEffect(() => {
    filterCompetitions();
  }, [searchQuery, selectedFilter, competitions, filterCompetitions]);

  const value: CompetitionContextType = {
    
    competitions,
    filteredCompetitions,
    selectedCompetition,
    loading,
    error,

    
    searchQuery,
    selectedFilter,

    
    fetchCompetitions,
    fetchCompetitionById,
    setSearchQuery,
    setSelectedFilter,
    filterCompetitions,
    clearFilters,
    clearError,
  };

  return (
    <CompetitionContext.Provider value={value}>
      {children}
    </CompetitionContext.Provider>
  );
};


export const useCompetition = () => {
  const context = useContext(CompetitionContext);
  if (context === undefined) {
    throw new Error('useCompetition must be used within CompetitionProvider');
  }
  return context;
};
