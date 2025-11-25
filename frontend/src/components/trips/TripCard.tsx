import React from 'react';
import { FiMapPin, FiClock, FiUsers, FiStar } from 'react-icons/fi';
import type { Trip } from '../../types';
import { formatDate, formatTime, getStatusColor } from '../../utils/helpers';
import Card from '../common/Card';
import Button from '../common/Button';

interface TripCardProps {
  trip: Trip;
  onViewDetails?: (trip: Trip) => void;
  onRequestJoin?: (trip: Trip) => void;
  showActions?: boolean;
  recommended?: boolean;
  score?: number;
}

const TripCard: React.FC<TripCardProps> = ({
  trip,
  onViewDetails,
  onRequestJoin,
  showActions = true,
  recommended = false,
  score
}) => {
  return (
    <Card
      className={`${recommended ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
      hoverable
      onClick={() => onViewDetails?.(trip)}
    >
      <Card.Body>
        {/* Header with match info */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {trip.match.homeTeam} vs {trip.match.awayTeam}
            </h3>
            <p className="text-sm text-gray-500">{trip.match.competition}</p>
          </div>
          <div className="flex items-center gap-2">
            {recommended && score && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                <FiStar className="w-3 h-3" />
                {score}% match
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(trip.status)}`}>
              {trip.status}
            </span>
          </div>
        </div>

        {/* Driver info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white font-medium">
            {trip.driver.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{trip.driver.fullName}</p>
            <p className="text-sm text-gray-500">{trip.driver.favouriteTeam} supporter</p>
          </div>
        </div>

        {/* Trip details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <FiMapPin className="w-4 h-4 text-blue-500" />
            <span className="text-sm">From: {trip.departureLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FiClock className="w-4 h-4 text-green-500" />
            <span className="text-sm">
              {formatDate(trip.departureTime, 'EEE, MMM d')} at {formatTime(trip.departureTime)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FiUsers className="w-4 h-4 text-orange-500" />
            <span className="text-sm">
              {trip.availableSeats} seat{trip.availableSeats !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>

        {/* Vehicle preferences */}
        <div className="flex gap-2 mt-4">
          {!trip.preferences.smoking && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              No smoking
            </span>
          )}
          {trip.preferences.music && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              Music OK
            </span>
          )}
          {trip.preferences.conversation && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              Chatty
            </span>
          )}
        </div>

        {/* Vehicle info */}
        {trip.vehicleInfo.make && (
          <p className="text-xs text-gray-500 mt-3">
            🚗 {trip.vehicleInfo.color} {trip.vehicleInfo.make} {trip.vehicleInfo.model}
          </p>
        )}
      </Card.Body>

      {showActions && trip.availableSeats > 0 && trip.status !== 'cancelled' && (
        <Card.Footer className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(trip);
            }}
          >
            View Details
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRequestJoin?.(trip);
            }}
          >
            Request to Join
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
};

export default TripCard;
