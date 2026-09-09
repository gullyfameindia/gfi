
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E91E63",
        secondary: "#FFC107",
        background: "#121212",
      },
      fontFamily: {
        
        sans: ["Rubik_400Regular", "sans-serif"],
     
      },
    },
  },
  plugins: [],
};
