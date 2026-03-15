import { tokens } from '../constants/tokens';

type ThemeMode = 'light' | 'dark';

function flattenTokens(obj: object, prefix = '-'): Record<string, { light: string; dark: string }> {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const varName = `${prefix}-${key}`;
    if (val && typeof val === 'object' && 'light' in val && 'dark' in val) {
      acc[varName] = val as { light: string; dark: string };
    } else if (val && typeof val === 'object') {
      Object.assign(acc, flattenTokens(val, varName));
    } else {
      // Static tokens (spacing, radius, etc.) — same in both modes
      acc[varName] = { light: String(val), dark: String(val) };
    }
    return acc;
  }, {} as Record<string, { light: string; dark: string }>);
}

export function injectCssVars(mode: ThemeMode) {
  const flat = flattenTokens(tokens);
  const root = document.documentElement;
  for (const [varName, values] of Object.entries(flat)) {
    root.style.setProperty(varName, values[mode]);
  }
}