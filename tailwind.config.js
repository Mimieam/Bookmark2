/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#5d4daf",
          "secondary": "#18e0c2",
          "accent": "#43f27b",
          "neutral": "#191C24",
          "base-100": "#4C2E4D",
          "info": "#3D69D1",
          "success": "#2BDE8E",
          "warning": "#FB9209",
          "error": "#EC3418",
        },
      },
    ],
  },
};