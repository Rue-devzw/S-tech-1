import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 100 100"
      {...props}
    >
      <g transform="translate(0, -10)">
        {/* S shape */}
        <path
          d="M63.6,26.9c-7.3-6.1-17.7-8.2-27.1-5.4c-9.5,2.8-17.2,10.2-20,19.7c-3.1,10.5,0.2,21.9,7.3,28 c7.3,6.1,17.7,8.2,27.1,5.4c9.5-2.8,17.2-10.2,20-19.7"
          fill="none"
          strokeWidth="12"
        >
          <animate attributeName="stroke" values="#F57C00; #1976D2; #F57C00" dur="4s" repeatCount="indefinite" />
        </path>

        {/* Wrench and Gear */}
        <path
          d="M23,73.5l-2.4,4.1c-0.9,1.5-3,2-4.5,1.1L3.9,71.8c-1.5-0.9-2-3-1.1-4.5l2.4-4.1"
          stroke="#1976D2"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="27" cy="62" r="8" fill="#1976D2" />
        <circle cx="27" cy="62" r="3" fill="white" />
        <path d="M27,52 v-3 M27,72 v3 M17,62 h-3 M37,62 h3 M20,55 l-2,-2 M34,69 l2,2 M20,69 l-2,2 M34,55 l2,-2" stroke="white" strokeWidth="2" strokeLinecap="round"/>


        {/* Digital pixels */}
        <rect x="68" y="22" width="5" height="5" fill="#F57C00" />
        <rect x="75" y="25" width="4" height="4" fill="#F57C00" />
        <rect x="73" y="17" width="4" height="4" fill="#F57C00" />
        <rect x="81" y="20" width="3" height="3" fill="#F57C00" />
        <rect x="80" y="29" width="3" height="3" fill="#F57C00" />
        <rect x="85" y="25" width="2" height="2" fill="#F57C00" />
      </g>
    </svg>
  );
}
