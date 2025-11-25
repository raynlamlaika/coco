import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter, FiSearch } from 'react-icons/fi';
import type { Trip, Match } from '../../types';
import { getTrips, requestToJoin } from '../../services/tripService';
import { getUpcomingMatches } from '../../services/matchService';
import TripList from '../../components/trips/TripList';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const FindTrips: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    match: '',
    departureLocation: '',
    status: 'pending,confirmed'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    loadTrips();
  }, [filters.match]);

  const loadMatches = async () => {
    try {
      const data = await getUpcomingMatches(20);
      setMatches(data);
    } catch (error) {
      console.error('Failed to load matches:', error);
    }
  };

  const loadTrips = async () => {
    setLoading(true);
    try {
      const response = await getTrips({
        match: filters.match || undefined,
        status: 'pending',
        limit: 50
      });
      // Filter for trips with available seats
      const availableTrips = response.data.filter(t => t.availableSeats > 0);
      setTrips(availableTrips);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (trip: Trip) => {
    navigate(`/trips/${trip._id}`);
  };

  const handleRequestJoin = async (trip: Trip) => {
    setRequestLoading(trip._id);
    try {
      await requestToJoin(trip._id);
      // Update the trip in the list
      setTrips(prev => prev.map(t => 
        t._id === trip._id 
          ? { ...t, requests: [...t.requests, { user: 'pending', status: 'pending', requestedAt: new Date().toISOString() }] }
          : t
      ));
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Failed to request join:', error);
      alert('Failed to send request. Please try again.');
    } finally {
      setRequestLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Trip</h1>
        <p className="text-gray-600">
          Browse available trips and request to join fellow supporters heading to the match.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          {/* Match Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Match
            </label>
            <select
              value={filters.match}
              onChange={(e) => setFilters(prev => ({ ...prev, match: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Matches</option>
              {matches.map(match => (
                <option key={match._id} value={match._id}>
                  {match.homeTeam} vs {match.awayTeam} - {new Date(match.matchDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Location Search */}
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Departure Location"
              placeholder="Search by location..."
              value={filters.departureLocation}
              onChange={(e) => setFilters(prev => ({ ...prev, departureLocation: e.target.value }))}
              leftIcon={<FiSearch />}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex items-end">
            <Button onClick={loadTrips}>
              Search
            </Button>
          </div>
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={true}
                />
                <span className="text-sm text-gray-600">Show only with available seats</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {trips.length} trip{trips.length !== 1 ? 's' : ''} available
        </h2>
      </div>

      <TripList
        trips={trips.filter(t => 
          !filters.departureLocation || 
          t.departureLocation.toLowerCase().includes(filters.departureLocation.toLowerCase())
        )}
        loading={loading || !!requestLoading}
        onViewDetails={handleViewDetails}
        onRequestJoin={handleRequestJoin}
        emptyMessage={filters.match ? "No trips found for this match" : "No trips available"}
      />
    </div>
  );
};

export default FindTrips;
