module.exports = {
    content: ['./src/**/*.{html,ts}'],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
      extend: { 

      },
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('@tailwindcss/forms'),
      require('@tailwindcss/line-clamp'),
      require('@tailwindcss/aspect-ratio')
    ],
}