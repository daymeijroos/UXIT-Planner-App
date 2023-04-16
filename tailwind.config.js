/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#fff",
      lightGrey: "#D3D3D3",
      grey: "#B1B1B1",
      lightBlueishGrey: "#6A7B9C",
      blueishGrey: "#4A566F",
      darkBlueishGrey: "#2A303D",
      darkGrey: "#242831",
      black: "#000",

      lightRed: "#DD4E41",
      red: "#D11303",

      lightGreen: "#B1C680",
      green: "#7E934B",

      lightYellow: "#F4D253",
      yellow: "#D8B400",
    },
  },
  plugins: [],
}

