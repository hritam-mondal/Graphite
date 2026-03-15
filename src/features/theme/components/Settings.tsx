import { useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from '../state/ThemeContext';
import type { Theme } from '../constants/tokens';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings = ({ isOpen, onClose }: SettingsProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme);

  const handleThemeChange = (newTheme: Theme) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
  };

  const themeOptions: { value: Theme; icon: React.ReactNode; label: string; description: string }[] = [
    { value: "light",  icon: <Sun size={20} />,     label: "Light",  description: "Bright and clean interface" },
    { value: "dark",   icon: <Moon size={20} />,    label: "Dark",   description: "Easy on the eyes" },
    { value: "system", icon: <Monitor size={20} />, label: "System", description: "Follow OS preferences" },
  ];

  const s: Record<string, CSSProperties> = {
    backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", zIndex: 999 },
    modal: { position: "fixed", right: 0, top: 0, bottom: 0, width: "100%", maxWidth: 400, background: "var(--color-surface-default)", borderLeft: "1px solid var(--color-border-default)", boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column", zIndex: 1000 },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--color-border-default)", flexShrink: 0 },
    title: { fontSize: "var(--font-size-lg)", fontWeight: 600, color: "var(--color-text-primary)" },
    closeBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "var(--radius-md)", border: "none", background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer", transition: "background var(--transition-base)" },
    content: { flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 24 },
    section: { display: "flex", flexDirection: "column", gap: 12 },
    sectionLabel: { fontSize: "var(--font-size-xs)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--color-text-disabled)" },
    themeGrid: { display: "grid", gridTemplateColumns: "1fr", gap: 12 },
    themeCard: { position: "relative", padding: 16, borderRadius: "var(--radius-lg)", border: "2px solid var(--color-border-default)", background: "var(--color-surface-subtle)", cursor: "pointer", transition: "all var(--transition-base)", display: "flex", alignItems: "center", gap: 12 },
    themeCardSelected: { borderColor: "var(--color-accent-default)", background: "var(--color-accent-subtle)" },
    themeCardContent: { display: "flex", flexDirection: "column", flex: 1, gap: 4 },
    themeLabel: { fontSize: "var(--font-size-sm)", fontWeight: 600, color: "var(--color-text-primary)" },
    themeDescription: { fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" },
    checkmark: { width: 24, height: 24, borderRadius: "50%", background: "var(--color-accent-default)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    statusIndicator: { display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", borderRadius: "var(--radius-md)", background: "var(--color-surface-subtle)", fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={s.backdrop} />
          <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: "spring", damping: 20, stiffness: 300 }} style={s.modal}>
            <div style={s.header}>
              <h2 style={s.title}>Settings</h2>
              <button onClick={onClose} style={s.closeBtn}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--color-surface-raised)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={s.content}>
              <div style={s.section}>
                <div style={s.sectionLabel}>Appearance</div>
                <div style={s.themeGrid}>
                  {themeOptions.map((option) => (
                    <motion.button key={option.value} onClick={() => handleThemeChange(option.value)}
                      style={{ ...s.themeCard, ...(selectedTheme === option.value ? s.themeCardSelected : {}) }}
                      whileHover={{ transform: "translateY(-2px)" }} whileTap={{ transform: "translateY(0px)" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: "var(--radius-md)", background: selectedTheme === option.value ? "var(--color-accent-default)" : "var(--color-border-default)", color: selectedTheme === option.value ? "white" : "var(--color-text-secondary)", transition: "all var(--transition-base)", flexShrink: 0 }}>
                        {option.icon}
                      </div>
                      <div style={s.themeCardContent}>
                        <div style={s.themeLabel}>{option.label}</div>
                        <div style={s.themeDescription}>{option.description}</div>
                      </div>
                      {selectedTheme === option.value && <div style={s.checkmark}><Check size={16} /></div>}
                    </motion.button>
                  ))}
                </div>
                <div style={s.statusIndicator}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-accent-default)", display: "inline-block" }} />
                  Currently using: <strong style={{ color: "var(--color-text-primary)", textTransform: "capitalize" }}>{resolvedTheme}</strong>
                </div>
              </div>
              <div style={s.section}>
                <div style={s.sectionLabel}>About</div>
                <div style={{ padding: "12px 16px", borderRadius: "var(--radius-md)", background: "var(--color-surface-subtle)", fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", lineHeight: "1.6" }}>
                  Your theme preference is saved locally and will persist across sessions. The app automatically detects your system theme setting when set to "System".
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
