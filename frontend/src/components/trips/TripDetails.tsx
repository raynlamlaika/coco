import React from 'react';
import { FiMapPin, FiClock, FiUsers, FiCheck, FiX, FiMessageCircle } from 'react-icons/fi';
import type { Trip, User } from '../../types';
import { formatDate, formatTime, getStatusColor, getInitials } from '../../utils/helpers';
import Card from '../common/Card';
import Button from '../common/Button';

interface TripDetailsProps {
  trip: Trip;
  currentUser?: User | null;
  onRequestJoin?: () => void;
  onConfirmRequest?: (userId: string) => void;
  onRejectRequest?: (userId: string) => void;
  onCancelTrip?: () => void;
  loading?: boolean;
}

const TripDetails: React.FC<TripDetailsProps> = ({
  trip,
  currentUser,
  onRequestJoin,
  onConfirmRequest,
  onRejectRequest,
  onCancelTrip,
  loading = false
}) => {
  const isDriver = currentUser?._id === trip.driver._id;
  const isPassenger = trip.passengers.some(p => p._id === currentUser?._id);
  const hasPendingRequest = trip.requests.some(
    r => (typeof r.user === 'object' ? r.user._id : r.user) === currentUser?._id && r.status === 'pending'
  );
  const canRequest = !isDriver && !isPassenger && !hasPendingRequest && trip.availableSeats > 0 && trip.status !== 'cancelled';

  return (
    <div className="space-y-6">
      {/* Match Info */}
      <Card>
        <Card.Body>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {trip.match.homeTeam} vs {trip.match.awayTeam}
              </h2>
              <p className="text-gray-500">{trip.match.competition}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${getStatusColor(trip.status)}`}>
              {trip.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
            <div className="flex items-center gap-2">
              <FiMapPin className="w-5 h-5 text-blue-500" />
              <span>{trip.match.stadium}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="w-5 h-5 text-green-500" />
              <span>{formatDate(trip.match.matchDate, 'PPp')}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiMapPin className="w-5 h-5 text-orange-500" />
              <span>Entry: {trip.match.entryCenter}</span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Trip Details */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Trip Details</h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Departure Location</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <FiMapPin className="text-blue-500" />
                  {trip.departureLocation}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Departure Time</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <FiClock className="text-green-500" />
                  {formatDate(trip.departureTime, 'EEEE, MMMM d')} at {formatTime(trip.departureTime)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Available Seats</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <FiUsers className="text-orange-500" />
                  {trip.availableSeats} of {trip.availableSeats + trip.passengers.length} seats available
                </p>
              </div>
            </div>

            {/* Vehicle Info */}
            {trip.vehicleInfo.make && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">🚗 Vehicle</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Make:</span> {trip.vehicleInfo.make}</p>
                  <p><span className="text-gray-500">Model:</span> {trip.vehicleInfo.model}</p>
                  <p><span className="text-gray-500">Color:</span> {trip.vehicleInfo.color}</p>
                  <p><span className="text-gray-500">Plate:</span> {trip.vehicleInfo.plateNumber}</p>
                </div>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-3">Preferences</h4>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${trip.preferences.smoking ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {trip.preferences.smoking ? '🚬 Smoking OK' : '🚭 No Smoking'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${trip.preferences.music ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                {trip.preferences.music ? '🎵 Music OK' : '🔇 No Music'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${trip.preferences.conversation ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                {trip.preferences.conversation ? '💬 Chatty' : '🤫 Quiet Ride'}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Driver Info */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Driver</h3>
        </Card.Header>
        <Card.Body>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {getInitials(trip.driver.fullName)}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{trip.driver.fullName}</h4>
              <p className="text-gray-500">{trip.driver.favouriteTeam} supporter</p>
              <p className="text-sm text-gray-400">{trip.driver.city}, {trip.driver.region}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Passengers */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            Passengers ({trip.passengers.length})
          </h3>
        </Card.Header>
        <Card.Body>
          {trip.passengers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No passengers yet</p>
          ) : (
            <div className="space-y-3">
              {trip.passengers.map((passenger) => (
                <div key={passenger._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {getInitials(passenger.fullName)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{passenger.fullName}</p>
                    <p className="text-sm text-gray-500">{passenger.favouriteTeam}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Pending Requests (Driver only) */}
      {isDriver && trip.requests.filter(r => r.status === 'pending').length > 0 && (
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Requests ({trip.requests.filter(r => r.status === 'pending').length})
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {trip.requests
                .filter(r => r.status === 'pending')
                .map((request) => {
                  const user = request.user as User;
                  return (
                    <div key={user._id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                        {getInitials(user.fullName)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.favouriteTeam} • {user.city}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onConfirmRequest?.(user._id)}
                          loading={loading}
                        >
                          <FiCheck className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => onRejectRequest?.(user._id)}
                          loading={loading}
                        >
                          <FiX className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {canRequest && (
          <Button onClick={onRequestJoin} loading={loading}>
            Request to Join
          </Button>
        )}
        {hasPendingRequest && (
          <div className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg">
            Your request is pending approval
          </div>
        )}
        {isPassenger && (
          <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
            <FiCheck className="w-4 h-4" />
            You are confirmed for this trip
          </div>
        )}
        {(isDriver || isPassenger) && (
          <Button variant="outline">
            <FiMessageCircle className="w-4 h-4 mr-2" />
            Messages
          </Button>
        )}
        {isDriver && trip.status !== 'cancelled' && (
          <Button variant="danger" onClick={onCancelTrip} loading={loading}>
            Cancel Trip
          </Button>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
