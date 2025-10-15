import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      {...props}
    >
        <g transform="translate(5, 5) scale(0.9)">
            {/* S-shape part 1 (orange) */}
            <path
                d="M 85,30 C 85,15 75,5 60,5 C 45,5 35,15 35,30 L 35,40 L 65,40 C 75,40 85,50 85,60 L 85,70 L 100,70 L 100,60 C 100,40 85,30 85,30 Z"
                fill="#F57C00"
            />
            {/* S-shape part 2 (blue) */}
            <path
                d="M 15,70 C 15,85 25,95 40,95 C 55,95 65,85 65,70 L 65,60 L 35,60 C 25,60 15,50 15,40 L 15,30 L 0,30 L 0,40 C 0,60 15,70 15,70 Z"
                fill="#1976D2"
            />
            {/* Gear */}
            <g transform="translate(15, 55)">
                <circle cx="0" cy="0" r="12" fill="#1976D2" />
                <circle cx="0" cy="0" r="5" fill="white" />
                <path
                    d="M 0,-15 v -3 M 0,15 v 3 M -15,0 h -3 M 15,0 h 3 M -10.6,-10.6 l -2,-2 M 10.6,10.6 l 2,2 M -10.6,10.6 l -2,2 M 10.6,-10.6 l 2,-2"
                    stroke="#1976D2" strokeWidth="2.5" strokeLinecap="round"
                />
            </g>
            {/* Wrench */}
            <path
                d="M 20,80 L 60,80 C 65,80 68,82 70,85 L 75,90 C 72,88 68,88 65,90 L 60,95 C 65,100 75,100 80,95 L 85,90 C 88,88 85,85 80,82 L 75,80"
                stroke="#1976D2"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin='round'
            />
            {/* Digital pixels */}
            <rect x="75" y="10" width="8" height="8" fill="#F57C00" />
            <rect x="85" y="18" width="6" height="6" fill="#F57C00" />
            <rect x="88" y="5" width="5" height="5" fill="#F57C00" />
            <rect x="95" y="12" width="4" height="4" fill="#F57C00" />
        </g>
    </svg>
  );
}
