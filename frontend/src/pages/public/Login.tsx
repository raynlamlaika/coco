import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <LoginForm />
      </div>

      {/* Right side - Image/Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-green-500 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <span className="text-4xl">⚽</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold mb-4">Welcome to SupporterCarpool</h2>
          <p className="text-blue-100 text-lg">
            Join thousands of football supporters sharing rides to matches. 
            Save money, make friends, and reduce your carbon footprint.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">10k+</p>
              <p className="text-sm text-blue-100">Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold">5k+</p>
              <p className="text-sm text-blue-100">Trips</p>
            </div>
            <div>
              <p className="text-3xl font-bold">50+</p>
              <p className="text-sm text-blue-100">Clubs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
