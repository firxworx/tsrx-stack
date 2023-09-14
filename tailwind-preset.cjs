// @ts-check

const defaultTheme = require('tailwindcss/defaultTheme')

// const {
//   round,
//   rem,
//   em,
//   colord,
//   alpha,
//   lighten,
//   darken,
//   rgbToCssVar,
//   rgbToHslCssVar,
//   hslToCssVar,
//   genTwRgbColorClass,
//   genTwHslColorClass,
// } = require('./tailwind-utils.cjs')

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  darkMode: ['class'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    // custom screen breakpoints including xs + xxs
    // ~320px is ~ smallest typical smartphone width (e.g. iPhone 4 form factor)
    screens: {
      xmini: '315px',
      xxs: '400px',
      xs: '475px',
      ...defaultTheme.screens,
      '2xl': '1400px',
      '3xl': '1600px',
    },
    extend: {
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        border: 'hsl(var(--border))',
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      // @todo compete migration of Modal/Dialog to tailwind-preset
      // (currently in the base css file of the react ui)
      // keyframes: {
      //   'dialog-overlay-show': {
      //     from: { opacity: 0 },
      //     to: { opacity: 1 },
      //   },
      //   'dialog-overlay-hide': {
      //     from: { opacity: 1 },
      //     to: { opacity: 0 },
      //   },
      //   'dialog-content-show': {
      //     from: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.95)' },
      //     to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
      //   },
      //   'dialog-content-hide': {
      //     from: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
      //     to: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.95)' },
      //   },
      // },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),

    // custom preset inline plugins
    function ({ addBase, config }) {
      addBase({
        ':root': {
          // '--fx-bg-color': rgbToCssVar(theme('colors.slate.50')),
          '--radius': '0.5rem',

          '--accent': '210 40% 96.1%',
          '--accent-foreground': '222.2 47.4% 11.2%',

          '--popover': '0 0% 100%',
          '--popover-foreground': '222.2 47.4% 11.2%',
        },
        '.dark': {
          '--accent': '216 34% 17%',
          '--accent-foreground': '210 40% 98%',

          '--popover': '224 71% 4%',
          '--popover-foreground': '215 20.2% 65.1%',
        },
        html: {
          // always show vertical scrollbar to avoid jank during transitions due to scrollbar width
          // breaks radix-ui and their insistence to use that awful scroll library
          // overflowY: 'scroll',
        },
        body: {
          // remove input type=number spinner on chrome/safari/edge/opera
          'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: '0',
          },
          // remove input type=number spinner on firefox
          'input[type="number"]': {
            '-moz-appearance': 'textfield',
          },
        },
        'h1,h2,h3,h4,h5,h6': {
          '@apply text-slate-700': {},
        },
        main: {
          '@apply text-slate-800': {},
        },
      })
    },
  ],
}
