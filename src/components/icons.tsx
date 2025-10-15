import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.5 6.5L15.5 4L19 7.5L16 10" />
      <path d="M15.5 4L9.5 10" />
      <path d="M18 10L12 16" />
      <path d="M4 14L10 20" />
      <path d="M8 12L14 18" />
      <path d="M13.5 17.5L10.5 20L7 16.5L10 14" />
    </svg>
  );
}
