import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiHeart, FiUsers, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  city: string;
  region: string;
  favouriteTeam: string;
  supporterGroup: string;
  entryCenter: string;
  isDriver: boolean;
  maxSeats: number;
  interests: string[];
}

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    region: '',
    favouriteTeam: '',
    supporterGroup: '',
    entryCenter: '',
    isDriver: false,
    maxSeats: 0,
    interests: []
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const interestOptions = ['Football', 'Music', 'Movies', 'Gaming', 'Travel', 'Food', 'Photography', 'Reading', 'Fitness', 'Art'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (stepNum === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }

    if (stepNum === 2) {
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.region.trim()) newErrors.region = 'Region is required';
      if (!formData.favouriteTeam.trim()) newErrors.favouriteTeam = 'Favourite team is required';
      if (!formData.supporterGroup.trim()) newErrors.supporterGroup = 'Supporter group is required';
      if (!formData.entryCenter.trim()) newErrors.entryCenter = 'Entry center is required';
    }

    if (stepNum === 3) {
      if (formData.isDriver && formData.maxSeats < 1) {
        newErrors.maxSeats = 'Number of seats must be at least 1 for drivers';
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
    clearError();

    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      void confirmPassword; // Suppress unused variable warning
      await register(registerData);
      navigate('/dashboard');
    } catch {
      // Error is handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-600 mt-2">Join the supporter community</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                s <= step
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-16 h-1 ${
                  s < step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Account Info */}
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Enter your full name"
              leftIcon={<FiUser />}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              leftIcon={<FiMail />}
            />
            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+44 123 456 7890"
              leftIcon={<FiPhone />}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Create a password"
                leftIcon={<FiLock />}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              leftIcon={<FiLock />}
            />
          </>
        )}

        {/* Step 2: Supporter Info */}
        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Supporter Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="Your city"
                leftIcon={<FiMapPin />}
              />
              <Input
                label="Region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                error={errors.region}
                placeholder="Your region"
                leftIcon={<FiMapPin />}
              />
            </div>
            <Input
              label="Favourite Team"
              name="favouriteTeam"
              value={formData.favouriteTeam}
              onChange={handleChange}
              error={errors.favouriteTeam}
              placeholder="Your favourite team"
              leftIcon={<FiHeart />}
            />
            <Input
              label="Supporter Group"
              name="supporterGroup"
              value={formData.supporterGroup}
              onChange={handleChange}
              error={errors.supporterGroup}
              placeholder="Your supporter group"
              leftIcon={<FiUsers />}
            />
            <Input
              label="Entry Center"
              name="entryCenter"
              value={formData.entryCenter}
              onChange={handleChange}
              error={errors.entryCenter}
              placeholder="Preferred entry center"
              leftIcon={<FiMapPin />}
            />
          </>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Preferences</h2>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDriver"
                  checked={formData.isDriver}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="font-medium text-gray-900">I want to offer rides</span>
                  <p className="text-sm text-gray-500">Enable this if you have a car and want to drive others</p>
                </div>
              </label>
              
              {formData.isDriver && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Seats
                  </label>
                  <select
                    name="maxSeats"
                    value={formData.maxSeats}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                      <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  {errors.maxSeats && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxSeats}</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interests (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.interests.includes(interest)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div />
          )}
          
          {step < 3 ? (
            <Button type="button" onClick={handleNext}>
              Continue
            </Button>
          ) : (
            <Button type="submit" loading={isSubmitting}>
              Create Account
            </Button>
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
