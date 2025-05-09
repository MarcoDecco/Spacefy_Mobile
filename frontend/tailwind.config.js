/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'light-blue': '#6ACDFF',
        'blue': '#1EACE3',
        'dark-blue': '#1486B8',
        'white': '#FCFCFC',
        'dark-yellow': '#F0D500',
        'light-gray': '#E3E3E3',
        'dark-gray': '#2F2F2F',
      },
    },
  },
  plugins: [],
} 