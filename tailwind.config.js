/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        charcoal: {
          950: "rgba(var(--theme-bg-base-rgb), <alpha-value>)",
          900: "rgba(var(--theme-bg-surface-rgb), <alpha-value>)",
          850: "rgba(var(--theme-bg-elevated-rgb), <alpha-value>)",
          800: "rgba(var(--theme-bg-elevated-rgb), <alpha-value>)",
          700: "rgba(var(--theme-bg-subtle-rgb), <alpha-value>)",
          600: "rgba(var(--theme-bg-subtle-rgb), <alpha-value>)",
        },
        ivory: {
          50: "rgba(var(--theme-fg-base-rgb), <alpha-value>)",
          100: "rgba(var(--theme-fg-base-rgb), <alpha-value>)",
          200: "rgba(var(--theme-fg-secondary-rgb), <alpha-value>)",
          300: "rgba(var(--theme-fg-muted-rgb), <alpha-value>)",
          400: "rgba(var(--theme-fg-subtle-rgb), <alpha-value>)",
        },
        gold: {
          300: "rgba(var(--theme-gold-300-rgb), <alpha-value>)",
          400: "rgba(var(--theme-gold-400-rgb), <alpha-value>)",
          500: "rgba(var(--theme-accent-gold-rgb), <alpha-value>)",
          600: "#B89225",
          700: "#8C6E16",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ["Cinzel", "Playfair Display", "Georgia", "serif"],
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        editorial: ["Cinzel Decorative", "Cinzel", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.4 },
          "50%": { opacity: 0.8 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        glow: "pulseGlow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
