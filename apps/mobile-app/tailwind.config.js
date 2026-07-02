/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF8C00", // amber-600, your primary CTA/accent color
          light: "#F59E0B",   // amber-500, selected states
          subtle: "#FEF3C7",  // amber-50, selected backgrounds
          continue: "#B92020",
          text: "#374151",    // gray-700, icon/body text
          muted: "#9CA3AF",   // gray-400, secondary text
          border: "#E5E7EB",  // gray-200, borders
          bg: "#F9FAFB",      // gray-50, subtle backgrounds
        },
        ink: {
          DEFAULT: "#1C1410", // bg dark brown
          light: "#2C1E14",   // bg lighter brown
        },
      },
    },
  },
  plugins: [],
}
