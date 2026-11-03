import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "24px",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Official Brand Palette
        steel: {
          DEFAULT: "#929DA7",
          light: "#B4BDC5",
          dark: "#717D88",
        },
        charcoal: {
          DEFAULT: "#17191C",
          surface: "#1F2327",
          line: "#2A2E34",
        },
        coral: {
          DEFAULT: "#FF4B32",
          hover: "#E03820",
          tint: "rgba(255, 75, 50, 0.08)",
          glow: "rgba(255, 75, 50, 0.25)",
        },
        offwhite: {
          DEFAULT: "#F5F6F7",
          2: "#EBECEE",
        },
        textPrimary: "#17191C",
        textSecondary: "#5F6871",
        customBorder: "#D8DDE2",

        // Aliases for legacy component compatibility mapped to new palette
        ink: {
          DEFAULT: "#17191C",
          raised: "#1F2327",
          line: "#2A2E34",
        },
        red: {
          DEFAULT: "#FF4B32",
          dark: "#E03820",
          tint: "rgba(255, 75, 50, 0.08)",
        },
        gold: {
          DEFAULT: "#FF4B32",
          tint: "rgba(255, 75, 50, 0.12)",
        },
        petrobody: "#5F6871",
        petromuted: "#929DA7",
        surface: {
          DEFAULT: "#F5F6F7",
          2: "#EBECEE",
        },
        petroborder: "#D8DDE2",
      },
      fontFamily: {
        head: ["'Plus Jakarta Sans'", "'Segoe UI'", "system-ui", "-apple-system", "sans-serif"],
        body: ["'Inter'", "'Segoe UI'", "system-ui", "-apple-system", "sans-serif"],
        sans: ["'Inter'", "'Segoe UI'", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "4px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        petrosm: "0 1px 2px rgba(23, 25, 28, 0.05), 0 2px 6px rgba(23, 25, 28, 0.03)",
        petromd: "0 4px 12px rgba(23, 25, 28, 0.08), 0 2px 4px rgba(23, 25, 28, 0.04)",
        petrolg: "0 12px 32px rgba(23, 25, 28, 0.12), 0 4px 8px rgba(23, 25, 28, 0.06)",
        coralGlow: "0 10px 40px -10px rgba(255, 75, 50, 0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
