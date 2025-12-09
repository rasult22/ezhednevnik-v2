/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme base colors
        'dark': {
          '50': '#1a1a2e',
          '100': '#16162a',
          '200': '#12122a',
          '300': '#0f0f23',
          '400': '#0a0a1a',
          '500': '#050510',
        },

        // Glass colors
        'glass': {
          'light': 'rgba(255, 255, 255, 0.08)',
          'medium': 'rgba(255, 255, 255, 0.12)',
          'heavy': 'rgba(255, 255, 255, 0.18)',
          'border': 'rgba(255, 255, 255, 0.15)',
          'border-light': 'rgba(255, 255, 255, 0.08)',
        },

        // Accent gradients (for text and accents)
        'accent': {
          'blue': '#60a5fa',
          'purple': '#a78bfa',
          'pink': '#f472b6',
          'cyan': '#22d3ee',
          'emerald': '#34d399',
          'orange': '#fb923c',
        },

        // Status colors
        'success': '#34d399',
        'warning': '#fbbf24',
        'danger': '#f87171',
        'primary': '#60a5fa',

        // Text colors for dark theme
        'text': {
          'primary': 'rgba(255, 255, 255, 0.95)',
          'secondary': 'rgba(255, 255, 255, 0.7)',
          'muted': 'rgba(255, 255, 255, 0.5)',
          'disabled': 'rgba(255, 255, 255, 0.3)',
        },
      },

      backgroundImage: {
        // Gradient backgrounds
        'gradient-main': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16162a 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-accent': 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
        'gradient-success': 'linear-gradient(135deg, #34d399 0%, #22d3ee 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fb923c 0%, #f472b6 100%)',
        'gradient-cool': 'linear-gradient(135deg, #22d3ee 0%, #60a5fa 100%)',
        'gradient-purple': 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',

        // Subtle mesh gradients for backgrounds
        'mesh-1': 'radial-gradient(at 40% 20%, hsla(228, 61%, 20%, 1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(270, 61%, 25%, 1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(228, 61%, 15%, 1) 0px, transparent 50%)',
        'mesh-2': 'radial-gradient(at 0% 0%, hsla(253, 61%, 20%, 1) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(228, 61%, 15%, 1) 0px, transparent 50%)',
      },

      backdropBlur: {
        'glass': '16px',
        'glass-heavy': '24px',
      },

      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        'glow-blue': '0 0 20px rgba(96, 165, 250, 0.3)',
        'glow-purple': '0 0 20px rgba(167, 139, 250, 0.3)',
        'glow-pink': '0 0 20px rgba(244, 114, 182, 0.3)',
        'glow-success': '0 0 20px rgba(52, 211, 153, 0.3)',
      },

      borderRadius: {
        'glass': '16px',
        'glass-sm': '12px',
        'glass-lg': '24px',
      },

      animation: {
        'gradient': 'gradient 8s ease infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },

      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        glow: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
      },
    },
  },
  plugins: [],
}
