import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e4f0',
          900: '#0d1b2a',
          950: '#070e17',
        },
        gold: {
          400: '#d4aa6e',
          500: '#c8a96e',
          600: '#b8944d',
        },
        sand: '#f5f0e8',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#1a1a1a',
            '--tw-prose-headings': '#0d1b2a',
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
