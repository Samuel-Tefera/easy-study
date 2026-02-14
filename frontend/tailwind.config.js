/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        background: "#F9FAFB", // gray-50
        foreground: "#111827", // gray-900
        muted: {
          DEFAULT: "#F3F4F6", // gray-100
          foreground: "#6B7280", // gray-500
        },
        accent: {
          DEFAULT: "#F3F4F6", // gray-100
          foreground: "#111827", // gray-900
        },
        border: "#E5E7EB", // gray-200
        input: "#E5E7EB", // gray-200
        ring: "#4F46E5", // indigo-600
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [],
}
