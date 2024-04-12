import { nextui } from "@nextui-org/react";
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "elg-blue": "#002D72",
        "elg-red": "#D50032",
        "elg-white": "#fff",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      backgroundImage: {
        mw3_team_background: "url('/images/mw3_team_background.png')",
        credit_bg: "url('/images/credits-bg.jpg)",
        hero_bg: "url('/images/hero-bg.jpg')",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
