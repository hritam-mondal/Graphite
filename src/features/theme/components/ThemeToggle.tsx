import { useTheme } from '../state/ThemeContext';
import type { Theme } from '../constants/tokens';

const options: { value: Theme; label: string; icon: string }[] = [
  { value: 'light',  label: 'Light',  icon: '☀️' },
  { value: 'dark',   label: 'Dark',   icon: '🌙' },
  { value: 'system', label: 'System', icon: '💻' },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div role="group" aria-label="Theme selector" style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          aria-pressed={theme === opt.value}
          title={opt.label}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-default)',
            background: theme === opt.value ? 'var(--color-accent-subtle)' : 'transparent',
            color: theme === opt.value ? 'var(--color-accent-default)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            transition: 'var(--transition-base)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          {opt.icon} {opt.label}
        </button>
      ))}
    </div>
  );
}
