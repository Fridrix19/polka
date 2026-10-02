// Пресет PrimeVue для Polka: бумага, чернила, вермильон, прямые углы
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export default definePreset(Aura, {
  primitive: {
    borderRadius: { none: '0', xs: '0', sm: '0', md: '0', lg: '0', xl: '0' },
    blue: { 50: '#FBEDE6', 100: '#F7D9CC', 200: '#F0B9A2', 300: '#E89474', 400: '#E06A43', 500: '#D8431C', 600: '#B8381A', 700: '#8F2A12', 800: '#6E200E', 900: '#4E170A', 950: '#2E0D05' },
    ink:  { 0: '#FFFFFF', 50: '#FBF8F1', 100: '#F2EDE3', 200: '#E1D9C9', 300: '#C6BDAD', 400: '#A79E8E', 500: '#8A8172', 600: '#6B6355', 700: '#4D463A', 800: '#3A342A', 900: '#24201A', 950: '#1A1712' },
    green: { 400: '#9CC47E', 600: '#3F6B2F' }, amber: { 400: '#F0B14A', 600: '#8F5400' }, red: { 400: '#FF7B6B', 600: '#B42318' }
  },
  semantic: {
    primary: { 50: '{blue.50}', 100: '{blue.100}', 200: '{blue.200}', 300: '{blue.300}', 400: '{blue.400}', 500: '{blue.500}', 600: '{blue.600}', 700: '{blue.700}', 800: '{blue.800}', 900: '{blue.900}', 950: '{blue.950}' },
    focusRing: { width: '2px', style: 'solid', color: '{primary.500}', offset: '2px' },
    formField: { paddingX: '0.875rem', paddingY: '0.7rem', borderRadius: '0', focusRing: { width: '0', style: 'none', color: 'transparent', offset: '0' } },
    colorScheme: {
      light: {
        surface: { 0: '#FFFFFF', 50: '{ink.50}', 100: '{ink.100}', 200: '{ink.200}', 300: '{ink.300}', 400: '{ink.400}', 500: '{ink.500}', 600: '{ink.600}', 700: '{ink.700}', 800: '{ink.800}', 900: '{ink.900}', 950: '{ink.950}' },
        primary: { color: '#1A1712', contrastColor: '#FBF8F1', hoverColor: '#D8431C', activeColor: '#B8381A' },
        highlight: { background: '#F3E2D6', focusBackground: '#EBCDBB', color: '#1A1712', focusColor: '#1A1712' },
        text: { color: '#3A342A', hoverColor: '#1A1712', mutedColor: '#5C5447', hoverMutedColor: '#3A342A' },
        formField: { background: '#FBF8F1', disabledBackground: '#EBE5D8', filledBackground: '#FBF8F1', borderColor: '#B5A994', hoverBorderColor: '#5C5447', focusBorderColor: '#1A1712', invalidBorderColor: '{red.600}', color: '#1A1712', placeholderColor: '#766C5E', invalidPlaceholderColor: '{red.600}', iconColor: '#766C5E', shadow: 'none' },
        content: { background: '#FBF8F1', hoverBackground: '#EBE5D8', borderColor: '#D6CCBA', color: '#3A342A', hoverColor: '#1A1712' }
      },
      dark: {
        surface: { 0: '#FFFFFF', 50: '{ink.50}', 100: '{ink.100}', 200: '{ink.200}', 300: '{ink.300}', 400: '{ink.400}', 500: '{ink.500}', 600: '{ink.600}', 700: '{ink.700}', 800: '{ink.800}', 900: '{ink.900}', 950: '{ink.950}' },
        primary: { color: '#F0E9DC', contrastColor: '#15120E', hoverColor: '#E8552B', activeColor: '#D8431C' },
        highlight: { background: '#3A2219', focusBackground: '#4A2A1D', color: '#F0E9DC', focusColor: '#F0E9DC' },
        text: { color: '#D6CDBD', hoverColor: '#F0E9DC', mutedColor: '#B0A593', hoverMutedColor: '#D6CDBD' },
        formField: { background: '#1D1914', disabledBackground: '#15120E', filledBackground: '#1D1914', borderColor: '#5A5041', hoverBorderColor: '#978C7A', focusBorderColor: '#F0E9DC', invalidBorderColor: '{red.400}', color: '#F0E9DC', placeholderColor: '#978C7A', invalidPlaceholderColor: '{red.400}', iconColor: '#978C7A', shadow: 'none' },
        content: { background: '#1D1914', hoverBackground: '#25201A', borderColor: '#3A3329', color: '#D6CDBD', hoverColor: '#F0E9DC' }
      }
    }
  },
  components: {
    button: { root: { borderRadius: '0', paddingX: '1.25rem', paddingY: '0.7rem', gap: '0.5rem', label: { fontWeight: '700' }, sm: { paddingX: '0.9rem', paddingY: '0.45rem', fontSize: '0.8rem' } },
              colorScheme: { light: { secondary: { background: 'transparent', hoverBackground: '#EBE5D8', borderColor: '#1A1712', hoverBorderColor: '#1A1712', color: '#1A1712', hoverColor: '#1A1712' } },
                             dark:  { secondary: { background: 'transparent', hoverBackground: '#25201A', borderColor: '#F0E9DC', hoverBorderColor: '#F0E9DC', color: '#F0E9DC', hoverColor: '#F0E9DC' } } } },
    togglebutton: { root: { borderRadius: '0', padding: '0.6rem 0.9rem', gap: '0.25rem' } },
    selectbutton: { root: { borderRadius: '0' } },
    inputtext: { root: { paddingX: '0.875rem', paddingY: '0.7rem' } },
    tabs: { tab: { padding: '0.6rem 1rem', fontWeight: '700', borderWidth: '0 0 3px 0' }, tablist: { background: 'transparent' }, activeBar: { height: '3px' } },
    message: { root: { borderRadius: '0' }, simple: { content: { padding: '0' } } },
    toast: { root: { borderRadius: '0', width: 'min(360px, calc(100vw - 32px))' } }
  }
})
