import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        primary: ['Inter', 'sans-serif'], // Neo-grotesk/Humanist
        secondary: ['"Source Serif 4"', 'serif'], // Text-optimized serif
      },
      fontSize: {
        'scale-1': ['0.75rem', { lineHeight: '1.4' }],
        'scale-2': ['1rem', { lineHeight: '1.5' }],
        'scale-3': ['1.25rem', { lineHeight: '1.3' }],
        'scale-4': ['2.5rem', { lineHeight: '1.1' }],
        'scale-5': ['5rem', { lineHeight: '1' }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: '0px',
        md: '0px',
        sm: '0px',
      },
      spacing: {
        'nav': '80px',
        'v-1': '8px',
        'v-2': '24px',
        'v-3': '64px',
        'v-4': '128px',
        'v-5': '256px',
      },
      keyframes: {
        'controlled-decure': {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'enter': 'controlled-decure 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
