import { type Part } from '@/shared/config/parts';

export interface UserProfile {
  name: string;
  part: Part;
  churchId: string;
  churchName: string;
}

const PROFILE_KEY = 'harmony-band-profile';

export function getProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(PROFILE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
