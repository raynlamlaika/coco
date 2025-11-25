import React from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import type { Trip } from '../../types';
import { formatDate, formatTime, getStatusColor, getInitials } from '../../utils/helpers';
import Button from '../common/Button';

interface TripTableProps {
  trips: Trip[];
  onView?: (trip: Trip) => void;
  onDelete?: (trip: Trip) => void;
  loading?: boolean;
}

const TripTable: React.FC<TripTableProps> = ({
  trips,
  onView,
  onDelete,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="text-4xl mb-4">🚗</div>
        <p className="text-gray-500">No trips found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Match
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trips.map((trip) => (
              <tr key={trip._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white font-medium">
                      {getInitials(trip.driver.fullName)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{trip.driver.fullName}</p>
                      <p className="text-sm text-gray-500">{trip.driver.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-medium text-gray-900">
                    {trip.match.homeTeam} vs {trip.match.awayTeam}
                  </p>
                  <p className="text-sm text-gray-500">{trip.match.competition}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-gray-900">{trip.departureLocation}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(trip.departureTime, 'MMM d')} at {formatTime(trip.departureTime)}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-gray-900">
                    {trip.passengers.length} / {trip.availableSeats + trip.passengers.length}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView?.(trip)}
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete?.(trip)}
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripTable;
