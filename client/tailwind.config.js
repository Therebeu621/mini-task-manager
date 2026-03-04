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
                    bg: '#f4f7fa',
                    'bg-accent': '#ecf8f6',
                    surface: '#ffffff',
                    'surface-muted': '#f8fafb',
                    'surface-hover': '#f1f5f8',
                    border: '#e2e8f0',
                    'border-hover': '#cbd5e1',
                    text: '#0f1d27',
                    muted: '#5b7282',
                    accent: '#0d9485',
                    'accent-hover': '#0a7a6d',
                    'accent-soft': '#e6f7f5',
                    danger: '#dc2746',
                    'danger-soft': '#fef2f4',
                    success: '#0d8a5e',
                    'success-soft': '#ecfdf5',
                },
            },
            borderRadius: {
                sm: '8px',
                md: '12px',
                lg: '16px',
                xl: '20px',
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(15, 29, 39, 0.04)',
                sm: '0 1px 3px 0 rgba(15, 29, 39, 0.06), 0 1px 2px -1px rgba(15, 29, 39, 0.06)',
                md: '0 4px 6px -1px rgba(15, 29, 39, 0.07), 0 2px 4px -2px rgba(15, 29, 39, 0.05)',
                lg: '0 10px 15px -3px rgba(15, 29, 39, 0.08), 0 4px 6px -4px rgba(15, 29, 39, 0.04)',
                xl: '0 20px 25px -5px rgba(15, 29, 39, 0.08), 0 8px 10px -6px rgba(15, 29, 39, 0.04)',
            },
            fontFamily: {
                sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
            },
            keyframes: {
                'slide-in-right': {
                    from: { transform: 'translateX(100%)' },
                    to: { transform: 'translateX(0)' },
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'fade-in-up': {
                    from: { opacity: '0', transform: 'translateY(8px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    from: { opacity: '0', transform: 'scale(0.96)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
            },
            animation: {
                'slide-in-right': 'slide-in-right 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                'fade-in': 'fade-in 200ms ease-out',
                'fade-in-up': 'fade-in-up 250ms ease-out',
                'scale-in': 'scale-in 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            },
        },
    },
    plugins: [],
};
