import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffef5',
          100: '#fffce0',
          200: '#fff8b8',
          300: '#fff285',
          400: '#ffe94d',
          500: '#FBC91D',
          600: '#e6b519',
          700: '#c99a0e',
          800: '#a47a0b',
          900: '#7a6200',
          950: '#4a3b00',
        },
        surface: {
          DEFAULT: '#0a0a12',
          50: '#f8f9fc',
          100: '#eef0f6',
          200: '#d4d8e8',
          300: '#a8b0cc',
          400: '#6b7599',
          500: '#4a5270',
          600: '#2d3348',
          700: '#1e2235',
          800: '#14172a',
          900: '#0e1020',
          950: '#080914',
        },
        // Semantic theme colors (CSS variable-based, support opacity)
        'th-bg': 'rgb(var(--th-bg) / <alpha-value>)',
        'th-bg-alt': 'rgb(var(--th-bg-alt) / <alpha-value>)',
        'th-fg': 'rgb(var(--th-fg) / <alpha-value>)',
        'th-fg-sub': 'rgb(var(--th-fg-sub) / <alpha-value>)',
        'th-fg-muted': 'rgb(var(--th-fg-muted) / <alpha-value>)',
        'th-fg-invert': 'rgb(var(--th-fg-invert) / <alpha-value>)',
        'th-overlay': 'rgb(var(--th-overlay) / <alpha-value>)',
        'th-border': 'rgb(var(--th-border) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        body: ['Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        accent: ['Inter', 'cursive'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(251, 201, 29, 0.15)',
        'glow': '0 0 30px rgba(251, 201, 29, 0.2)',
        'glow-lg': '0 0 60px rgba(251, 201, 29, 0.25)',
        'glow-xl': '0 0 100px rgba(251, 201, 29, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'card-light': '0 2px 16px rgba(0, 0, 0, 0.06)',
        'card-light-hover': '0 8px 30px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #FBC91D 0%, #e6b519 50%, #c99a0e 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a12 0%, #14172a 50%, #0e1020 100%)',
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(251,201,29,0.08) 0%, transparent 60%)',
        'mesh-gradient': 'radial-gradient(at 20% 80%, rgba(251,201,29,0.06) 0%, transparent 50%), radial-gradient(at 80% 20%, rgba(59,130,246,0.04) 0%, transparent 50%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-right': 'slideRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-left': 'slideLeft 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'counter': 'counter 2s ease-out forwards',
        'marquee': 'marquee 30s linear infinite',
        'grain': 'grain 8s steps(10) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(251, 201, 29, 0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(251, 201, 29, 0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
      },
      screens: {
        xs: '475px',
        tablet: '900px',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
