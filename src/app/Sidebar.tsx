import { useState, useEffect, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Menu, X, PenLine, ChevronLeft, ChevronRight } from "lucide-react";
import { ChatHistory } from "@features/chat/components/ChatHistory";
import { SidebarFooter } from "@components/layout/SidebarFooter";
import { ThemeSettings } from "@features/theme";
import { useChat } from "@features/chat/state/ChatContext";

const COLLAPSED_W = 72;
const EXPANDED_W  = 272;

interface SidebarProps {
  onNewChat?: () => void;
}

export const Sidebar = ({ onNewChat }: SidebarProps) => {
  const { createNewChat } = useChat();

  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [isMobile,     setIsMobile]     = useState(false);
  const [btnHovered,   setBtnHovered]   = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const handleNewChat = () => {
    createNewChat();
    onNewChat?.();
    if (isMobile) setMobileOpen(false);
  };

  const width   = collapsed ? COLLAPSED_W : EXPANDED_W;
  const visible = isMobile ? mobileOpen : true;

  const s: Record<string, CSSProperties> = {
    mobileToggle: { display: isMobile ? "flex" : "none", alignItems: "center", justifyContent: "center", position: "fixed", top: 14, left: 14, zIndex: 50, width: 36, height: 36, borderRadius: 10, background: "var(--color-surface-default)", border: "1px solid var(--color-border-default)", boxShadow: "0 1px 6px rgba(0,0,0,0.10)", color: "var(--color-text-secondary)", cursor: "pointer" },
    backdrop: { position: "fixed", inset: 0, background: "rgba(15,23,42,0.25)", backdropFilter: "blur(3px)", zIndex: 30 },
    aside: { position: "fixed", top: 0, left: 0, height: "100vh", display: "flex", flexDirection: "column", zIndex: 40, overflow: "hidden", background: "var(--color-bg-subtle)", borderRight: "1px solid var(--color-border-default)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
    header: { flexShrink: 0, padding: collapsed ? "14px 14px 12px" : "16px 14px 12px", borderBottom: "1px solid var(--color-border-default)", background: "var(--color-surface-default)" },
    brandRow: { display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", marginBottom: 12, minHeight: 36 },
    brandLeft: { display: "flex", alignItems: "center", gap: 10, minWidth: 0, overflow: "hidden" },
    logo: { width: 34, height: 34, borderRadius: 10, flexShrink: 0, background: "linear-gradient(135deg, var(--color-accent-default) 0%, var(--color-accent-hover) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-accent-contrast)", fontWeight: 900, fontSize: 15, letterSpacing: "-0.01em", boxShadow: "0 2px 8px rgba(79,70,229,0.35)", userSelect: "none" },
    brandTextWrap: { overflow: "hidden", whiteSpace: "nowrap" },
    brandName: { margin: 0, fontSize: 13, fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1.3 },
    brandSub: { margin: 0, fontSize: 10, fontWeight: 500, color: "var(--color-text-secondary)", lineHeight: 1.3 },
    collapseBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 7, border: "1px solid var(--color-border-default)", background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer", flexShrink: 0, transition: "background var(--transition-base), color var(--transition-base), border-color var(--transition-base)" },
    newChatBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: collapsed ? 44 : "100%", height: 38, marginLeft: collapsed ? "auto" : 0, marginRight: collapsed ? "auto" : 0, borderRadius: 10, border: "none", background: btnHovered ? "linear-gradient(135deg, var(--color-accent-hover) 0%, var(--color-accent-hover) 100%)" : "linear-gradient(135deg, var(--color-accent-default) 0%, var(--color-accent-hover) 100%)", color: "var(--color-accent-contrast)", fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: btnHovered ? "0 4px 14px rgba(79,70,229,0.5)" : "0 2px 8px rgba(79,70,229,0.35)", transition: "background var(--transition-base), box-shadow var(--transition-base)", whiteSpace: "nowrap" },
    sectionLabel: { flexShrink: 0, padding: "12px 16px 4px", display: "flex", alignItems: "center", gap: 6 },
    sectionLabelLine: { flex: 1, height: 1, background: "var(--color-border-default)" },
    sectionLabelText: { margin: 0, fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--color-text-disabled)", whiteSpace: "nowrap" },
    chatWrapper: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" },
    toggleBar: { flexShrink: 0, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid var(--color-border-default)", background: "var(--color-surface-default)", cursor: "pointer", color: "var(--color-text-secondary)", transition: "background var(--transition-base), color var(--transition-base)", userSelect: "none" },
    spacer: { flexShrink: 0, display: isMobile ? "none" : "block" },
  };

  return (
    <>
      <style>{`
        .sb-collapse-btn:hover { background: var(--color-surface-raised) !important; color: var(--color-text-primary) !important; border-color: var(--color-border-strong) !important; }
        .sb-toggle-bar:hover { background: var(--color-surface-raised) !important; color: var(--color-text-primary) !important; }
        .sb-mobile-toggle:hover { box-shadow: 0 2px 10px rgba(0,0,0,0.14) !important; color: var(--color-text-primary) !important; }
      `}</style>

      <motion.button style={s.mobileToggle} className="sb-mobile-toggle" onClick={() => setMobileOpen(v => !v)} whileTap={{ scale: 0.92 }} aria-label="Toggle sidebar">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={mobileOpen ? "x" : "m"} initial={{ rotate: -70, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 70, opacity: 0 }} transition={{ duration: 0.13 }} style={{ display: "flex" }}>
            {mobileOpen ? <X size={15} /> : <Menu size={15} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {mobileOpen && isMobile && (
          <motion.div style={s.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} onClick={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>

      <motion.aside style={s.aside} animate={{ x: visible ? 0 : -width, width }} transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}>
        <div style={s.header}>
          <div style={s.brandRow}>
            <div style={s.brandLeft}>
              <div style={s.logo}>C</div>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.div key="brand" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} style={s.brandTextWrap}>
                    <p style={s.brandName}>Chat</p>
                    <p style={s.brandSub}>AI Assistant</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {!collapsed && !isMobile && (
              <motion.button style={s.collapseBtn} className="sb-collapse-btn" onClick={() => setCollapsed(true)} whileTap={{ scale: 0.9 }} aria-label="Collapse sidebar">
                <ChevronLeft size={13} />
              </motion.button>
            )}
          </div>
          <motion.button style={s.newChatBtn} onClick={handleNewChat} onMouseEnter={() => setBtnHovered(true)} onMouseLeave={() => setBtnHovered(false)} whileTap={{ scale: 0.97 }} aria-label="New chat" title={collapsed ? "New Chat" : undefined}>
            {collapsed ? <PenLine size={15} /> : <><Plus size={15} /><span>New Chat</span></>}
          </motion.button>
        </div>

        {!collapsed && (
          <div style={s.sectionLabel}>
            <p style={s.sectionLabelText}>Conversations</p>
            <div style={s.sectionLabelLine} />
          </div>
        )}

        <div style={s.chatWrapper}>
          <ChatHistory isCollapsed={collapsed} onChatSelect={() => { if (isMobile) setMobileOpen(false); }} />
        </div>

        <SidebarFooter isCollapsed={collapsed} onSettingsClick={() => setSettingsOpen(true)} />

        {!isMobile && (
          <div style={s.toggleBar} className="sb-toggle-bar" onClick={() => setCollapsed(v => !v)} role="button" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </div>
        )}
      </motion.aside>

      <motion.div style={s.spacer} animate={{ width }} transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }} />

      <ThemeSettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};
