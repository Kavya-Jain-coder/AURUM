import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY PALETTE
        'aurum-void': '#0A0806',
        'aurum-obsidian': '#12100D',
        'aurum-shadow': '#1C1916',
        'aurum-mist': '#2A2520',

        // GOLD RAMP
        'aurum-gold-dim': '#7A5C2E',
        'aurum-gold': '#C69B3C',
        'aurum-gold-glow': '#E8B84B',
        'aurum-gold-pale': '#F5D98A',

        // IVORY SCALE
        'aurum-ivory-deep': '#8A7B68',
        'aurum-ivory-mid': '#C4B49A',
        'aurum-ivory': '#F4EADE',
        'aurum-cream': '#FAF6F0',

        // GEMSTONE ACCENTS
        'aurum-ruby': '#8B1A2E',
        'aurum-sapphire': '#1A3A6B',
        'aurum-emerald': '#0D4C3C',
        'aurum-diamond': '#E8F0F8',
      },
      fontFamily: {
        'display': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'body': ['"DM Sans"', 'system-ui', 'sans-serif'],
        'accent': ['"Space Grotesk"', 'monospace'],
      },
      letterSpacing: {
        'hero': '-0.02em',
        'section': '0.08em',
        'label': '0.2em',
        'comfortable': '0.01em',
      },
      fontSize: {
        'hero': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'hero-lg': ['clamp(4rem, 10vw, 8rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'section': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '0.08em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '0.01em' }],
      },
      animation: {
        'gold-shimmer': 'goldShimmer 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        goldShimmer: {
          '0%, 100%': { backgroundPosition: '-200% center' },
          '50%': { backgroundPosition: '200% center' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(198, 155, 60, 0.4)' },
          '50%': { boxShadow: '0 0 20px 10px rgba(198, 155, 60, 0)' },
        },
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'luxury-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
        'luxury-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1200': '1200ms',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #7A5C2E, #C69B3C, #E8B84B, #C69B3C, #7A5C2E)',
        'gold-shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(198,155,60,0.3), transparent)',
      },
      boxShadow: {
        'gold-sm': '0 0 10px rgba(198, 155, 60, 0.15)',
        'gold': '0 0 20px rgba(198, 155, 60, 0.2)',
        'gold-lg': '0 0 40px rgba(198, 155, 60, 0.3)',
        'gold-glow': '0 0 60px rgba(232, 184, 75, 0.4)',
      },
    },
  },
  plugins: [],
};
export default config;
