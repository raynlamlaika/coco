import React from 'react';
import { FiStar, FiCheck } from 'react-icons/fi';
import { TripRecommendation } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';

interface GroupSuggestionsProps {
  recommendations: TripRecommendation[];
  onGroup?: (tripIds: string[]) => void;
  loading?: boolean;
}

const GroupSuggestions: React.FC<GroupSuggestionsProps> = ({
  recommendations,
  onGroup,
  loading = false
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <Card.Header className="bg-green-100 border-green-200">
        <div className="flex items-center gap-2">
          <FiStar className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">
            Recommended Trip Groups
          </h3>
        </div>
        <p className="text-sm text-green-600 mt-1">
          These trips have high compatibility scores and could be grouped together
        </p>
      </Card.Header>
      <Card.Body>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.trip._id}
              className="p-4 bg-white rounded-lg border border-green-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {rec.trip.driver.fullName}'s Trip
                  </h4>
                  <p className="text-sm text-gray-500">
                    From {rec.trip.departureLocation}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  <FiStar className="w-4 h-4" />
                  <span className="font-semibold">{rec.score}%</span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Matching Criteria
                </p>
                <div className="flex flex-wrap gap-2">
                  {rec.matchedCriteria.map((criteria, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
                    >
                      <FiCheck className="w-3 h-3" />
                      {criteria}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  {rec.trip.availableSeats} seat{rec.trip.availableSeats !== 1 ? 's' : ''} available
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onGroup?.([rec.trip._id])}
                  loading={loading}
                >
                  Group Trips
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default GroupSuggestions;
