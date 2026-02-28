const ONBOARDING_KEY = 'harmony-band-onboarding-seen';
const GUIDE_KEY = 'harmony-band-guide-seen';

export function isOnboardingSeen(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function markOnboardingSeen(): void {
  localStorage.setItem(ONBOARDING_KEY, 'true');
}

export function isGuideSeen(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(GUIDE_KEY) === 'true';
}

export function markGuideSeen(): void {
  localStorage.setItem(GUIDE_KEY, 'true');
}

export function resetOnboarding(): void {
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(GUIDE_KEY);
}
