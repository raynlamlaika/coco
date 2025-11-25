import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiMap, FiCalendar, FiSettings, FiBarChart2 } from 'react-icons/fi';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FiHome, exact: true },
    { path: '/admin/users', label: 'Manage Users', icon: FiUsers },
    { path: '/admin/trips', label: 'Manage Trips', icon: FiMap },
    { path: '/admin/matches', label: 'Manage Matches', icon: FiCalendar },
  ];

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)] border-r border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <FiSettings className="w-5 h-5" />
          <span>Admin Panel</span>
        </h2>
      </div>

      <nav className="mt-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.exact}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path, item.exact)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-8 px-3">
          <div className="bg-gradient-to-r from-blue-500 to-green-400 rounded-lg p-4 text-white">
            <FiBarChart2 className="w-8 h-8 mb-2" />
            <h3 className="font-semibold mb-1">Quick Stats</h3>
            <p className="text-sm opacity-90">View analytics and reports from the dashboard.</p>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
