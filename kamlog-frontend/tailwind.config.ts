import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        "on-background": "hsl(var(--on-background))",
        
        surface: "hsl(var(--surface))",
        "on-surface": "hsl(var(--on-surface))",
        "surface-variant": "hsl(var(--surface-variant))",
        "on-surface-variant": "hsl(var(--on-surface-variant))",
        
        primary: "hsl(var(--primary))",
        "on-primary": "hsl(var(--on-primary))",
        "primary-container": "hsl(var(--primary-container))",
        "on-primary-container": "hsl(var(--on-primary-container))",
        
        secondary: "hsl(var(--secondary))",
        "on-secondary": "hsl(var(--on-secondary))",
        "secondary-container": "hsl(var(--secondary-container))",
        "on-secondary-container": "hsl(var(--on-secondary-container))",
        
        tertiary: "hsl(var(--tertiary))",
        "on-tertiary": "hsl(var(--on-tertiary))",
        "tertiary-container": "hsl(var(--tertiary-container))",
        "on-tertiary-container": "hsl(var(--on-tertiary-container))",
        
        error: "hsl(var(--error))",
        "on-error": "hsl(var(--on-error))",
        "error-container": "hsl(var(--error-container))",
        "on-error-container": "hsl(var(--on-error-container))",
        
        outline: "hsl(var(--outline))",
        "outline-variant": "hsl(var(--outline-variant))",
        
        // Legacy Support for old classes mapped to HSL
        "surface-container-lowest": "hsl(var(--surface-container-lowest))",
        "surface-container-low": "hsl(var(--surface-container-low))",
        "surface-container": "hsl(var(--surface-container))",
        "surface-container-high": "hsl(var(--surface-container-high))",
        "surface-container-highest": "hsl(var(--surface-container-highest))",
        "primary-fixed": "hsl(var(--primary-container))",
        "on-primary-fixed": "hsl(var(--on-primary-container))",
        "secondary-fixed": "hsl(var(--secondary-container))",
        "on-secondary-fixed": "hsl(var(--on-secondary-container))",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        lg: "calc(var(--radius) + 2px)", 
        xl: "calc(var(--radius) + 6px)",
        full: "9999px",
      },
      spacing: {
        md: "1rem",
        lg: "1.5rem",
        "margin-desktop": "1.5rem",
        "max-width": "1600px",
        sm: "0.75rem",
        xs: "0.5rem",
        gutter: "1rem",
        xl: "2rem",
        xxs: "0.25rem",
      },
      fontFamily: {
        "title-lg": ["Outfit", "sans-serif"],
        "headline-md": ["Outfit", "sans-serif"],
        "title-md": ["Outfit", "sans-serif"],
        "headline-sm": ["Outfit", "sans-serif"],
        "headline-lg": ["Outfit", "sans-serif"],
        "display-lg": ["Outfit", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "data-tabular": ["Inter", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/forms")],
};

export default config;