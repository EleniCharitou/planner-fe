/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        colors: {
            "mainBackgroundColr": '#0D1117',
            "colorBackgroundColor": '#161C22',
        },
      },
    },
    plugins: [],
  };
  