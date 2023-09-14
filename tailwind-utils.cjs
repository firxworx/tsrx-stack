// @ts-check

// colord is a useful library for manipulating colors
const colord = require('colord').colord

// when setting colors via css variables take care to specify them correctly to support opacity modifiers
// @see https://tailwindcss.com/docs/customizing-colors#using-css-variables

/**
 * Round utility borrowed from tailwindcss-typography.
 *
 * @param {number} num
 * @returns {string}
 *
 * @see https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
 */
const round = (num) =>
  num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')

/**
 * rem unit utility borrowed from tailwindcss-typography.
 *
 * @param {number} px
 * @returns {string}
 *
 * @see https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
 */
const rem = (px) => `${round(px / 16)}rem`

/**
 * em unit utility borrowed from tailwindcss-typography.
 *
 * @param {number} px
 * @param {number} base
 * @returns {string}
 *
 * @see https://github.com/tailwindlabs/tailwindcss-typography/blob/master/src/styles.js
 */
const em = (px, base) => `${round(px / base)}em`

/**
 * Adjust the alpha (transparency) value of a color using the colord library.
 *
 * @param {import('colord').AnyColor | import('colord').Colord} c - initial color accepted in any format recognized by colord
 * @param {number} value - alpha value to set: a number between 0 (transparent) and 1 (opaque).
 * @returns {string} RGB color string with the adjusted alpha value
 */
const alpha = (c, value) => colord(c).alpha(value).toRgbString()

/**
 * Lighten a color by a specific amount using the colord library.
 *
 * @param {import('colord').AnyColor | import('colord').Colord} c - initial color accepted in any format recognized by colord
 * @param {number} value - amount to lighten the color between 0 (no change) and 1 (completely white)
 * @returns {string} RGB color string with the lightened color
 */
const lighten = (c, value) => colord(c).lighten(value).toRgbString()

/**
 * Darken a color by a specific amount using the colord library.
 *
 * @param {import('colord').AnyColor | import('colord').Colord} c - initial color accepted in any format recognized by colord
 * @param {number} value - amount to darken the color between 0 (no change) and 1 (black)
 * @returns {string} RGB color string with the darkened color
 */
const darken = (c, value) => colord(c).darken(value).toRgbString()

/**
 * Convert a given RGB color value to RGB color channels for defining CSS variables in the format required by tailwind.
 *
 * Tailwind requires this format e.g. `255 115 179` (i.e. _without_ a color space function such as `rgb()` or `hsl()`)
 * so that it can support opacity modifiers. Tailwind adds its own `rgba()` function under the hood with the given
 * color channel values and the required opacity modifier.
 *
 * @param {string} rgbColor
 * @returns {string}
 *
 * @see https://tailwindcss.com/docs/customizing-colors#using-css-variables
 */
function rgbToCssVar(rgbColor) {
  const { r, g, b } = colord(rgbColor).toRgb()
  return `${r} ${g} ${b}`
}

/**
 * Convert a given RGB color value to HSL channels for defining CSS variables in the format required by tailwind.
 * Useful for overriding shadcn/ui values as it uses HSL.
 *
 * @param {string} rgbColor
 * @returns {string}
 * @see https://tailwindcss.com/docs/customizing-colors#using-css-variables
 */
function rgbToHslCssVar(rgbColor) {
  const { h, s, l } = colord(rgbColor).toHsl()
  console.log(`converted color is: ${Math.round(h)} ${Math.round(s * 100) / 100}% ${Math.round(l * 100) / 100}%`)
  return `${Math.round(h)} ${Math.round(s * 100) / 100}% ${Math.round(l * 100) / 100}%`
}

/**
 * @param {string} hslColor
 * @returns {string}
 * @see https://tailwindcss.com/docs/customizing-colors#using-css-variables
 */
function hslToCssVar(hslColor) {
  const { h, s, l } = colord(hslColor).toHsl()
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/**
 * Helper that returns the css color value corresponding to a given RGB css variable name in the
 * format required by tailwind.
 *
 * e.g. `rgb(var(--${cssVariableName}) / <alpha-value>)`
 *
 * Tailwind uses the `<alpha-value>` placeholder to inject the opacity.
 *
 * @param {string} cssVariableName
 * @returns {string}
 *
 * @see https://tailwindcss.com/docs/customizing-colors#using-css-variables
 */
const genTwRgbColorClass = (cssVariableName) => {
  return `rgb(var(--${cssVariableName}) / <alpha-value>)`
}

/**
 * Return the css color value corresponding to a given HSL css variable name in the format required
 * by tailwind that supports the opacity utilities per the docs.
 *
 * e.g. `hsl(var(--${cssVariableName}) / <alpha-value>)`
 *
 * Tailwind uses the `<alpha-value>` placeholder to inject the opacity.
 *
 * @param {string} cssVariableName
 * @returns {string}
 *
 * @see https://tailwindcss.com/docs/customizing-colors#using-css-variables
 */
const genTwHslColorClass = (cssVariableName) => {
  return `hsl(var(--${cssVariableName}) / <alpha-value>)`
}

module.exports = {
  round,
  rem,
  em,
  colord,
  alpha,
  lighten,
  darken,
  rgbToCssVar,
  rgbToHslCssVar,
  hslToCssVar,
  genTwRgbColorClass,
  genTwHslColorClass,
}
