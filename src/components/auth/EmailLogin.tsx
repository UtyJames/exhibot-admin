// src/components/auth/EmailLogin.tsx
import React, { useState } from 'react';
import { Mail, Loader2, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

interface EmailLoginProps {
  onSuccess: (email: string) => void;
}

const EmailLogin: React.FC<EmailLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    await login(email);
    onSuccess(email);
  } catch (err: any) {
    setError(err.message || 'Failed to send OTP. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo & Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
               <div className="flex-shrink-0">
                              <img 
                                src={logo} 
                                alt="Exhiibot Logo" 
                                className="h-8 w-8 object-contain" // Adjust size as needed
                              />
                            </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-400">Enter your email to access the admin dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!isValidEmail(email) || isLoading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-medium text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continue with Email
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Security Note */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            We'll send a one-time password to your email for secure access
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailLogin;