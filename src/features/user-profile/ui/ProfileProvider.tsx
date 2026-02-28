'use client';

import { useEffect, useState } from 'react';

import { OnboardingTour } from '@/features/onboarding';
import { isOnboardingSeen, markOnboardingSeen } from '@/shared/config/onboarding';
import { getProfile, type UserProfile } from '@/shared/config/profile';

import { ProfileSetup } from './ProfileSetup';

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);
  const [onboardingSeen, setOnboardingSeen] = useState(true);

  useEffect(() => {
    setProfile(getProfile());
    setOnboardingSeen(isOnboardingSeen());
  }, []);

  // Hydrating — render children so their own loading states show immediately
  if (profile === undefined) return <>{children}</>;

  // No profile yet — show setup flow
  if (profile === null) {
    return <ProfileSetup onComplete={setProfile} />;
  }

  // Profile exists but onboarding not seen — show tour
  if (!onboardingSeen) {
    return (
      <OnboardingTour
        onComplete={() => {
          markOnboardingSeen();
          setOnboardingSeen(true);
        }}
      />
    );
  }

  return <>{children}</>;
}
