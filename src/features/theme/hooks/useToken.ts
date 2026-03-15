import { useTheme } from '../state/ThemeContext';
import { tokens } from '../constants/tokens';

// Use CSS vars in components — no JS token access needed for styling
// Use this only when you need token values in JS (e.g., Canvas, D3, Recharts)
export function useToken() {
  const { resolvedTheme } = useTheme();
  return {
    color: (path: string): string => {
      return `var(--color-${path.replace(/\./g, '-')})`;
    },
    resolvedColor: (path: string): string => {
      const parts = path.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let node: any = tokens.color;
      for (const part of parts) node = node?.[part];
      return node?.[resolvedTheme] ?? '';
    },
  };
}
