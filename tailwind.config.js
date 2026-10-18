/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: "#0B1220",
                    deep: "#03030d",
                    mid: "#0a0c1a",
                    light: "#0a0c1c",
                },
                surface: {
                    DEFAULT: "#0B1220",
                    elevated: "#111827",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: 0, transform: "translateY(4px)" },
                    "100%": { opacity: 1, transform: "translateY(0)" },
                },
                "slide-in": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(0)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.2s ease-out",
                "slide-in": "slide-in 0.2s ease-out",
            },
        },
    },
    plugins: [],
};