// tailwind.config.js
// Idiomatic Tailwind configuration for Cyberknights Forge Color Palette
module.exports = {
  content: [
    "./index.html",
    "./blogs/*.html", 
    "./guides/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // CYBERKNIGHT FORGE COLOR PALETTE
        // Direct color values for idiomatic Tailwind usage
        'forge-black': '#001011',      // Deep forge darkness
        'iron-ash': '#1C1C1C',         // Dark charcoal base
        'dark-steel': '#3A3A3A',       // Darker metallic tone
        'steel-glow': '#5B6E6E',       // Metallic sheen
        'silver-edge': '#8A8A8A',      // Mid-tone metal
        'pale-alloy': '#B8B8B8',       // Light metallic
        'primary-green': '#04703C',    // Deep forest green
        'primary-green-light': '#0A8B4F', // Lighter variant for hover
        'neon-surge': '#43CC50',       // Visor glow; ancillary accent
        'ember-spark': '#C27329',      // Flying sparks; warm accent - CANONICAL ORANGE
        'ember-spark-light': '#D4843A', // Lighter orange for hover states
        'arc-weld-blue': '#2DB2C4',    // Electric arc welding
        'molten-glow': '#FFCC33',      // Bright molten metal
      },
      boxShadow: {
        'neon': '0 0 60px rgba(16, 185, 129, 0.5)',
        'neon-sm': '0 0 20px rgba(16, 185, 129, 0.3)',
        'spark': '0 0 8px 0 rgba(34, 197, 94, 0.25)',
        'spark-glow': '0 0 16px 2px rgba(245, 158, 11, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'text-change': 'textChange 0.8s ease-out',
        'spark-pulse': 'sparkPulse 2.4s ease-in-out infinite',
        'input-flash': 'inputFlash 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        textChange: {
          '0%': { opacity: '0.7', transform: 'scale(0.98)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        sparkPulse: {
          '0%, 100%': {
            boxShadow: '0 0 8px 0 rgba(34, 197, 94, 0.25), 0 0 0 0 rgba(245, 158, 11, 0.0)',
            borderColor: '#22c55e',
          },
          '50%': {
            boxShadow: '0 0 16px 2px rgba(34, 197, 94, 0.4), 0 0 24px 4px rgba(245, 158, 11, 0.3)',
            borderColor: '#f59e0b',
          },
        },
        inputFlash: {
          '0%': {
            borderColor: '#475569',
            boxShadow: '0 0 0 0 rgba(245, 158, 11, 0)',
          },
          '50%': {
            borderColor: '#f59e0b',
            boxShadow: '0 0 12px 2px rgba(245, 158, 11, 0.4)',
          },
          '100%': {
            borderColor: '#475569',
            boxShadow: '0 0 0 0 rgba(245, 158, 11, 0)',
          },
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [],
}