import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex">
      {/* Left side - Image/Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-500 to-blue-600 items-center justify-center p-12">
        <div className="text-center text-white max-w-md">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <span className="text-4xl">⚽</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-green-100 text-lg mb-8">
            Create your account and start sharing rides with fellow supporters today.
          </p>
          
          <div className="space-y-4 text-left">
            {[
              'Find rides to any match',
              'Offer your spare seats',
              'Connect with fellow fans',
              'Smart matching algorithm',
              'In-app messaging'
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-green-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
