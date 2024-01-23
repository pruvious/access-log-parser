const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('hocus', ['&:hover', '&:focus'])
      addVariant('group-hocus', ['.group:hover &', '.group:focus &'])
    }),
  ],
}
