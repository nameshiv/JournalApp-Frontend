/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5F7163',
          hover: '#4F6154',
          soft: '#5F716320',
        },
        secondary: {
          DEFAULT: '#8A9A8C',
        },
        bg: {
          DEFAULT: '#F7F6F2',
          soft: '#F1F0EB',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F1F0EB',
        },
        border: {
          DEFAULT: '#DDDCD5',
        },
        ink: {
          DEFAULT: '#292D2A',
          secondary: '#6B716C',
          muted: '#969B96',
        },
        success: {
          DEFAULT: '#6F8B72',
        },
        warning: {
          DEFAULT: '#B08A57',
        },
        error: {
          DEFAULT: '#A86660',
        },
        info: {
          DEFAULT: '#71879A',
        },
        journalAccent: {
          DEFAULT: '#B7A98D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xl': ['1.5rem', { lineHeight: '1.2' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.15' }],
      },
      borderRadius: {
        DEFAULT: '10px',
        lg: '12px',
        md: '8px',
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(41,45,42,0.04), 0 1px 2px rgba(41,45,42,0.03)',
        card: '0 1px 3px rgba(41,45,42,0.05)',
        hover: '0 2px 8px rgba(41,45,42,0.06)',
      },
      transitionTimingFunction: {
        'calm': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
