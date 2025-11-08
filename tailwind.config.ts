module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {
      fontFamily: {
        // advent: ['"Advent Pro"', 'sans-serif'],
        // marcellus: ['Marcellus', 'serif'],
        advent: ['var(--font-advent)'],
        marcellus: ['var(--font-marcellus)'],
      },
      screens: {
        xs: "480px",
        sm: '640px',  // Small screens
        md: '768px',  // Medium screens
        lg: '1024px', // Large screens
        xl: '1280px', // Extra large screens
        '2xl': '1536px', // 2X large screens
        '3xl': '1822px', // 3X large screens
        '4xl': '2048px', // 4X large screens
      },
      lineHeight: {
        tight: '1',
      },
      letterSpacing: {
        normal: '0',
      },
      fontSize: {
        base: '16px',
      },
    },
  },
  plugins: [],
}
