import React from 'react';
import { FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';
import type { Match } from '../../types';
import { formatDate, formatTime } from '../../utils/helpers';
import Card from '../common/Card';

interface MatchCardProps {
  match: Match;
  onClick?: (match: Match) => void;
  showTripsCount?: number;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onClick,
  showTripsCount
}) => {
  const matchDate = new Date(match.matchDate);
  const isPast = matchDate < new Date();

  return (
    <Card
      hoverable
      onClick={() => onClick?.(match)}
      className={isPast ? 'opacity-60' : ''}
    >
      <Card.Body>
        <div className="flex items-center justify-between mb-4">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {match.competition}
          </span>
          {isPast && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
              Past
            </span>
          )}
        </div>

        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 text-right">
              <p className="font-bold text-lg text-gray-900">{match.homeTeam}</p>
            </div>
            <div className="text-gray-400 font-bold text-xl">vs</div>
            <div className="flex-1 text-left">
              <p className="font-bold text-lg text-gray-900">{match.awayTeam}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FiMapPin className="w-4 h-4 text-blue-500" />
            <span>{match.stadium}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiCalendar className="w-4 h-4 text-green-500" />
            <span>{formatDate(match.matchDate, 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="w-4 h-4 text-orange-500" />
            <span>Kick-off: {formatTime(match.matchDate)}</span>
          </div>
        </div>

        {showTripsCount !== undefined && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <span className="text-blue-600 font-medium">
              {showTripsCount} trip{showTripsCount !== 1 ? 's' : ''} available
            </span>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default MatchCard;
