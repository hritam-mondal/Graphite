import { useState, useRef, useEffect, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Trash2, Edit2, MessageSquare, Code, PenLine, FileText, BrainCircuit } from "lucide-react";
import { type ChatSession, useChat } from "../state/ChatContext";

interface ChatItemProps {
  chat: ChatSession;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

export const ChatItem = ({ chat, isActive, isCollapsed, onClick }: ChatItemProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const { deleteChat } = useChat();

  /* Close dropdown when clicking outside */

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

  const handleDelete = () => {
    deleteChat(chat.id);
    setShowMenu(false);
  };

  /* Get icon based on chat content */
  const getChatIcon = () => {
    const title = chat.title.toLowerCase();
    if (title.includes("code") || title.includes("program") || title.includes("script")) {
      return <Code size={14} strokeWidth={2} />;
    }
    if (title.includes("write") || title.includes("draft") || title.includes("email")) {
      return <PenLine size={14} strokeWidth={2} />;
    }
    if (title.includes("explain") || title.includes("answer") || title.includes("question")) {
      return <BrainCircuit size={14} strokeWidth={2} />;
    }
    if (title.includes("doc") || title.includes("read") || title.includes("summar")) {
      return <FileText size={14} strokeWidth={2} />;
    }
    return <MessageSquare size={14} strokeWidth={2} />;
  };

  /* Collapsed pill */

  if (isCollapsed) {
    const pillStyle: CSSProperties = {
      width: 44,
      height: 44,
      borderRadius: 12,
      border: isActive ? "2px solid var(--ci-accent)" : "2px solid var(--ci-border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: isActive
        ? "linear-gradient(135deg,var(--color-accent-default),var(--color-accent-hover))"
        : "var(--ci-bg-idle)",
      color: isActive ? "var(--color-accent-contrast)" : "var(--ci-text-muted)",
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      boxShadow: isActive ? "0 2px 10px var(--ci-accent-shadow)" : "none",
      transition: "background .15s,box-shadow .15s,border .15s",
      margin: "2px auto",
    };

    return (
      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        onClick={onClick}
        style={pillStyle}
        title={chat.title}
      >
        {getChatIcon()}
      </motion.button>
    );
  }

  /* Full item */

  const itemStyle: CSSProperties = {
    position: "relative",
    borderRadius: 10,
    marginBottom: 2,
    background: isActive ? "linear-gradient(135deg,var(--color-accent-default),var(--color-accent-hover))" : isHovered ? "var(--ci-bg-hover)" : "transparent",
    border: isActive
      ? "1px solid var(--ci-accent-dark)"
      : `1px solid ${isHovered ? "var(--ci-border-hover)" : "transparent"}`,
    boxShadow: isActive ? "0 2px 12px var(--ci-accent-shadow)" : "none",
    transition: "background .15s,border .15s,box-shadow .15s",
    cursor: "pointer",
  };

  const innerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 10px",
    width: "100%",
    border: "none",
    background: "none",
    cursor: "pointer",
    textAlign: "left",
  };

  const avatarStyle: CSSProperties = {
    width: 30,
    height: 30,
    borderRadius: 9,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: isActive
      ? "rgba(255,255,255,.18)"
      : "var(--ci-avatar-bg)",
    color: isActive ? "var(--color-accent-contrast)" : "var(--ci-accent)",
    boxShadow: isActive ? "none" : "0 2px 6px rgba(0,0,0,0.06)",
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
    color: isActive ? "var(--color-accent-contrast)" : "var(--ci-text)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const previewStyle: CSSProperties = {
    margin: 0,
    fontSize: 11,
    color: isActive ? "rgba(255,255,255,.7)" : "var(--ci-text-muted)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const menuBtnStyle: CSSProperties = {
    width: 26,
    height: 26,
    borderRadius: 7,
    border: "none",
    background: showMenu ? "var(--ci-border-hover)" : "transparent",
    color: isActive ? "#fff" : "var(--ci-text-muted)",
    cursor: "pointer",
    opacity: isHovered || showMenu ? 1 : 0,
    transition: "opacity .15s",
  };

  const dropdownStyle: CSSProperties = {
    position: "absolute",
    right: 0,
    top: "calc(100% + 4px)",
    width: 180,
    background: "var(--ci-dropdown-bg)",
    borderRadius: 10,
    border: "1px solid var(--ci-border)",
    boxShadow: "0 8px 24px rgba(0,0,0,.12)",
    overflow: "hidden",
    zIndex: 50,
  };

  return (
    <>
      <style>{`
        :root,
        [data-theme="light"] {
          --ci-accent: var(--color-accent-default);
          --ci-accent-dark: var(--color-accent-hover);
          --ci-accent-shadow: rgba(79, 70, 229, 0.3);
          --ci-bg-idle: var(--color-surface-subtle);
          --ci-bg-hover: var(--color-surface-raised);
          --ci-border: var(--color-border-default);
          --ci-border-hover: var(--color-border-strong);
          --ci-text: var(--color-text-primary);
          --ci-text-muted: var(--color-text-secondary);
          --ci-avatar-bg: rgba(79, 70, 229, 0.1);
          --ci-dropdown-bg: var(--color-surface-default);
        }

        [data-theme="dark"] {
          --ci-accent: var(--color-accent-default);
          --ci-accent-dark: var(--color-accent-hover);
          --ci-accent-shadow: rgba(109, 99, 255, 0.3);
          --ci-bg-idle: var(--color-surface-subtle);
          --ci-bg-hover: var(--color-surface-raised);
          --ci-border: var(--color-border-default);
          --ci-border-hover: var(--color-border-strong);
          --ci-text: var(--color-text-primary);
          --ci-text-muted: var(--color-text-secondary);
          --ci-avatar-bg: rgba(109, 99, 255, 0.15);
          --ci-dropdown-bg: var(--color-surface-default);
        }

        .ci-menu-item {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          padding: 8px 12px;
          border: none;
          background: transparent;
          font-size: 12px;
          cursor: pointer;
          text-align: left;
          color: var(--ci-text);
          transition: background var(--transition-base);
        }

        .ci-menu-item:hover {
          background: var(--ci-bg-hover);
        }

        .ci-menu-item.danger {
          color: var(--color-danger);
        }

        .ci-menu-item.danger:hover {
          background: rgba(220, 38, 38, 0.08);
        }
      `}</style>

      <div
        ref={menuRef}
        style={itemStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowMenu(false);
        }}
      >
        <div style={innerStyle} onClick={!isRenaming ? onClick : undefined}>
          <div style={avatarStyle}>
            {getChatIcon()}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={titleStyle}>{chat.title}</p>
            {chat.preview && <p style={previewStyle}>{chat.preview}</p>}
          </div>

          {!isRenaming && (
            <motion.button
              whileTap={{ scale: 0.88 }}
              style={menuBtnStyle}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setShowMenu(v => !v);
              }}
            >
              <MoreVertical size={14} />
            </motion.button>
          )}
        </div>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: .13 }}
              style={dropdownStyle}
            >
              <button
                className="ci-menu-item"
                onClick={() => {
                  setIsRenaming(true);
                  setShowMenu(false);
                }}
              >
                <Edit2 size={13} />
                Rename
              </button>

              <button
                className="ci-menu-item danger"
                onClick={handleDelete}
              >
                <Trash2 size={13} />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};