import React, { useState, useEffect } from 'react';
import { FiMapPin, FiClock, FiUsers, FiInfo } from 'react-icons/fi';
import type { Match, CreateTripData } from '../../types';
import { getUpcomingMatches } from '../../services/matchService';
import Button from '../common/Button';
import Input from '../common/Input';

interface TripFormProps {
  onSubmit: (data: CreateTripData) => Promise<void>;
  loading?: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, loading = false }) => {
  const [step, setStep] = useState(1);
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    match: '',
    departureLocation: '',
    departureTime: '',
    availableSeats: 1,
    vehicleInfo: {
      make: '',
      model: '',
      color: '',
      plateNumber: ''
    },
    preferences: {
      smoking: false,
      music: true,
      conversation: true
    }
  });

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await getUpcomingMatches(20);
        setMatches(data);
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setMatchesLoading(false);
      }
    };
    loadMatches();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
      }));
    }
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNum === 1) {
      if (!formData.match) newErrors.match = 'Please select a match';
    }

    if (stepNum === 2) {
      if (!formData.departureLocation.trim()) {
        newErrors.departureLocation = 'Departure location is required';
      }
      if (!formData.departureTime) {
        newErrors.departureTime = 'Departure time is required';
      }
      if (formData.availableSeats < 1 || formData.availableSeats > 10) {
        newErrors.availableSeats = 'Available seats must be between 1 and 10';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(step)) {
      await onSubmit(formData);
    }
  };

  const selectedMatch = matches.find(m => m._id === formData.match);

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s <= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s === 1 && '⚽'}
              {s === 2 && <FiMapPin />}
              {s === 3 && '🚗'}
              {s === 4 && <FiInfo />}
            </div>
            {s < 4 && (
              <div className={`w-12 h-1 ${s < step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Select Match */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚽</span> Select Match
          </h2>
          
          {matchesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(n => (
                <div key={n} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No upcoming matches available.
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {matches.map(match => (
                <label
                  key={match._id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.match === match._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="match"
                    value={match._id}
                    checked={formData.match === match._id}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {match.homeTeam} vs {match.awayTeam}
                      </h3>
                      <p className="text-sm text-gray-500">{match.competition}</p>
                      <p className="text-sm text-gray-500">{match.stadium}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Date(match.matchDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(match.matchDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
          
          {errors.match && <p className="mt-2 text-sm text-red-600">{errors.match}</p>}
        </div>
      )}

      {/* Step 2: Departure Details */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiMapPin className="w-6 h-6" /> Departure Details
          </h2>

          {selectedMatch && (
            <div className="p-4 bg-blue-50 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>Match:</strong> {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Date:</strong> {new Date(selectedMatch.matchDate).toLocaleString()}
              </p>
            </div>
          )}

          <Input
            label="Departure Location"
            name="departureLocation"
            value={formData.departureLocation}
            onChange={handleChange}
            error={errors.departureLocation}
            placeholder="e.g., Manchester City Centre"
            leftIcon={<FiMapPin />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Time
            </label>
            <div className="relative">
              <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="datetime-local"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg ${
                  errors.departureTime ? 'border-red-300' : 'border-gray-300'
                } focus:ring-blue-500 focus:border-blue-500`}
              />
            </div>
            {errors.departureTime && (
              <p className="mt-1 text-sm text-red-600">{errors.departureTime}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available Seats
            </label>
            <div className="relative">
              <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Vehicle Info */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🚗 Vehicle Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Make"
              name="vehicleInfo.make"
              value={formData.vehicleInfo.make}
              onChange={handleChange}
              placeholder="e.g., Toyota"
            />
            <Input
              label="Model"
              name="vehicleInfo.model"
              value={formData.vehicleInfo.model}
              onChange={handleChange}
              placeholder="e.g., Corolla"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Color"
              name="vehicleInfo.color"
              value={formData.vehicleInfo.color}
              onChange={handleChange}
              placeholder="e.g., Silver"
            />
            <Input
              label="Plate Number"
              name="vehicleInfo.plateNumber"
              value={formData.vehicleInfo.plateNumber}
              onChange={handleChange}
              placeholder="e.g., AB12 CDE"
            />
          </div>
        </div>
      )}

      {/* Step 4: Preferences */}
      {step === 4 && (
        <div className="space-y-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiInfo /> Trip Preferences
          </h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-900">🚬 Smoking Allowed</span>
                <p className="text-sm text-gray-500">Allow passengers to smoke in the car</p>
              </div>
              <input
                type="checkbox"
                name="preferences.smoking"
                checked={formData.preferences.smoking}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-900">🎵 Music</span>
                <p className="text-sm text-gray-500">Play music during the trip</p>
              </div>
              <input
                type="checkbox"
                name="preferences.music"
                checked={formData.preferences.music}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium text-gray-900">💬 Conversation</span>
                <p className="text-sm text-gray-500">Open to chatting during the ride</p>
              </div>
              <input
                type="checkbox"
                name="preferences.conversation"
                checked={formData.preferences.conversation}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>

          {/* Summary */}
          <div className="p-4 bg-green-50 rounded-lg mt-6">
            <h3 className="font-semibold text-green-800 mb-2">Trip Summary</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li><strong>Match:</strong> {selectedMatch?.homeTeam} vs {selectedMatch?.awayTeam}</li>
              <li><strong>From:</strong> {formData.departureLocation}</li>
              <li><strong>Time:</strong> {new Date(formData.departureTime).toLocaleString()}</li>
              <li><strong>Seats:</strong> {formData.availableSeats}</li>
              {formData.vehicleInfo.make && (
                <li><strong>Vehicle:</strong> {formData.vehicleInfo.color} {formData.vehicleInfo.make} {formData.vehicleInfo.model}</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button type="button" variant="outline" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <div />
        )}
        
        {step < 4 ? (
          <Button type="button" onClick={handleNext}>
            Continue
          </Button>
        ) : (
          <Button type="submit" loading={loading}>
            Create Trip
          </Button>
        )}
      </div>
    </form>
  );
};

export default TripForm;
