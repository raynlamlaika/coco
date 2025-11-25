import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateUser } from '../../services/userService';
import type { User } from '../../types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { FiUser, FiMail, FiPhone, FiMapPin, FiHeart, FiUsers, FiSave } from 'react-icons/fi';

const Profile: React.FC = () => {
  const { user, updateUser: updateContextUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    city: user?.city || '',
    region: user?.region || '',
    favouriteTeam: user?.favouriteTeam || '',
    supporterGroup: user?.supporterGroup || '',
    entryCenter: user?.entryCenter || '',
    isDriver: user?.isDriver || false,
    maxSeats: user?.maxSeats || 0,
    interests: user?.interests || []
  });

  const interestOptions = ['Football', 'Music', 'Movies', 'Gaming', 'Travel', 'Food', 'Photography', 'Reading', 'Fitness', 'Art'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await updateUser(user._id, formData);
      updateContextUser(updatedUser as User);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your account information and preferences.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Info */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiUser className="w-5 h-5" />
              Account Information
            </h2>
          </Card.Header>
          <Card.Body className="space-y-4">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              leftIcon={<FiUser />}
            />
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              leftIcon={<FiMail />}
              helperText="Email cannot be changed"
            />
            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              leftIcon={<FiPhone />}
            />
          </Card.Body>
        </Card>

        {/* Supporter Info */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiHeart className="w-5 h-5" />
              Supporter Information
            </h2>
          </Card.Header>
          <Card.Body className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                leftIcon={<FiMapPin />}
              />
              <Input
                label="Region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                leftIcon={<FiMapPin />}
              />
            </div>
            <Input
              label="Favourite Team"
              name="favouriteTeam"
              value={formData.favouriteTeam}
              onChange={handleChange}
              leftIcon={<FiHeart />}
            />
            <Input
              label="Supporter Group"
              name="supporterGroup"
              value={formData.supporterGroup}
              onChange={handleChange}
              leftIcon={<FiUsers />}
            />
            <Input
              label="Entry Center"
              name="entryCenter"
              value={formData.entryCenter}
              onChange={handleChange}
              leftIcon={<FiMapPin />}
            />
          </Card.Body>
        </Card>

        {/* Driver Settings */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900">🚗 Driver Settings</h2>
          </Card.Header>
          <Card.Body className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <span className="font-medium text-gray-900">I want to offer rides</span>
                <p className="text-sm text-gray-500">Enable this to create trips and drive other supporters</p>
              </div>
              <input
                type="checkbox"
                name="isDriver"
                checked={formData.isDriver}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>

            {formData.isDriver && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Seats
                </label>
                <select
                  name="maxSeats"
                  value={formData.maxSeats}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Interests */}
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold text-gray-900">✨ Interests</h2>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-gray-500 mb-4">
              Select your interests to help us match you with compatible travelers
            </p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.interests.includes(interest)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </Card.Body>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={loading}>
            <FiSave className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
