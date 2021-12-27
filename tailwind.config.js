module.exports = {
    purge: {
      enabled: true,
      content: ['./src/**/*.{html,ts}']
    },
    darkMode: 'media', // or 'media' or 'class'
    theme: {
      extend: { 
      },
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms'),
      require('@tailwindcss/line-clamp'),
      require('@tailwindcss/aspect-ratio')
    ],
}