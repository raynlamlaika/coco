import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMap, FiPlus, FiCalendar, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getMyTrips } from '../../services/tripService';
import { getUpcomingMatches } from '../../services/matchService';
import type { Trip, Match } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import TripCard from '../../components/trips/TripCard';
import MatchCard from '../../components/matches/MatchCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<{ asDriver: Trip[]; asPassenger: Trip[] }>({ asDriver: [], asPassenger: [] });
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tripsData, matchesData] = await Promise.all([
          getMyTrips(),
          getUpcomingMatches(3)
        ]);
        setTrips(tripsData);
        setMatches(matchesData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const upcomingTrips = [...trips.asDriver, ...trips.asPassenger]
    .filter(t => new Date(t.departureTime) > new Date() && t.status !== 'cancelled')
    .sort((a, b) => new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime())
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.fullName.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your trips and matches.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <Card.Body className="text-center">
            <FiCalendar className="w-8 h-8 mx-auto text-blue-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{upcomingTrips.length}</p>
            <p className="text-sm text-gray-500">Upcoming Trips</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <FiMap className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{trips.asDriver.length}</p>
            <p className="text-sm text-gray-500">Trips as Driver</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <FiUsers className="w-8 h-8 mx-auto text-orange-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900">{trips.asPassenger.length}</p>
            <p className="text-sm text-gray-500">Trips as Passenger</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="text-center">
            <span className="text-3xl mb-2 block">⚽</span>
            <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
            <p className="text-sm text-gray-500">Upcoming Matches</p>
          </Card.Body>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link to="/trips">
          <Button variant="outline">
            <FiMap className="w-4 h-4 mr-2" />
            Find a Trip
          </Button>
        </Link>
        {user?.isDriver && (
          <Link to="/trips/create">
            <Button>
              <FiPlus className="w-4 h-4 mr-2" />
              Create a Trip
            </Button>
          </Link>
        )}
        <Link to="/my-trips">
          <Button variant="outline">
            <FiCalendar className="w-4 h-4 mr-2" />
            View My Trips
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Trips */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Upcoming Trips</h2>
            <Link to="/my-trips" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(n => (
                <div key={n} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : upcomingTrips.length > 0 ? (
            <div className="space-y-4">
              {upcomingTrips.map(trip => (
                <TripCard key={trip._id} trip={trip} showActions={false} />
              ))}
            </div>
          ) : (
            <Card>
              <Card.Body className="text-center py-8">
                <div className="text-4xl mb-4">🚗</div>
                <p className="text-gray-600 mb-4">No upcoming trips yet</p>
                <Link to="/trips">
                  <Button>Find a Trip</Button>
                </Link>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* Upcoming Matches */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Matches</h2>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(n => (
                <div key={n} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map(match => (
                <MatchCard key={match._id} match={match} />
              ))}
            </div>
          ) : (
            <Card>
              <Card.Body className="text-center py-8">
                <div className="text-4xl mb-4">⚽</div>
                <p className="text-gray-600">No upcoming matches</p>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
