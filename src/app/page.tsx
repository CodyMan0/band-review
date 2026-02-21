import { ProfileProvider } from '@/features/user-profile/ui/ProfileProvider';

import { HomeClient } from './HomeClient';

export default function HomePage() {
  return (
    <ProfileProvider>
      <HomeClient />
    </ProfileProvider>
  );
}
