/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    darkMode: 'class',
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '1rem',
                lg: '1.5rem',
            },
            screens: {
                '2xl': '1180px',
            },
        },
        extend: {
            colors: {
                app: {
                    bg: '#f3f7fb',
                    'bg-accent': '#eaf7f5',
                    surface: '#ffffff',
                    'surface-muted': '#f7fafc',
                    border: '#dce7ef',
                    text: '#122029',
                    muted: '#5d7180',
                    accent: '#0f7a6c',
                    'accent-hover': '#0b5f54',
                    danger: '#c0334d',
                    success: '#136d53',
                },
            },
            borderRadius: {
                sm: '10px',
                md: '14px',
                lg: '18px',
            },
            boxShadow: {
                sm: '0 6px 18px rgba(18, 32, 41, 0.06)',
                md: '0 14px 36px rgba(18, 32, 41, 0.12)',
            },
            fontFamily: {
                sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
