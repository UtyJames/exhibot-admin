// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import EmailLogin from '../components/auth/EmailLogin';
import OTPVerification from '../components/auth/OTPVerification';

const LoginPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');

  const handleEmailSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentStep('otp');
  };

  const handleOTPSuccess = () => {
    // This will be handled by the AuthContext redirect
    window.location.href = '/';
  };

  const handleBackToEmail = () => {
    setCurrentStep('email');
    setEmail('');
  };

  return (
    <>
      {currentStep === 'email' && (
        <EmailLogin onSuccess={handleEmailSuccess} />
      )}
      {currentStep === 'otp' && (
        <OTPVerification
          email={email}
          onBack={handleBackToEmail}
          onSuccess={handleOTPSuccess}
        />
      )}
    </>
  );
};

export default LoginPage;