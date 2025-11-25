import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiMap, FiCalendar } from 'react-icons/fi';
import { getUserStats } from '../../services/userService';
import { getTripStats } from '../../services/tripService';
import { getMatchStats } from '../../services/matchService';
import { UserStats, TripStats, MatchStats } from '../../types';
import StatsCards from '../../components/admin/StatsCards';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AdminDashboard: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [tripStats, setTripStats] = useState<TripStats | null>(null);
  const [matchStats, setMatchStats] = useState<MatchStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, trips, matches] = await Promise.all([
        getUserStats(),
        getTripStats(),
        getMatchStats()
      ]);
      setUserStats(users);
      setTripStats(trips);
      setMatchStats(matches);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Overview of platform activity and management tools.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-4" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <StatsCards
            userStats={userStats || undefined}
            tripStats={tripStats || undefined}
            matchStats={matchStats || undefined}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Body className="text-center">
            <FiUsers className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Users</h3>
            <p className="text-gray-600 mb-4">
              View, edit, ban, or promote users
            </p>
            <Link to="/admin/users">
              <Button>View Users</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="text-center">
            <FiMap className="w-12 h-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Trips</h3>
            <p className="text-gray-600 mb-4">
              Monitor and manage all trips
            </p>
            <Link to="/admin/trips">
              <Button variant="secondary">View Trips</Button>
            </Link>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="text-center">
            <FiCalendar className="w-12 h-12 mx-auto text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Matches</h3>
            <p className="text-gray-600 mb-4">
              Create and manage football matches
            </p>
            <Link to="/admin/matches">
              <Button variant="outline">View Matches</Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
