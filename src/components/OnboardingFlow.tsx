import React, { useState } from 'react';
import { User } from '../types';
import AvatarSelection from './onboarding/AvatarSelection';
import UserForm from './onboarding/UserForm';
import ParentalConsent from './onboarding/ParentalConsent';
import Welcome from './onboarding/Welcome';

interface OnboardingFlowProps {
  onComplete: (user: User) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<User>>({});

  const handleStepComplete = (data: Partial<User>) => {
    setUserData(prev => ({ ...prev, ...data }));
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      const fullUser: User = {
        id: Date.now().toString(),
        name: data.name || '',
        age: data.age || 0,
        email: data.email || '',
        avatar: data.avatar || '🤖',
        parentalConsent: data.parentalConsent || false,
        xp: 0,
        level: 1,
        badges: [],
        completedLessons: [],
        completedGames: [],
        createdAt: new Date(),
        ...userData,
        ...data
      };
      onComplete(fullUser);
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
        {step === 1 && (
          <UserForm 
            onNext={handleStepComplete}
            initialData={userData}
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
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;