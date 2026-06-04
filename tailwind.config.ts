import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a2347",
        copper: "#f2b705",
        teal: "#1768b3",
        cloud: "#f5f8fc",
        line: "#d7dee8",
        success: "#159957",
        info: "#2563eb",
        warning: "#d48514",
        danger: "#c02b3b",
        violet: "#a8b1bf",
        sky: "#4bb7e8",
        lime: "#76a82a",
        sun: "#ffd166"
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(24, 33, 47, 0.12)",
        glow: "0 22px 70px rgba(23, 104, 179, 0.2)",
        lift: "0 16px 34px rgba(23, 32, 51, 0.11)"
      },
      backgroundImage: {
        "mesh-radial":
          "linear-gradient(135deg, rgba(23, 104, 179, 0.14), rgba(255, 255, 255, 0.82) 48%, rgba(242, 183, 5, 0.14)), linear-gradient(180deg, rgba(168, 177, 191, 0.12), rgba(255, 255, 255, 0))",
        "brand-band": "linear-gradient(135deg, #0a2347 0%, #1768b3 52%, #f2b705 100%)"
      }
    }
  },
  plugins: []
};

export default config;
