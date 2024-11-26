/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-blue': '#00fff9',
        'cyber-pink': '#ff00ff',
        'cyber-yellow': '#f7f700',
        'cyber-purple': '#9900ff',
        'cyber-dark': '#0d0d0d',
        'cyber-gray': '#1a1a1a',
      },
      boxShadow: {
        'neon-blue': '0 0 5px theme(colors.cyber-blue), 0 0 20px theme(colors.cyber-blue)',
        'neon-pink': '0 0 5px theme(colors.cyber-pink), 0 0 20px theme(colors.cyber-pink)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
