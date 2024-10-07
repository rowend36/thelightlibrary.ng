import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/{*,*/*,*/*/*}/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#18206f",
        muted: "#dff8eb",
        themeGrey: "#cdcdcd",
        secondary: "#bd1e1e",
        tertiary: "#e8871e",
        primaryHover: "#7EC8E3",
        primaryLight: "#0000FF",
        text: "#484554", // Gray friends - Colors
        primaryDark: "#050A30",
      },
    },
  },
  plugins: [],
};
export default config;
