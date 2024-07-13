import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "hsl(142, 75%, 49%)",
        primaryHover: "hsl(142, 88%, 40%)",
        primaryLight: "hsl(142, 88%, 90%)",
        text: "rgb(36, 50, 66)",
        darkBlue: "hsl(228, 39%, 23%)",
        darkGrayishBlue: "hsl(227, 12%, 50%)",
        veryDarkBlue: "hsl(233, 12%, 13%)",
        veryPaleRed: "hsl(143, 100%, 86%)",
        veryLightGray: "hsl(233, 100%, 98%)",
      },
    },
  },
  plugins: [],
};
export default config;
