import { useState, useRef, useCallback, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, MessageSquare } from "lucide-react";
import { ChatItem } from "./ChatItem";
import { useChat } from "../state/ChatContext";

interface ChatHistoryProps {
  isCollapsed: boolean;
  onChatSelect?: () => void;
}

/* ─── Design tokens (via CSS variables) ──────────────────────────────────── */
const T = {
  bg:           "var(--chat-bg)",
  surface:      "var(--color-surface-default)",
  border:       "var(--color-border-default)",
  borderFocus:  "var(--color-accent-default)",
  textPrimary:  "var(--color-text-primary)",
  textSecondary:"var(--color-text-secondary)",
  textMuted:    "var(--color-text-tertiary)",
  accent:       "var(--color-accent-default)",
  accentRing:   "rgba(79, 70, 229, 0.15)",
  accentLight:  "var(--color-accent-subtle)",
} as const;

export const ChatHistory = ({ isCollapsed, onChatSelect }: ChatHistoryProps) => {
  const { chatSessions, activeChatId, setActiveChat, searchChats } = useChat();
  const [query,     setQuery]     = useState("");
  const [focused,   setFocused]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayed  = query ? searchChats(query) : chatSessions;
  const now        = Date.now();
  const MS_DAY     = 86_400_000;
  const MS_WEEK    = MS_DAY * 7;

  const todayChats    = displayed.filter(c => now - +new Date(c.updatedAt ?? c.createdAt ?? 0) < MS_DAY);
  const thisWeek      = displayed.filter(c => {
    const age = now - +new Date(c.updatedAt ?? c.createdAt ?? 0);
    return age >= MS_DAY && age < MS_WEEK;
  });
  const olderChats    = displayed.filter(c => now - +new Date(c.updatedAt ?? c.createdAt ?? 0) >= MS_WEEK);

  const handleSelect = useCallback((id: string) => {
    setActiveChat(id);
    onChatSelect?.();
  }, [setActiveChat, onChatSelect]);

  const clearQuery = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  /* ─── Styles ─────────────────────────────────────────────────────────── */
  const s: Record<string, CSSProperties> = {
    root: {
      display:       "flex",
      flexDirection: "column",
      height:        "100%",
      overflow:      "hidden",
      background:    T.bg,
    },

    searchWrap: {
      padding:   "0 10px 8px",
      flexShrink: 0,
    },

    searchBox: {
      position:      "relative",
      display:       "flex",
      alignItems:    "center",
      height:        34,
      borderRadius:  8,
      border:        `1px solid ${focused ? T.borderFocus : T.border}`,
      background:    T.surface,
      boxShadow:     focused
        ? `0 0 0 3px ${T.accentRing}, 0 1px 2px rgba(0,0,0,0.04)`
        : "0 1px 2px rgba(0,0,0,0.04)",
      transition:    "border-color 0.15s, box-shadow 0.15s",
      overflow:      "hidden",
    },

    searchIcon: {
      position:      "absolute",
      left:          10,
      display:       "flex",
      alignItems:    "center",
      pointerEvents: "none",
      color:         focused ? T.accent : T.textMuted,
      transition:    "color 0.15s",
    },

    searchInput: {
      flex:       1,
      height:     "100%",
      padding:    "0 32px 0 30px",
      fontSize:   12,
      fontWeight: 500,
      fontFamily: "inherit",
      background: "transparent",
      border:     "none",
      outline:    "none",
      color:      T.textPrimary,
    },

    clearBtn: {
      position:       "absolute",
      right:          7,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      width:          18,
      height:         18,
      borderRadius:   99,
      border:         "none",
      background:     T.textMuted,
      color:          "#fff",
      cursor:         "pointer",
      padding:        0,
      flexShrink:     0,
    },

    list: {
      flex:       1,
      overflowY:  "auto",
      padding:    "2px 8px 12px",
      scrollbarWidth: "thin" as const,
      scrollbarColor: `${T.border} transparent`,
    },

    /* Section label row */
    sectionRow: {
      display:     "flex",
      alignItems:  "center",
      gap:         8,
      padding:     "14px 4px 5px",
    },

    sectionText: {
      margin:        0,
      fontSize:      9,
      fontWeight:    700,
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      color:         T.textMuted,
      whiteSpace:    "nowrap",
    },

    sectionLine: {
      flex:       1,
      height:     1,
      background: T.border,
    },

    /* Empty state */
    empty: {
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      gap:            10,
      padding:        "48px 16px",
      textAlign:      "center",
    },

    emptyIconWrap: {
      width:          40,
      height:         40,
      borderRadius:   12,
      background:     T.accentLight,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      color:          T.accent,
      marginBottom:   2,
    },

    emptyTitle: {
      margin:     0,
      fontSize:   13,
      fontWeight: 600,
      color:      T.textSecondary,
    },

    emptySubtitle: {
      margin:     0,
      fontSize:   11,
      fontWeight: 400,
      color:      T.textMuted,
      lineHeight: 1.5,
    },
  };

  /* ─── Render helpers ─────────────────────────────────────────────────── */
  const renderSection = (label: string, chats: typeof displayed, offset = 0) => {
    if (chats.length === 0) return null;
    return (
      <div key={label}>
        {/* Section label */}
        {!isCollapsed && (
          <div style={s.sectionRow}>
            <p style={s.sectionText}>{label}</p>
            <div style={s.sectionLine} />
          </div>
        )}

        {chats.map((chat, i) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (offset + i) * 0.025, duration: 0.18, ease: "easeOut" }}
          >
            <ChatItem
              chat={chat}
              isActive={chat.id === activeChatId}
              isCollapsed={isCollapsed}
              onClick={() => handleSelect(chat.id)}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .hist-input::placeholder { color: ${T.textMuted}; }
        .hist-list::-webkit-scrollbar { width: 4px; }
        .hist-list::-webkit-scrollbar-track { background: transparent; }
        .hist-list::-webkit-scrollbar-thumb {
          background: ${T.border};
          border-radius: 99px;
        }
        .hist-list::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        .hist-clear:hover { background: #64748b !important; }
      `}</style>

      <div style={s.root}>

        {/* ── Search bar ── */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1,  y:  0 }}
            transition={{ duration: 0.18 }}
            style={s.searchWrap}
          >
            <div style={s.searchBox}>
              <span style={s.searchIcon}>
                <Search size={12} strokeWidth={2.5} />
              </span>

              <input
                ref={inputRef}
                type="text"
                placeholder="Search conversations…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={()  => setFocused(false)}
                style={s.searchInput}
                className="hist-input"
                aria-label="Search chats"
                autoComplete="off"
                spellCheck={false}
              />

              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{   opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.1 }}
                    onClick={clearQuery}
                    style={s.clearBtn}
                    className="hist-clear"
                    aria-label="Clear search"
                  >
                    <X size={9} strokeWidth={2.5} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ── Chat list ── */}
        <div style={s.list} className="hist-list">
          <AnimatePresence mode="wait">
            {displayed.length === 0 ? (

              /* Empty state */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{   opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={s.empty}
              >
                <div style={s.emptyIconWrap}>
                  {query
                    ? <Search size={18} strokeWidth={2} />
                    : <MessageSquare size={18} strokeWidth={2} />
                  }
                </div>
                <p style={s.emptyTitle}>
                  {query ? "No results found" : "No conversations yet"}
                </p>
                <p style={s.emptySubtitle}>
                  {query
                    ? `Nothing matched "${query}"`
                    : "Start a new chat to get going"
                  }
                </p>
              </motion.div>

            ) : (

              /* Chat groups */
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{   opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {renderSection("Today",     todayChats, 0)}
                {renderSection("This week", thisWeek,   todayChats.length)}
                {renderSection("Earlier",   olderChats, todayChats.length + thisWeek.length)}
              </motion.div>

            )}
          </AnimatePresence>
        </div>

      </div>
    </>
  );
};