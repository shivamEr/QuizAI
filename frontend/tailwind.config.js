/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#DFF2EB',
        'card': '#FFFFFF',
        'border': '#B9E5E8',
        'text': '#4A628A',
        'primary': '#7AB2D3',
        'primary-dark': '#629EC5', // A slightly darker shade for hover
        'secondary': '#10B981',
        'danger': '#E53E3E',
      }
    },
  },
  plugins: [],
}

