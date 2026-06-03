import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#f5f5f7",
        "bg-subtle": "#ebebed",
        surface: "#ffffff",
        "surface-raised": "#ffffff",
        "surface-secondary": "#f2f2f7",
        "surface-glass": "rgba(255, 255, 255, 0.78)",
        border: "rgba(60, 60, 67, 0.12)",
        "border-strong": "rgba(60, 60, 67, 0.18)",
        brand: {
          DEFAULT: "#0071e3",
          bright: "#0077ed",
          dim: "#0066cc",
        },
        gold: {
          DEFAULT: "#0071e3",
          bright: "#0077ed",
          dim: "#0066cc",
        },
        champagne: "#1d1d1f",
        text: "#1d1d1f",
        "text-secondary": "#86868b",
        muted: "#aeaeb2",
        sage: "#34c759",
        rose: "#ff3b30",
        red: "#ff3b30",
        pearl: "#8e8e93",
        "amber-soft": "#ff9500",
        accent: "#0071e3",
        green: "#34c759",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"SF Pro Display"',
          "system-ui",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        heading: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          "system-ui",
          "sans-serif",
        ],
        body: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          "system-ui",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        apple: "12px",
        "apple-lg": "16px",
      },
      boxShadow: {
        premium:
          "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        card: "0 2px 8px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0, 0, 0, 0.06)",
        gold: "0 2px 8px rgba(0, 113, 227, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
