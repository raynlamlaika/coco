import React, { useEffect, useState } from 'react';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import { getUsers, toggleBan, promoteToAdmin, deleteUser } from '../../services/userService';
import { User, PaginatedResponse } from '../../types';
import UserTable from '../../components/admin/UserTable';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [page, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers({
        search: search || undefined,
        role: roleFilter || undefined,
        page,
        limit: 10
      });
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleToggleBan = async (user: User) => {
    if (!confirm(`Are you sure you want to ${user.isBanned ? 'unban' : 'ban'} ${user.fullName}?`)) return;
    
    try {
      await toggleBan(user._id, !user.isBanned);
      loadUsers();
    } catch (error) {
      console.error('Failed to toggle ban:', error);
      alert('Failed to update user status');
    }
  };

  const handlePromote = async (user: User) => {
    if (!confirm(`Are you sure you want to promote ${user.fullName} to admin?`)) return;
    
    try {
      await promoteToAdmin(user._id);
      loadUsers();
    } catch (error) {
      console.error('Failed to promote user:', error);
      alert('Failed to promote user');
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.fullName}? This cannot be undone.`)) return;
    
    try {
      await deleteUser(user._id);
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
        <p className="text-gray-600">
          View and manage platform users.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<FiSearch />}
            />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </div>
          <Button type="submit">Search</Button>
          <Button type="button" variant="outline" onClick={loadUsers}>
            <FiRefreshCw className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* User Table */}
      <UserTable
        users={users?.data || []}
        loading={loading}
        onToggleBan={handleToggleBan}
        onPromote={handlePromote}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {users && users.pages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {users.page} of {users.pages} ({users.total} total users)
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
              disabled={page === users.pages}
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

export default ManageUsers;
