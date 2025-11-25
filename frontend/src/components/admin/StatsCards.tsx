import React from 'react';
import { FiUsers, FiMap, FiCalendar, FiTrendingUp } from 'react-icons/fi';

interface StatsCardsProps {
  userStats?: { total: number; drivers: number; admins: number; banned: number };
  tripStats?: { total: number; pending: number; confirmed: number; completed: number; cancelled: number };
  matchStats?: { total: number; upcoming: number; past: number };
}

const StatsCards: React.FC<StatsCardsProps> = ({ userStats, tripStats, matchStats }) => {
  const cards = [
    {
      title: 'Total Users',
      value: userStats?.total ?? 0,
      icon: FiUsers,
      color: 'blue',
      subtext: `${userStats?.drivers ?? 0} drivers, ${userStats?.admins ?? 0} admins`
    },
    {
      title: 'Active Trips',
      value: (tripStats?.pending ?? 0) + (tripStats?.confirmed ?? 0),
      icon: FiMap,
      color: 'green',
      subtext: `${tripStats?.confirmed ?? 0} confirmed, ${tripStats?.pending ?? 0} pending`
    },
    {
      title: 'Upcoming Matches',
      value: matchStats?.upcoming ?? 0,
      icon: FiCalendar,
      color: 'orange',
      subtext: `${matchStats?.total ?? 0} total matches`
    },
    {
      title: 'Completed Trips',
      value: tripStats?.completed ?? 0,
      icon: FiTrendingUp,
      color: 'purple',
      subtext: `${tripStats?.cancelled ?? 0} cancelled`
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${colorClasses[card.color as keyof typeof colorClasses]} bg-opacity-10`}>
              <card.icon className={`w-6 h-6 text-${card.color}-500`} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
          <p className="text-sm font-medium text-gray-700">{card.title}</p>
          <p className="text-xs text-gray-500 mt-1">{card.subtext}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
