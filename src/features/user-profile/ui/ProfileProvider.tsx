'use client';

import { useEffect, useState } from 'react';

import { getProfile, type UserProfile } from '@/shared/config/profile';

import { ProfileSetup } from './ProfileSetup';

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  // Hydrating — render nothing to avoid flash
  if (profile === undefined) return null;

  // No profile yet — show setup flow
  if (profile === null) {
    return <ProfileSetup onComplete={setProfile} />;
  }

  return <>{children}</>;
}
