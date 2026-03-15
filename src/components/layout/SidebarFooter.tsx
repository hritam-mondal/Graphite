import { motion } from "framer-motion";
import { Settings, User, LogOut, HelpCircle } from "lucide-react";

interface SidebarFooterProps {
  isCollapsed: boolean;
  onSettingsClick?: () => void;
}

const menuItems = [
  { icon: Settings, label: "Settings", ariaLabel: "Settings" },
  { icon: User, label: "Profile", ariaLabel: "Profile" },
  { icon: HelpCircle, label: "Help", ariaLabel: "Help & Support" },
];

export const SidebarFooter = ({ isCollapsed, onSettingsClick }: SidebarFooterProps) => {
  return (
    <>
      <style>{`
        :root{
          --sf-bg: var(--color-surface-default);
          --sf-border: var(--color-border-default);
          --sf-text: var(--color-text-primary);
          --sf-muted: var(--color-text-secondary);
          --sf-hover-bg: var(--color-surface-raised);
          --sf-hover-text: var(--color-text-primary);
          --sf-danger: var(--color-danger);
          --sf-danger-bg: rgba(220, 38, 38, 0.08);
        }

        [data-theme="dark"] {
          --sf-danger-bg: rgba(220, 38, 38, 0.12);
        }

        .sf-btn{
          display:flex;
          align-items:center;
          border:none;
          background:transparent;
          cursor:pointer;
          color:var(--sf-text);
          font-family:inherit;
          transition:background var(--transition-base),color var(--transition-base);
        }

        .sf-btn:hover{
          background:var(--sf-hover-bg);
          color:var(--sf-hover-text);
        }

        .sf-btn.danger{
          color:var(--sf-danger);
        }

        .sf-btn.danger:hover{
          background:var(--sf-danger-bg);
        }

        .sf-icon-btn{
          width:36px;
          height:36px;
          justify-content:center;
          border-radius:9px;
          color:var(--sf-muted);
        }

        .sf-row-btn{
          width:100%;
          padding:8px 10px;
          gap:10px;
          border-radius:8px;
          font-size:13px;
          font-weight:500;
          text-align:left;
        }
      `}</style>

      <div
        style={{
          borderTop: "1px solid var(--sf-border)",
          background: "var(--sf-bg)",
          flexShrink: 0,
          padding: isCollapsed ? "10px 8px" : "8px 10px",
        }}
      >
        {isCollapsed ? (
          <CollapsedFooter onSettingsClick={onSettingsClick} />
        ) : (
          <ExpandedFooter onSettingsClick={onSettingsClick} />
        )}
      </div>
    </>
  );
};

/* ───────────────── Collapsed Footer ───────────────── */

function CollapsedFooter({ onSettingsClick }: { onSettingsClick?: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      {menuItems.map(({ icon: Icon, ariaLabel }) => (
        <motion.button
          key={ariaLabel}
          className="sf-btn sf-icon-btn"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label={ariaLabel}
          title={ariaLabel}
          onClick={ariaLabel === "Settings" ? onSettingsClick : undefined}
        >
          <Icon size={16} />
        </motion.button>
      ))}

      <div
        style={{
          width: 28,
          height: 1,
          background: "var(--sf-border)",
          margin: "4px 0",
        }}
      />

      <motion.button
        className="sf-btn sf-icon-btn danger"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Logout"
        title="Logout"
      >
        <LogOut size={16} />
      </motion.button>
    </div>
  );
}

/* ───────────────── Expanded Footer ───────────────── */

function ExpandedFooter({ onSettingsClick }: { onSettingsClick?: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {menuItems.map(({ icon: Icon, label, ariaLabel }) => (
        <motion.button
          key={label}
          className="sf-btn sf-row-btn"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          aria-label={ariaLabel}
          onClick={ariaLabel === "Settings" ? onSettingsClick : undefined}
        >
          <span style={{ display: "flex", flexShrink: 0 }}>
            <Icon size={15} />
          </span>
          <span>{label}</span>
        </motion.button>
      ))}

      <div
        style={{
          height: 1,
          background: "var(--sf-border)",
          margin: "4px 2px",
        }}
      />

      <motion.button
        className="sf-btn sf-row-btn danger"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Logout"
      >
        <span style={{ display: "flex", flexShrink: 0 }}>
          <LogOut size={15} />
        </span>
        <span>Logout</span>
      </motion.button>
    </div>
  );
}