/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: 'color-mix(in srgb, var(--color-primary) 5%, white)',
          100: 'color-mix(in srgb, var(--color-primary) 10%, white)',
          200: 'color-mix(in srgb, var(--color-primary) 20%, white)',
          300: 'color-mix(in srgb, var(--color-primary) 30%, white)',
          400: 'color-mix(in srgb, var(--color-primary) 40%, white)',
          500: 'color-mix(in srgb, var(--color-primary) 50%, white)',
          600: 'var(--color-primary)',
          700: 'color-mix(in srgb, var(--color-primary) 10%, black)',
          800: 'color-mix(in srgb, var(--color-primary) 20%, black)',
          900: 'color-mix(in srgb, var(--color-primary) 30%, black)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          50: 'color-mix(in srgb, var(--color-secondary) 5%, white)',
          100: 'color-mix(in srgb, var(--color-secondary) 10%, white)',
          200: 'color-mix(in srgb, var(--color-secondary) 20%, white)',
          300: 'color-mix(in srgb, var(--color-secondary) 30%, white)',
          400: 'color-mix(in srgb, var(--color-secondary) 40%, white)',
          500: 'color-mix(in srgb, var(--color-secondary) 50%, white)',
          600: 'var(--color-secondary)',
          700: 'color-mix(in srgb, var(--color-secondary) 20%, black)',
          800: 'color-mix(in srgb, var(--color-secondary) 30%, black)',
          900: 'color-mix(in srgb, var(--color-secondary) 40%, black)',
        },
      },
    },
  },
  plugins: [],
}

