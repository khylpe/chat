import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");

const config: Config = {
       content: [
              "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
              "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
              "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
              "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
       ],
       darkMode: "class",
       plugins: [nextui()],
};
export default config;
