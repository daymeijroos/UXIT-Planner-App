/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Nunito Sans", "sans-serif"],
    },
    extend: {
      colors: {
        'teal': {
          '300': '#4E8B88',
          '400': '#5FCABE',
          '500': '#67E4DD',
          '600': '#87FFF8',
        },
        'red': {
          '300': '#862B21',
          '400': '#C02E1D',
          '500': '#CD5849',
          '600': '#FF897A',
        },
        'yellow': {
          '400': '#D2B53B',
          '500': '#EED369',
        },
        'blue-gray': {
          '300': '#252830',
          '400': '#2B303C',
          '500': '#4C566D',
          '600': '#6D7A99',
        },
        'gray': {
          '400': '#B1B1B1',
          '500': '#D3D3D3',
        },
        'white': '#FFFFFF',
        'black': '#000000',
      },
    },
    strokeWidth: {
      "3": "3",
      "5": "5"
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  }
};