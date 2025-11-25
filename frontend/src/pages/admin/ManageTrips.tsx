import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw } from 'react-icons/fi';
import { getTrips, deleteTrip } from '../../services/tripService';
import { Trip, PaginatedResponse } from '../../types';
import TripTable from '../../components/admin/TripTable';
import Button from '../../components/common/Button';

const ManageTrips: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<PaginatedResponse<Trip> | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadTrips();
  }, [page, statusFilter]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await getTrips({
        status: statusFilter || undefined,
        page,
        limit: 10
      });
      setTrips(data);
    } catch (error) {
      console.error('Failed to load trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (trip: Trip) => {
    navigate(`/trips/${trip._id}`);
  };

  const handleDelete = async (trip: Trip) => {
    if (!confirm(`Are you sure you want to delete this trip?`)) return;
    
    try {
      await deleteTrip(trip._id);
      loadTrips();
    } catch (error) {
      console.error('Failed to delete trip:', error);
      alert('Failed to delete trip');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Trips</h1>
        <p className="text-gray-600">
          View and manage all platform trips.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <Button variant="outline" onClick={loadTrips}>
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Trip Table */}
      <TripTable
        trips={trips?.data || []}
        loading={loading}
        onView={handleView}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {trips && trips.pages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {trips.page} of {trips.pages} ({trips.total} total trips)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === trips.pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTrips;
