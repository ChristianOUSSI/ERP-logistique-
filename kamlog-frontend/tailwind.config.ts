import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kamlog: {
          primary: {
            DEFAULT: "var(--color-kamlog-primary)",
            hover: "var(--color-kamlog-primary-hover)",
          },
          secondary: "var(--color-kamlog-secondary)",
          accent: "var(--color-kamlog-accent)",
          danger: "var(--color-kamlog-danger)",
          success: "var(--color-kamlog-success)",
          warning: "var(--color-kamlog-warning)",
          info: "var(--color-kamlog-info)",
        },
        statut: {
          planifie: "var(--color-statut-planifie)",
          "en-chargement": "var(--color-statut-en-chargement)",
          "en-route": "var(--color-statut-en-route)",
          "en-livraison": "var(--color-statut-en-livraison)",
          livre: "var(--color-statut-livre)",
          cloture: "var(--color-statut-cloture)",
        },
        yard: {
          libre: "var(--color-yard-libre)",
          occupe: "var(--color-yard-occupe)",
          reserve: "var(--color-yard-reserve)",
          blocked: "var(--color-yard-blocked)",
        },
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        popover: {
          DEFAULT: "var(--color-popover)",
          foreground: "var(--color-popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--color-destructive)",
          foreground: "var(--color-destructive-foreground)",
        },
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      transitionTimingFunction: {
        kamlog: "var(--ease-kamlog)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        modal: "var(--shadow-modal)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;