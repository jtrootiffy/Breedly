/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#80A1C1',
          cream: '#EEE3AB',
          emerald: '#07B07B',
        },
        // Custom grades based on API
        grade: {
          A: '#22c55e',
          B: '#84cc16',
          C: '#eab308',
          D: '#f59e0b',
          E: '#ef4444',
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}