import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Settings, Share2, Archive, Trash2 } from "lucide-react";
import { useChat } from "../state/ChatContext";

interface ChatHeaderProps {
  chatId?: string;
}

const IconBtn = ({
  children,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  label: string;
}) => {
  return (
    <motion.button
      className={`icon-btn${active ? " icon-btn--active" : ""}`}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      title={label}
    >
      {children}
    </motion.button>
  );
};

const MenuItem = ({
  icon,
  label,
  danger,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      className={`menu-item${danger ? " menu-item--danger" : ""}`}
      onClick={onClick}
    >
      <span style={{ display: "flex", flexShrink: 0, color: danger ? "var(--color-danger)" : "var(--color-text-secondary)" }}>
        {icon}
      </span>
      {label}
    </button>
  );
};

export const ChatHeader = ({ chatId }: ChatHeaderProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { chatSessions } = useChat();

  const currentChat = chatSessions.find((c) => c.id === chatId);
  const chatTitle = currentChat?.title || "Graphite";

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowMenu(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="chat-header">
      <div className="chat-header__accent" />
      <div className="chat-header__left">
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0 }}>
            <p className="chat-header__title">{chatTitle}</p>
            <span className="chat-header__meta">Graphite</span>
          </div>
          <div className="chat-header__status">
            <span className="chat-header__dot" />
            <p className="chat-header__status-text">
              <span style={{ color: "var(--color-success)", fontWeight: 600 }}>Online</span>
              {" · ready to help"}
            </p>
          </div>
        </div>
      </div>

      <aside className="chat-header__actions">
        <div className="chat-header__divider" />
        <div className="chat-header__menu-wrap" ref={menuRef}>
          <IconBtn
            label="Chat options"
            onClick={() => setShowMenu((v) => !v)}
            active={showMenu}
          >
            <MoreVertical size={15} strokeWidth={2} />
          </IconBtn>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="chat-header__dropdown"
                style={{ transformOrigin: "top right" }}
              >
                <div className="chat-header__dropdown-header">
                  <p className="chat-header__dropdown-title">This chat</p>
                  <p className="chat-header__dropdown-chat-name">{chatTitle}</p>
                </div>

                <div className="chat-header__dropdown-body">
                  <MenuItem icon={<Share2 size={13} />} label="Share chat" onClick={() => setShowMenu(false)} />
                  <MenuItem icon={<Archive size={13} />} label="Archive chat" onClick={() => setShowMenu(false)} />
                  <MenuItem icon={<Settings size={13} />} label="Chat settings" onClick={() => setShowMenu(false)} />
                </div>

                <div className="chat-header__dropdown-divider" />

                <div className="chat-header__dropdown-footer">
                  <MenuItem icon={<Trash2 size={13} />} label="Delete chat" danger onClick={() => setShowMenu(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </header>
  );
};