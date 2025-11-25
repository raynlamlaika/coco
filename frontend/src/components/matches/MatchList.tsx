import React from 'react';
import type { Match } from '../../types';
import MatchCard from './MatchCard';

interface MatchListProps {
  matches: Match[];
  onMatchClick?: (match: Match) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const MatchList: React.FC<MatchListProps> = ({
  matches,
  onMatchClick,
  loading = false,
  emptyMessage = 'No matches found'
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-6 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-8" />
              <div className="h-6 bg-gray-200 rounded w-24" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚽</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">Check back later for upcoming fixtures.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <MatchCard
          key={match._id}
          match={match}
          onClick={onMatchClick}
        />
      ))}
    </div>
  );
};

export default MatchList;
