/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        chat: {
          bg: "white",
          iconHover: "#ffb938",
          sidebar: "white",
          panel: "#F7F5F3",
          surface: "#f5f5f7",       // Light gray for subtle contrast against white
          border: "#e5e5e5",        // Softened from black to a light gray for a modern look
          accent: "#ffb938",        // Keeping your signature purple
          "accent-light": "#9d8ff",
          "accent-dim": "#7c6af715",
          sent: "#7c6af7",          // White text will pop well on this
          received: "#eeeef2",      // Slightly darker than the surface for bubble distinction
          online: "#22c55e",        // Standard emerald green for light mode
          text: "#1a1a1e",          // Dark charcoal for high readability
          muted: "#64748b",         // Slate gray for secondary information
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "bubble-pop": {
          "0%": { opacity: "0", transform: "scale(0.85) translateY(6px)" },
          "60%": { transform: "scale(1.03) translateY(-1px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
      },
      animation: {
        "bubble-pop": "bubble-pop 0.25s ease-out forwards",
        "fade-in": "fade-in 0.2s ease-out forwards",
        "slide-in": "slideIn 0.2s ease-out",
        "fade-in": "fadeIn 0.15s ease-out",
        "pulse-dot": "pulseDot 1.5s infinite",
        "bounce-dot": "bounceDot 1s infinite",
      },
    },
  },
  plugins: [],
}
