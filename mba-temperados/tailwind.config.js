/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    // "nav": a partir de 960px o menu completo aparece no topo (sem o botão de menu)
    screens: {
      sm: '640px',
      md: '768px',
      nav: '960px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Amarelo da marca (botões, destaques, ícones)
        brand: {
          DEFAULT: '#FFC93C',
          light: '#FFD15C',
          soft: '#FFF6DD',
          deep: '#8A6100',
        },
        // Laranja da seta do card flutuante
        accent: '#FF7A00',
        // Tons escuros e textos
        ink: {
          DEFAULT: '#0E1116',
          soft: '#1A1F27',
          muted: '#5B6472',
        },
        // Superfícies escuras (tons do céu ao entardecer da hero), do mais fundo ao mais claro
        night: {
          950: '#06080D',
          900: '#0A0F17',
          850: '#0D1320',
          800: '#111A2A',
          700: '#18233A',
          600: '#22304A',
        },
        // Textos sobre fundo escuro
        mist: {
          100: '#F4F6FA',
          200: '#D6DDE8',
          300: '#AEB9CB',
          400: '#8592A8',
        },
        // Azul da logo (vidro)
        glass: {
          DEFAULT: '#3D93D8',
          light: '#8DCBF7',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(14,17,22,.04), 0 12px 32px -14px rgba(14,17,22,.18)',
        'card-hover': '0 2px 4px rgba(14,17,22,.05), 0 24px 48px -18px rgba(14,17,22,.28)',
        brand: '0 12px 28px -10px rgba(255,201,60,.75), 0 2px 6px rgba(0,0,0,.18)',
        'brand-sm': '0 8px 18px -8px rgba(255,201,60,.8)',
        float: '0 24px 60px -18px rgba(0,0,0,.45), 0 4px 12px rgba(0,0,0,.12)',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
};
