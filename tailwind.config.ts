import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F1A',
        surface: { DEFAULT: '#121826', 2: '#1A2233' },
        accent: { DEFAULT: '#6C8CFF', 2: '#38BDF8' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        control: '10px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'none' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .45s ease-out both',
        float: 'float 6s ease-in-out infinite',
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(108, 140, 255, 0.45)',
      },
    },
  },
  plugins: [typography],
} satisfies Config;
