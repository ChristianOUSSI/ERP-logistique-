import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Module colors for Version 2.0
        'shift-planning': '#FF6B6B',
        'port-pricing': '#4ECDC4',
        'gps-tracking': '#45B7D1',
        'real-customs': '#96CEB4',
        'port-incidents': '#FFEAA7',
        'auto-invoicing': '#DDA0DD',
        'port-performance': '#98D8C8',
        'notification-system': '#F7DC6F',
        'container-lifecycle': '#BB8FCE',
        'partner-api': '#85C1E9',
        
        // Gold accent for premium feel
        'gold': {
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFCF33',
          500: '#FFC300',
          600: '#CC9C00',
          700: '#997500',
          800: '#664E00',
          900: '#332700',
        },
      },
    },
  },
  plugins: [],
}
export default config