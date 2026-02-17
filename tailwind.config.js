export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Brand
        primary: {
          DEFAULT: "#3D5CFF",
          hover: "#2D4AE5",
          light: "#EBF0FF",
        },
        // Secondary/Accents
        cyan: "#27D9E8",
        // Success States
        "mint-green": "#B5F5D9",
        teal: {
          DEFAULT: "#4FD1C5",
          light: "#E6FFFA",
        },
        // Error States
        coral: {
          DEFAULT: "#FF6B6B",
          light: "#FEE2E2",
        },
        "deep-red": "#C94141",
        // Semantic Colors
        background: {
          light: "#F3F4F6",
          dark: "#111827",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#1F2937",
        },
        "text-primary": "#111827",
        "text-secondary": "#6B7280",
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        "primary-glow": "0 10px 25px -5px rgba(61, 92, 255, 0.3)",
        "teal-glow": "0 10px 25px -5px rgba(79, 209, 197, 0.4)",
      },
    },
  },
  plugins: [],
}
