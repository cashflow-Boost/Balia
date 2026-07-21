import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Direction artistique Tome 21 : chaleureux, pas "tech froide".
        // Wordmark lisible + une couleur d'accent. À remplacer par le kit de marque final.
        balia: {
          DEFAULT: "#0f766e",
          accent: "#f59e0b",
          ink: "#0b1f24",
        },
      },
    },
  },
  plugins: [],
};

export default config;
