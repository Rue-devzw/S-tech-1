import Image from 'next/image';
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export function Logo(props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) {
  return (
    <Image
        src="/logo.svg"
        alt="S-Tech Solutions Logo"
        width={100}
        height={100}
        {...props}
        className={cn('rounded-full object-cover', props.className)}
    />
  );
}
