/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        /* ── Dark Theme Palette ── */
        background: "#0A0A0B",        /* near-black page bg */
        surface: {
          DEFAULT: "#141416",          /* card/panel bg */
          elevated: "#1A1A1E",         /* slightly lighter for hover/elevated */
          overlay: "#1E1E22",          /* modals, dropdowns */
        },
        foreground: "#ECECEF",         /* primary text — off-white */

        muted: {
          DEFAULT: "#1A1A1E",          /* muted backgrounds */
          foreground: "#71717A",       /* secondary text — zinc-500 */
        },

        border: "#27272A",            /* zinc-800 — subtle borders */
        input: "#27272A",             /* zinc-800 — input borders */
        divider: "#1E1E22",           /* panel dividers */

        /* ── Accent: Deep Indigo ── */
        primary: {
          DEFAULT: "#6366F1",          /* indigo-500 — slightly brighter for dark mode */
          hover: "#818CF8",            /* indigo-400 — hover state */
          light: "rgba(99, 102, 241, 0.1)", /* indigo tint bg */
          foreground: "#FFFFFF",
        },

        secondary: {
          DEFAULT: "#1A1A1E",
          hover: "#27272A",
          foreground: "#A1A1AA",       /* zinc-400 */
        },

        accent: {
          DEFAULT: "rgba(99, 102, 241, 0.1)",
          foreground: "#818CF8",       /* indigo-400 */
        },

        destructive: {
          DEFAULT: "#EF4444",          /* red-500 */
          foreground: "#FFFFFF",
        },

        ring: "#6366F1",              /* indigo-500 */

        card: {
          DEFAULT: "#141416",
          foreground: "#ECECEF",
        },
      },

      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },

      boxShadow: {
        'soft': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.08)',
        'modal': '0 20px 40px -8px rgba(0, 0, 0, 0.6)',
        'highlight': '0 2px 8px -2px rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.15)',
      },

      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1rem' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['0.9375rem', { lineHeight: '1.625rem' }],
        'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':  ['1.5rem',   { lineHeight: '2rem' }],
        '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],
      },

      spacing: {
        '4.5': '1.125rem',
        '18':  '4.5rem',
      },

      transitionDuration: {
        '250': '250ms',
      },

      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'skeleton': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95) translateY(4px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },

      animation: {
        'fade-in':        'fade-in 0.3s ease-out',
        'fade-in-up':     'fade-in-up 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'skeleton':       'skeleton 1.8s ease-in-out infinite',
        'spin-slow':      'spin-slow 1.2s linear infinite',
        'scale-in':       'scale-in 0.15s ease-out',
      },
    },
  },
  plugins: [],
}
