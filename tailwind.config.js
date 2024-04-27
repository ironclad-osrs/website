const theme = require('tailwindcss/defaultTheme.js')
const colors = require('tailwindcss/colors.js')

const body = colors.white
const primary = colors.stone
const secondary = colors.orange

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary,
        secondary
      },
      textColor: {
        primary: {
          louder: primary[900],
          loud: primary[800],
          DEFAULT: primary[600],
          muted: primary[500],
          faint: primary[400]
        },
        secondary: {
          louder: secondary[900],
          loud: secondary[800],
          DEFAULT: secondary[600],
          muted: secondary[500],
          faint: secondary[400]
        }
      },
      backgroundColor: {
        primary: {
          DEFAULT: body,
          muted: primary[100],
          faint: primary[50]
        },
        secondary: {
          DEFAULT: body,
          muted: secondary[100],
          faint: secondary[50]
        }
      },
      borderColor: {
        primary: {
          DEFAULT: primary[200]
        }
      },
      ringColor: {
        primary: {
          DEFAULT: primary[200]
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...theme.fontFamily.sans],
        mono: ['var(--font-mono)', ...theme.fontFamily.mono]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
