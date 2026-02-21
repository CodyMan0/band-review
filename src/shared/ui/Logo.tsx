import Link from 'next/link';

import { CarrotLogo } from './icons';

export const Logo = () => {
  return (
    <Link href="/" className="inline-flex items-center gap-1.5 text-lg font-bold">
      <CarrotLogo size={20} />
      Harmony Band
    </Link>
  );
};
