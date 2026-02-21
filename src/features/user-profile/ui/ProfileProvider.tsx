'use client';

import { useEffect, useState } from 'react';

import { getProfile, type UserProfile } from '@/shared/config/profile';

import { ProfileSetup } from './ProfileSetup';

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  // Hydrating — render children so their own loading states show immediately
  if (profile === undefined) return <>{children}</>;

  // No profile yet — show setup flow
  if (profile === null) {
    return <ProfileSetup onComplete={setProfile} />;
  }

  return <>{children}</>;
}
