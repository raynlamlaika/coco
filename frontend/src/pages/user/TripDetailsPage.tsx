import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTripById, requestToJoin, confirmRequest, rejectRequest, updateTrip, getTripRecommendations } from '../../services/tripService';
import type { Trip, TripRecommendation } from '../../types';
import TripDetails from '../../components/trips/TripDetails';
import GroupSuggestions from '../../components/trips/GroupSuggestions';
import Button from '../../components/common/Button';
import { FiArrowLeft } from 'react-icons/fi';

const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [recommendations, setRecommendations] = useState<TripRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadTrip();
    }
  }, [id]);

  const loadTrip = async () => {
    setLoading(true);
    try {
      const data = await getTripById(id!);
      setTrip(data);

      // Load recommendations if user is the driver
      if (data.driver._id === user?._id) {
        try {
          const recs = await getTripRecommendations(id!);
          setRecommendations(recs);
        } catch {
          // Recommendations are optional
        }
      }
    } catch (err) {
      console.error('Failed to load trip:', err);
      setError('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestJoin = async () => {
    setActionLoading(true);
    try {
      await requestToJoin(id!);
      await loadTrip();
    } catch (err) {
      console.error('Failed to request join:', err);
      setError('Failed to send request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmRequest = async (userId: string) => {
    setActionLoading(true);
    try {
      await confirmRequest(id!, userId);
      await loadTrip();
    } catch (err) {
      console.error('Failed to confirm request:', err);
      setError('Failed to confirm request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (userId: string) => {
    setActionLoading(true);
    try {
      await rejectRequest(id!, userId);
      await loadTrip();
    } catch (err) {
      console.error('Failed to reject request:', err);
      setError('Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelTrip = async () => {
    if (!confirm('Are you sure you want to cancel this trip?')) return;
    
    setActionLoading(true);
    try {
      await updateTrip(id!, { status: 'cancelled' });
      await loadTrip();
    } catch (err) {
      console.error('Failed to cancel trip:', err);
      setError('Failed to cancel trip');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "We couldn't find the trip you're looking for."}</p>
          <Button onClick={() => navigate('/trips')}>
            Browse Trips
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back
      </button>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <TripDetails
        trip={trip}
        currentUser={user}
        onRequestJoin={handleRequestJoin}
        onConfirmRequest={handleConfirmRequest}
        onRejectRequest={handleRejectRequest}
        onCancelTrip={handleCancelTrip}
        loading={actionLoading}
      />

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-8">
          <GroupSuggestions recommendations={recommendations} />
        </div>
      )}
    </div>
  );
};

export default TripDetailsPage;
