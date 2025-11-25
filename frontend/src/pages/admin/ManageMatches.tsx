import React, { useEffect, useState } from 'react';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';
import { getMatches, createMatch, deleteMatch } from '../../services/matchService';
import type { Match, PaginatedResponse } from '../../types';
import MatchTable from '../../components/admin/MatchTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const ManageMatches: React.FC = () => {
  const [matches, setMatches] = useState<PaginatedResponse<Match> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    stadium: '',
    matchDate: '',
    competition: '',
    entryCenter: ''
  });

  useEffect(() => {
    loadMatches();
  }, [page]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await getMatches({ page, limit: 10 });
      setMatches(data);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createMatch(formData);
      setShowModal(false);
      setFormData({
        homeTeam: '',
        awayTeam: '',
        stadium: '',
        matchDate: '',
        competition: '',
        entryCenter: ''
      });
      loadMatches();
    } catch (error) {
      console.error('Failed to create match:', error);
      alert('Failed to create match');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (match: Match) => {
    if (!confirm(`Are you sure you want to delete ${match.homeTeam} vs ${match.awayTeam}?`)) return;
    
    try {
      await deleteMatch(match._id);
      loadMatches();
    } catch (error) {
      console.error('Failed to delete match:', error);
      alert('Failed to delete match');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Matches</h1>
          <p className="text-gray-600">
            Create and manage football matches.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <FiPlus className="w-4 h-4 mr-2" />
          Add Match
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={loadMatches}>
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Match Table */}
      <MatchTable
        matches={matches?.data || []}
        loading={loading}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {matches && matches.pages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {matches.page} of {matches.pages} ({matches.total} total matches)
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
              disabled={page === matches.pages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Match" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Home Team"
              name="homeTeam"
              value={formData.homeTeam}
              onChange={handleChange}
              required
            />
            <Input
              label="Away Team"
              name="awayTeam"
              value={formData.awayTeam}
              onChange={handleChange}
              required
            />
          </div>
          <Input
            label="Stadium"
            name="stadium"
            value={formData.stadium}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Match Date & Time
              </label>
              <input
                type="datetime-local"
                name="matchDate"
                value={formData.matchDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <Input
              label="Competition"
              name="competition"
              value={formData.competition}
              onChange={handleChange}
              placeholder="e.g., Premier League"
              required
            />
          </div>
          <Input
            label="Entry Center"
            name="entryCenter"
            value={formData.entryCenter}
            onChange={handleChange}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={creating}>
              Create Match
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageMatches;
