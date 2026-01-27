/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4A574',
          light: '#E9D4B2',
          dark: '#A6784D',
        },
        dark: '#1A1A1A',
        light: '#F8F8F8',
        cream: '#F5E8D3',
        neutral: {
          dark: '#2F2F2F',
          light: '#E8ECEF',
        },
      },
      fontFamily: {
        dancing: ['"Dancing Script"', 'cursive'],
        playfair: ['"Playfair Display"', 'serif'],
        worksans: ['"Work Sans"', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      lineHeight: {
        'relaxed': '1.65',
        'loose': '1.7',
      },
      letterSpacing: {
        'wide': '0.05em',
        'wider': '0.1em',
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'float-slow': 'float 7s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'shimmer': 'shimmer 2.5s linear infinite',
        'shimmer-slow': 'shimmer 3.5s linear infinite',
        'border-grow': 'borderGrow 0.5s ease-out',
        'ripple': 'ripple 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        borderGrow: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(212, 165, 116, 0.3)',
        'glow-lg': '0 0 40px rgba(212, 165, 116, 0.4)',
        'glow-xl': '0 0 60px rgba(212, 165, 116, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(212, 165, 116, 0.15)',
        'card': '0 4px 20px -2px rgba(212, 165, 116, 0.2)',
        'card-hover': '0 20px 50px -12px rgba(212, 165, 116, 0.4)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(212, 165, 116, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      maxWidth: {
        '7xl': '80rem',
        '8xl': '88rem',
      },
    },
  },
  plugins: [],
}

