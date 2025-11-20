// src/components/auth/OTPVerification.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Mail, Loader2, ArrowLeft, RotateCcw, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface OTPVerificationProps {
  email: string;
  onBack: () => void;
  onSuccess: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onBack, onSuccess }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { verifyOTP, resendOTP } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const focusNextInput = (index: number) => {
    if (index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrevInput = (index: number) => {
    if (index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      focusNextInput(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      focusPrevInput(index);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, 4).split('');

    if (pastedNumbers.length === 4) {
      setOtp(pastedNumbers);
      inputRefs.current[3]?.focus();
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const otpString = otp.join('');
  
  if (otpString.length !== 4) {
    setError('Please enter the complete 4-digit OTP');
    return;
  }

  setError('');
  setIsLoading(true);

  try {
    await verifyOTP(email, otpString);
    setSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      onSuccess();
    }, 1000);
  } catch (err: any) {
    setError(err.message || 'Invalid OTP. Please try again.');
    // Clear OTP on error
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
  } finally {
    setIsLoading(false);
  }
};
  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');
    
    try {
      await resendOTP(email);
      setCountdown(60); // 60 seconds countdown
      setSuccess('New OTP sent to your email!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to email
          </button>

          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-white">Check your email</h2>
          <p className="mt-2 text-gray-400">
            We sent a verification code to
          </p>
          <p className="text-white font-medium">{email}</p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <label htmlFor="otp" className="text-sm font-medium text-gray-300 text-center block">
              Enter 4-digit verification code
            </label>
            
            <div className="flex justify-center space-x-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-16 h-16 text-center text-2xl font-bold bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-400 text-sm text-center flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {success}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 4}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-sm font-medium text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Verify & Continue
                <CheckCircle className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-3">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResendOTP}
            disabled={isResending || countdown > 0}
            className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className={`w-4 h-4 mr-1 ${isResending ? 'animate-spin' : ''}`} />
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            The OTP will expire in 60 minutes for security reasons
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;