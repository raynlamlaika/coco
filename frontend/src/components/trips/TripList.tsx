import React from 'react';
import type { Trip } from '../../types';
import TripCard from './TripCard';

interface TripListProps {
  trips: Trip[];
  onViewDetails?: (trip: Trip) => void;
  onRequestJoin?: (trip: Trip) => void;
  showActions?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

const TripList: React.FC<TripListProps> = ({
  trips,
  onViewDetails,
  onRequestJoin,
  showActions = true,
  loading = false,
  emptyMessage = 'No trips found'
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚗</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">Check back later or try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <TripCard
          key={trip._id}
          trip={trip}
          onViewDetails={onViewDetails}
          onRequestJoin={onRequestJoin}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export default TripList;
