import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        bg: {
          primary: "hsl(var(--bg-primary))",
          card: "hsl(var(--bg-card))",
          "card-hover": "hsl(var(--bg-card-hover))",
          elevated: "hsl(var(--bg-elevated))",
        },
        accent: {
          blue: "hsl(var(--accent-blue))",
          green: "hsl(var(--accent-green))",
          amber: "hsl(var(--accent-amber))",
          red: "hsl(var(--accent-red))",
          purple: "hsl(var(--accent-purple))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          tertiary: "hsl(var(--text-tertiary))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--bg-primary))",
        foreground: "hsl(var(--text-primary))",
        primary: {
          DEFAULT: "hsl(var(--accent-blue))",
          foreground: "hsl(var(--text-primary))",
        },
        secondary: {
          DEFAULT: "hsl(var(--bg-card))",
          foreground: "hsl(var(--text-primary))",
        },
        destructive: {
          DEFAULT: "hsl(var(--accent-red))",
          foreground: "hsl(var(--text-primary))",
        },
        muted: {
          DEFAULT: "hsl(var(--bg-card))",
          foreground: "hsl(var(--text-secondary))",
        },
        card: {
          DEFAULT: "hsl(var(--bg-card))",
          foreground: "hsl(var(--text-primary))",
        },
        popover: {
          DEFAULT: "hsl(var(--bg-elevated))",
          foreground: "hsl(var(--text-primary))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 30% 20%, hsla(var(--accent-blue) / 0.15), transparent 40%), radial-gradient(circle at 80% 90%, hsla(var(--accent-purple) / 0.12), transparent 45%)",
        "hero-glow":
          "radial-gradient(600px circle at 50% -10%, hsla(var(--accent-blue) / 0.35), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px 0 hsla(var(--accent-blue) / 0.35)",
        "glow-green": "0 0 30px 0 hsla(var(--accent-green) / 0.35)",
        card: "0 8px 24px -8px rgba(0,0,0,0.4), 0 1px 0 0 rgba(255,255,255,0.04) inset",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "flame-pulse": {
          "0%,100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.06)", opacity: "0.9" },
        },
        "ring-glow": {
          "0%,100%": { filter: "drop-shadow(0 0 6px hsla(var(--accent-blue) / 0.6))" },
          "50%": { filter: "drop-shadow(0 0 14px hsla(var(--accent-blue) / 0.9))" },
        },
      },
      animation: {
        "fade-in": "fade-in 400ms cubic-bezier(0.4,0,0.2,1) both",
        shimmer: "shimmer 1.6s linear infinite",
        "flame-pulse": "flame-pulse 2s ease-in-out infinite",
        "ring-glow": "ring-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
