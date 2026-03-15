export const tokens = {
  color: {
    // Semantic tokens — these are what components USE
    background: {
      base:    { light: '#FFFFFF', dark: '#0A0A0F' },
      subtle:  { light: '#F4F4F6', dark: '#13131A' },
      overlay: { light: '#E8E8EE', dark: '#1C1C28' },
    },
    surface: {
      default:  { light: '#FFFFFF', dark: '#16161F' },
      raised:   { light: '#F9F9FB', dark: '#1E1E2A' },
      sunken:   { light: '#EFEFF3', dark: '#111118' },
    },
    border: {
      default: { light: '#E2E2E8', dark: '#2A2A3A' },
      strong:  { light: '#C8C8D2', dark: '#3D3D52' },
    },
    text: {
      primary:   { light: '#0D0D12', dark: '#F0F0F8' },
      secondary: { light: '#5A5A72', dark: '#9090B0' },
      disabled:  { light: '#ABABC0', dark: '#4A4A60' },
      inverse:   { light: '#FFFFFF', dark: '#0A0A0F' },
    },
    accent: {
      default:  { light: '#4F46E5', dark: '#6D63FF' },
      hover:    { light: '#4338CA', dark: '#7C73FF' },
      subtle:   { light: '#EEF2FF', dark: '#1E1B4B' },
      contrast: { light: '#FFFFFF', dark: '#FFFFFF' },
    },
    status: {
      success: { light: '#16A34A', dark: '#22C55E' },
      warning: { light: '#D97706', dark: '#FBBF24' },
      danger:  { light: '#DC2626', dark: '#F87171' },
      info:    { light: '#2563EB', dark: '#60A5FA' },
    },
  },
  shadow: {
    sm: { light: '0 1px 3px rgba(0,0,0,0.08)',  dark: '0 1px 3px rgba(0,0,0,0.4)'  },
    md: { light: '0 4px 12px rgba(0,0,0,0.10)', dark: '0 4px 12px rgba(0,0,0,0.5)' },
    lg: { light: '0 8px 32px rgba(0,0,0,0.12)', dark: '0 8px 32px rgba(0,0,0,0.6)' },
  },
  radius: { sm: '4px', md: '8px', lg: '12px', xl: '20px', full: '9999px' },
  spacing: { 1: '4px', 2: '8px', 3: '12px', 4: '16px', 6: '24px', 8: '32px', 12: '48px', 16: '64px' },
  font: {
    size:   { xs: '11px', sm: '13px', md: '15px', lg: '18px', xl: '22px', '2xl': '28px', '3xl': '36px' },
    weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
    leading:{ tight: '1.2', normal: '1.5', relaxed: '1.75' },
  },
  transition: {
    fast:   '100ms ease',
    base:   '200ms ease',
    slow:   '350ms ease',
    spring: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export type Theme = 'light' | 'dark' | 'system';