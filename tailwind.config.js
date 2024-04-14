const theme = require('tailwindcss/defaultTheme.js')
const colors = require('tailwindcss/colors.js')

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
          louder: primary[100],
          loud: primary[300],
          DEFAULT: primary[500],
          muted: primary[600],
          faint: primary[700]
        },
        secondary: {
          louder: secondary[100],
          loud: secondary[300],
          DEFAULT: secondary[500],
          muted: secondary[600],
          faint: secondary[700]
        }
      },
      backgroundColor: {
        primary: {
          DEFAULT: primary[950],
          muted: primary[800],
          faint: primary[900]
        },
        secondary: {
          DEFAULT: secondary[950],
          muted: secondary[800],
          faint: secondary[900]
        }
      },
      borderColor: {
        primary: {
          DEFAULT: primary[900]
        }
      },
      ringColor: {
        primary: {
          DEFAULT: primary[900]
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
