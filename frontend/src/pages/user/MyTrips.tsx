import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getMyTrips, confirmRequest, rejectRequest } from '../../services/tripService';
import { Trip } from '../../types';
import TripCard from '../../components/trips/TripCard';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const MyTrips: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'driver' | 'passenger' | 'requests'>('driver');
  const [trips, setTrips] = useState<{ asDriver: Trip[]; asPassenger: Trip[]; requests: Trip[] }>({
    asDriver: [],
    asPassenger: [],
    requests: []
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await getMyTrips();
      setTrips(data);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRequest = async (tripId: string, userId: string) => {
    setActionLoading(`${tripId}-${userId}`);
    try {
      await confirmRequest(tripId, userId);
      await loadTrips();
    } catch (error) {
      console.error('Failed to confirm request:', error);
      alert('Failed to confirm request');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (tripId: string, userId: string) => {
    setActionLoading(`${tripId}-${userId}`);
    try {
      await rejectRequest(tripId, userId);
      await loadTrips();
    } catch (error) {
      console.error('Failed to reject request:', error);
      alert('Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  const currentTrips = activeTab === 'driver' 
    ? trips.asDriver 
    : activeTab === 'passenger' 
      ? trips.asPassenger 
      : trips.requests;

  const pendingRequestsCount = trips.asDriver.reduce(
    (count, trip) => count + trip.requests.filter(r => r.status === 'pending').length,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
          <p className="text-gray-600">
            Manage your trips and passenger requests.
          </p>
        </div>
        {user?.isDriver && (
          <Link to="/trips/create">
            <Button>
              <FiPlus className="w-4 h-4 mr-2" />
              Create Trip
            </Button>
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-md">
        <button
          onClick={() => setActiveTab('driver')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'driver'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          As Driver ({trips.asDriver.length})
        </button>
        <button
          onClick={() => setActiveTab('passenger')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'passenger'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          As Passenger ({trips.asPassenger.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
            activeTab === 'requests'
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Requests ({trips.requests.length})
          {pendingRequestsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {pendingRequestsCount}
            </span>
          )}
        </button>
      </div>

      {/* Trip List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : currentTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTrips.map(trip => (
            <div key={trip._id}>
              <TripCard
                trip={trip}
                showActions={false}
                onViewDetails={(t) => window.location.href = `/trips/${t._id}`}
              />
              
              {/* Show pending requests for driver's trips */}
              {activeTab === 'driver' && trip.requests.filter(r => r.status === 'pending').length > 0 && (
                <Card className="mt-4">
                  <Card.Header>
                    <h4 className="font-medium text-orange-600">
                      {trip.requests.filter(r => r.status === 'pending').length} Pending Request(s)
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    <div className="space-y-3">
                      {trip.requests
                        .filter(r => r.status === 'pending')
                        .map((request) => {
                          const reqUser = request.user as { _id: string; fullName: string; favouriteTeam: string };
                          return (
                            <div key={reqUser._id} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{reqUser.fullName}</p>
                                <p className="text-sm text-gray-500">{reqUser.favouriteTeam}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleConfirmRequest(trip._id, reqUser._id)}
                                  loading={actionLoading === `${trip._id}-${reqUser._id}`}
                                >
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => handleRejectRequest(trip._id, reqUser._id)}
                                  loading={actionLoading === `${trip._id}-${reqUser._id}`}
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Body className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === 'driver' ? '🚗' : activeTab === 'passenger' ? '🎫' : '📩'}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'driver' 
                ? 'No trips as driver yet'
                : activeTab === 'passenger'
                  ? 'No trips as passenger yet'
                  : 'No pending requests'}
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'driver' 
                ? 'Create a trip to start offering rides'
                : activeTab === 'passenger'
                  ? 'Find trips to join other supporters'
                  : "You haven't requested to join any trips"}
            </p>
            {activeTab === 'driver' && user?.isDriver && (
              <Link to="/trips/create">
                <Button>Create a Trip</Button>
              </Link>
            )}
            {activeTab !== 'driver' && (
              <Link to="/trips">
                <Button>Find Trips</Button>
              </Link>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default MyTrips;
