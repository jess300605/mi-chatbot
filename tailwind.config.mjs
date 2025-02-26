/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        background: "#0D1117", // Fondo oscuro predeterminado
        foreground: "#161B22", // Texto en modo oscuro
        primary: {
          DEFAULT: "#173054", // Azul brillante para resaltar
          foreground: "#d8d8d8",
        },
        secondary: {
          DEFAULT: "#161B22", // Gris oscuro para elementos secundarios
          foreground: "#d8d8d8",
        },
        muted: {
          DEFAULT: "#21262D", // Fondo sutil para tarjetas
          foreground: "#d8d8d8",
        },
      },
    },
  },
  plugins: [],
};
