import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateTripData } from '../../types';
import { createTrip } from '../../services/tripService';
import TripForm from '../../components/trips/TripForm';
import Card from '../../components/common/Card';

const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateTripData) => {
    setLoading(true);
    setError(null);
    try {
      const trip = await createTrip(data);
      navigate(`/trips/${trip._id}`, { 
        state: { message: 'Trip created successfully!' } 
      });
    } catch (err) {
      console.error('Failed to create trip:', err);
      setError('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a Trip</h1>
        <p className="text-gray-600">
          Offer a ride to fellow supporters heading to the match.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <Card>
        <Card.Body>
          <TripForm onSubmit={handleSubmit} loading={loading} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default CreateTrip;
