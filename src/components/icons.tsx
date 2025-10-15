import Image from 'next/image';
import type { SVGProps } from 'react';

export function Logo(props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) {
  return (
    <Image
        src="/logo.svg"
        alt="S-Tech Services Logo"
        width={100}
        height={100}
        {...props}
    />
  );
}
