import React, { useState } from 'react';
import { User } from '../types';
import { signupUser } from '../lib/authApi';
import AvatarSelection from './onboarding/AvatarSelection';
import UserForm from './onboarding/UserForm';
import ParentalConsent from './onboarding/ParentalConsent';
import Welcome from './onboarding/Welcome';

interface OnboardingFlowProps {
  onComplete: (user: User) => void;
  onBackToLogin: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<User>>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStepComplete = async (data: Partial<User>) => {
    setError('');
    setUserData(prev => ({ ...prev, ...data }));
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      const completeUserData = {
        ...userData,
        ...data,
      };

      setIsSubmitting(true);

      try {
        const createdUser = await signupUser({
          name: completeUserData.name || '',
          age: completeUserData.age || 0,
          email: completeUserData.email || '',
          password: completeUserData.password || '',
          avatar: completeUserData.avatar || '🤖',
          parentalConsent: completeUserData.parentalConsent || false,
        });
        onComplete(createdUser);
      } catch (submissionError) {
        setError(
          submissionError instanceof Error
            ? submissionError.message
            : 'Could not create your account right now.'
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {step === 1 && (
          <UserForm 
            onNext={handleStepComplete}
            initialData={userData}
            onBackToLogin={onBackToLogin}
          />
        )}
        
        {step === 2 && (
          <AvatarSelection 
            onNext={handleStepComplete}
            onBack={handleBack}
            selectedAvatar={userData.avatar}
          />
        )}
        
        {step === 3 && (
          <ParentalConsent 
            onNext={handleStepComplete}
            onBack={handleBack}
            initialConsent={userData.parentalConsent}
          />
        )}
        
        {step === 4 && (
          <Welcome 
            onComplete={handleStepComplete}
            userData={userData}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
