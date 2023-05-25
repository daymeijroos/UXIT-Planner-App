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
        'dark-teal': '#4E8B88',
        'teal': '#5FCABE',
        'light-teal': '#67E4DD',
        'turquoise': '#87FFF8',
        'rust': '#862B21',
        'coral': '#CD5849',
        'salmon': '#FF897A',
        'gold': '#D2B53B',
        'pale-yellow': '#EED369',
        'black': '#000000',
        'charcoal': '#252830',
        'slate': '#2B303C',
        'blue-grey': '#4C566D',
        'steel': '#6D7A99',
        'white': '#FFFFFF',
        'light-grey': '#D3D3D3',
        'medium-grey': '#B1B1B1',
        'red-orange': '#C02E1D',
      },
    },
    strokeWidth:{
      "3":"3",
      "5":"5"
    }
  },
  plugins: [],
}

