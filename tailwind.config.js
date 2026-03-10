// tailwind.config.js
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        colors: {
          "primary": "#89cf07",
          "background-light": "#f7f8f5",
          "background-dark": "#1c230f",
        },
        fontFamily: {
          "display": ["Manrope", "sans-serif"]
        }
      },
    },
    plugins: [],
  }