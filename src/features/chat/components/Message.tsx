import { motion } from "framer-motion";
import { useState } from "react";

// ── Icons ────────────────────────────────────────────────────────────────────

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const CheckSmallIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ThumbUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);

const ThumbDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
  </svg>
);

const RetryIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Very lightweight inline markdown: bold, inline code, line breaks */
function renderContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    // Split on **bold** and `code`
    const parts: React.ReactNode[] = [];
    const re = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
    let last = 0, m: RegExpExecArray | null;
    let key = 0;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) parts.push(<span key={key++}>{line.slice(last, m.index)}</span>);
      if (m[2]) parts.push(<strong key={key++}>{m[2]}</strong>);
      else if (m[3]) parts.push(<code key={key++} className="msg-inline-code">{m[3]}</code>);
      last = m.index + m[0].length;
    }
    if (last < line.length) parts.push(<span key={key++}>{line.slice(last)}</span>);
    return (
      <span key={li}>
        {parts.length > 0 ? parts : "\u00A0"}
        {li < lines.length - 1 && <br />}
      </span>
    );
  });
}

// ── Component ────────────────────────────────────────────────────────────────

export const Message = ({
  role,
  content,
  timestamp,
}: {
  role: string;
  content: string;
  timestamp?: Date;
}) => {
  const isAssistant = role === "assistant";
  const [copied, setCopied]   = useState(false);
  const [liked,   setLiked]   = useState<null | "up" | "down">(null);
  const time = timestamp ?? new Date();

  const copyText = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <motion.div
      className={`msg-row${isAssistant ? " msg-row--assistant" : " msg-row--user"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {/* Bubble + actions */}
      <div className={`msg-body${isAssistant ? "" : " msg-body--user"}`}>
        {/* Header (assistant only) - timestamp only */}
        {isAssistant && (
          <div className="msg-header">
            <span className="msg-time">{formatTime(time)}</span>
          </div>
        )}

        {/* Bubble */}
        <div className={`msg-bubble${isAssistant ? " msg-bubble--assistant" : " msg-bubble--user"}`}>
          {content && typeof content === "string" && (
            <p className="msg-text">{renderContent(content)}</p>
          )}
        </div>

        {/* User timestamp */}
        {!isAssistant && (
          <div className="msg-time-user">{formatTime(time)}</div>
        )}

        {/* Action bar (assistant only) */}
        {isAssistant && (
          <motion.div
            className="msg-actions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              className={`msg-action-btn${copied ? " msg-action-btn--done" : ""}`}
              onClick={copyText}
              title="Copy"
            >
              {copied ? <CheckSmallIcon /> : <CopyIcon />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            <span className="msg-action-sep" />

            <button
              className={`msg-action-btn${liked === "up" ? " msg-action-btn--liked" : ""}`}
              onClick={() => setLiked(l => l === "up" ? null : "up")}
              title="Good response"
            >
              <ThumbUpIcon />
            </button>
            <button
              className={`msg-action-btn${liked === "down" ? " msg-action-btn--disliked" : ""}`}
              onClick={() => setLiked(l => l === "down" ? null : "down")}
              title="Bad response"
            >
              <ThumbDownIcon />
            </button>

            <span className="msg-action-sep" />

            <button className="msg-action-btn" title="Retry">
              <RetryIcon />
              <span>Retry</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* No user avatar */}

      <style>{`
        /* ── Row layout ─────────────────────────────────────── */
        .msg-row {
          display: flex;
          align-items: flex-start;
          gap: 0;
          width: 100%;
          max-width: 56rem;
          padding: 0 0;
        }
        .msg-row--user {
          flex-direction: row-reverse;
        }

        /* ── Body ───────────────────────────────────────────── */
        .msg-body {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          max-width: min(75%, 640px);
          min-width: 0;
        }
        .msg-body--user {
          align-items: flex-end;
        }

        /* ── Header ─────────────────────────────────────────── */
        .msg-header {
          display: flex;
          align-items: baseline;
          gap: 0.45rem;
          padding-left: 0.125rem;
        }
        .msg-name {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--color-text-primary);
          letter-spacing: 0.01em;
        }
        .msg-time {
          font-size: 0.65rem;
          color: var(--color-text-tertiary);
        }
        .msg-time-user {
          font-size: 0.65rem;
          color: var(--color-text-tertiary);
          padding-right: 0.125rem;
        }

        /* ── Bubble ─────────────────────────────────────────── */
        .msg-bubble {
          border-radius: 14px;
          padding: 0.65rem 0.9rem;
          line-height: 1.65;
        }
        .msg-bubble--assistant {
          background: var(--msg-bubble-ai-bg);
          border: 1px solid var(--color-border-default);
          border-top-left-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .msg-bubble--user {
          background: var(--msg-bubble-user-bg);
          border: none;
          border-bottom-right-radius: 4px;
        }

        .msg-text {
          margin: 0;
          font-size: 0.875rem;
          color: inherit;
          word-break: break-word;
        }
        .msg-bubble--assistant .msg-text { color: var(--msg-bubble-ai-text); }
        .msg-bubble--user .msg-text      { color: var(--msg-bubble-user-text); }

        .msg-inline-code {
          font-family: 'SF Mono', 'Fira Code', 'Menlo', monospace;
          font-size: 0.8em;
          padding: 0.1em 0.35em;
          border-radius: 4px;
          background: var(--msg-inline-code-bg);
          color: var(--msg-inline-code-text);
        }
        .msg-bubble--user .msg-inline-code {
          background: var(--msg-inline-code-bg-user);
          color: var(--msg-inline-code-text-user);
        }

        /* ── Action bar ─────────────────────────────────────── */
        .msg-actions {
          display: flex;
          align-items: center;
          gap: 0.1rem;
          padding-left: 0.1rem;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .msg-row:hover .msg-actions,
        .msg-row:focus-within .msg-actions {
          opacity: 1;
        }

        .msg-action-sep {
          width: 1px;
          height: 12px;
          background: var(--color-border-default);
          margin: 0 0.2rem;
          flex-shrink: 0;
        }

        .msg-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.4rem;
          border-radius: 6px;
          border: none;
          background: transparent;
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--color-text-tertiary);
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
          white-space: nowrap;
        }
        .msg-action-btn:hover { background: var(--color-surface-raised); color: var(--color-text-primary); }
        .msg-action-btn--done { color: var(--color-success) !important; }
        .msg-action-btn--liked { color: var(--color-accent-default) !important; }
        .msg-action-btn--disliked { color: var(--color-danger) !important; }

        @media (max-width: 640px) {
          .msg-body { max-width: 88%; }
          .msg-actions { opacity: 1; }
        }
      `}</style>
    </motion.div>
  );
};