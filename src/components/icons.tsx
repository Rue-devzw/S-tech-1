import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        {...props}
    >
        <g transform="translate(5, 5) scale(0.9)">
            {/* S-shape part 1 (blue, was orange) */}
            <path
                d="M 85,30 C 85,15 75,5 60,5 C 45,5 35,15 35,30 L 35,40 L 65,40 C 75,40 85,50 85,60 L 85,70 L 100,70 L 100,60 C 100,40 85,30 85,30 Z"
                fill="hsl(var(--primary))"
            />
            {/* S-shape part 2 (accent, was blue) */}
            <path
                d="M 15,70 C 15,85 25,95 40,95 C 55,95 65,85 65,70 L 65,60 L 35,60 C 25,60 15,50 15,40 L 15,30 L 0,30 L 0,40 C 0,60 15,70 15,70 Z"
                fill="hsl(var(--accent))"
            />
        </g>
    </svg>
  );
}