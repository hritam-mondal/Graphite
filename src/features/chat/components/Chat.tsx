import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MultimodalInput } from "./MultimodalInput";
import { Overview } from "./Overview";
import { ChatHeader } from "./ChatHeader";

/* ── Types ───────────────────────────────────────────────────────────── */
interface ChatMessage {
  id:        string;
  role:      "user" | "assistant";
  content:   string;
  timestamp: Date;
  streaming?: boolean;
}

/* ── Mock AI responses ────────────────────────────────────────────────
   Keyed by keyword match; falls back to a generic reply.
   Each response is a full string that gets "streamed" character-by-char.
─────────────────────────────────────────────────────────────────────── */
const MOCK_RESPONSES: Array<{ keywords: string[]; reply: string }> = [
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    reply:
      "Hey there! 👋 Great to meet you. I'm Graphyte, your intelligent thinking partner — I can help you think through ideas, answer questions, write code, draft content, and much more.\n\nWhat's on your mind today?",
  },
  {
    keywords: ["how are you", "how's it going", "how do you do"],
    reply:
      "I'm doing great, thanks for asking! Ready and focused. 😊\n\nI don't have feelings in the human sense, but I'm fully operational and genuinely excited to help. What can I do for you?",
  },
  {
    keywords: ["react", "component", "jsx", "frontend", "typescript"],
    reply:
      "Great choice — React is a fantastic ecosystem! Here's a quick example of a clean functional component:\n\n```tsx\ninterface ButtonProps {\n  label: string;\n  onClick: () => void;\n  variant?: 'primary' | 'ghost';\n}\n\nexport const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => (\n  <button\n    onClick={onClick}\n    className={`btn btn-${variant}`}\n  >\n    {label}\n  </button>\n);\n```\n\nA few best practices to keep in mind:\n- Use TypeScript interfaces for all props\n- Keep components small and focused\n- Lift state only when truly needed\n- Prefer composition over prop drilling\n\nWant me to show you a more complex example with hooks or state management?",
  },
  {
    keywords: ["python", "code", "script", "function", "programming"],
    reply:
      "Python is beautifully readable. Here's a clean example:\n\n```python\nfrom typing import Optional\n\ndef greet(name: str, greeting: Optional[str] = \"Hello\") -> str:\n    \"\"\"Return a personalized greeting.\"\"\"\n    return f\"{greeting}, {name}!\"\n\n# Usage\nprint(greet(\"Alice\"))           # Hello, Alice!\nprint(greet(\"Bob\", \"Hey\"))      # Hey, Bob!\n```\n\nSome Python tips I always recommend:\n- Use type hints — they make code self-documenting\n- Embrace list comprehensions for readability\n- Prefer `pathlib` over `os.path` for file operations\n- Use `dataclasses` or `pydantic` for structured data\n\nWhat kind of script are you building?",
  },
  {
    keywords: ["css", "style", "design", "ui", "layout"],
    reply:
      "CSS has come a long way! Here's a modern approach to a card component:\n\n```css\n.card {\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 12px;\n  padding: 20px 24px;\n  box-shadow:\n    0 1px 3px rgba(0,0,0,0.06),\n    0 1px 2px rgba(0,0,0,0.04);\n  transition: box-shadow 0.2s ease, transform 0.2s ease;\n}\n\n.card:hover {\n  box-shadow:\n    0 8px 24px rgba(0,0,0,0.10),\n    0 2px 8px rgba(0,0,0,0.06);\n  transform: translateY(-2px);\n}\n```\n\nKey modern CSS patterns worth knowing:\n- CSS custom properties for theming\n- `clamp()` for fluid typography\n- Container queries for component-level responsiveness\n- `gap` instead of margins for flex/grid layouts\n\nWant me to help with a specific layout challenge?",
  },
  {
    keywords: ["explain", "what is", "tell me", "describe", "how does"],
    reply:
      "Great question! Let me break it down clearly.\n\nAt its core, the concept involves a few key ideas working together:\n\n**The fundamentals:**\nMost complex topics can be understood by starting with first principles — what are the basic building blocks, and how do they interact?\n\n**A practical mental model:**\nThink of it like layers of abstraction. Each layer hides complexity from the one above it, letting you reason at a higher level without getting lost in details.\n\n**Why it matters:**\nUnderstanding the \"why\" behind something is always more valuable than memorizing the \"how\" — it lets you adapt when things change.\n\nCould you give me more context about what specifically you'd like explained? I can go much deeper with a concrete topic.",
  },
  {
    keywords: ["help", "assist", "support", "can you"],
    reply:
      "Absolutely, I'm here to help! Here's a quick overview of what I can do:\n\n**Writing & Content**\n- Draft emails, essays, or documentation\n- Edit and improve existing text\n- Summarize long documents\n\n**Code & Technical**\n- Write, review, and debug code in any language\n- Explain complex technical concepts\n- Design system architecture\n\n**Analysis & Research**\n- Break down complex problems\n- Compare options and make recommendations\n- Answer questions across many domains\n\n**Creative**\n- Brainstorm ideas\n- Write stories, scripts, or descriptions\n- Help with product and UX thinking\n\nWhat would you like to tackle first?",
  },
  {
    keywords: ["thanks", "thank you", "appreciate", "great", "awesome", "perfect"],
    reply:
      "You're very welcome! 🙌 Happy to help whenever you need it.\n\nFeel free to come back with more questions — whether it's a quick lookup or a complex problem to work through together.",
  },
  {
    keywords: ["bye", "goodbye", "see you", "later"],
    reply:
      "Take care! 👋 It was great chatting with you. Come back anytime — I'll be right here whenever you need me.",
  },
];

const FALLBACK_REPLIES = [
  "That's an interesting point. Let me think through this carefully.\n\nBased on what you've shared, there are a few angles worth considering:\n\n**First perspective:** The most direct way to approach this is to break the problem into smaller, more manageable pieces. What's the core constraint you're working with?\n\n**Second perspective:** It's also worth thinking about the second-order effects — what happens downstream once you've solved the immediate problem?\n\nI'd love to dig deeper into this with you. Can you share a bit more context about what you're trying to achieve?",
  "Good thinking! Here's how I'd approach this:\n\nStart by clearly defining what success looks like. Without a clear target, it's easy to optimize for the wrong thing.\n\nOnce you have that, work backwards — what's the minimum set of steps needed to get from where you are to where you want to be? Remove anything that doesn't directly serve that path.\n\nWhat's the specific outcome you're working toward?",
  "Interesting! This touches on something I find genuinely fascinating.\n\nThe key insight here is that most hard problems aren't hard because of what we know — they're hard because of the assumptions we're making without realizing it. Challenging those hidden assumptions is usually where the real breakthrough happens.\n\nWhat assumptions are baked into how you're currently thinking about this?",
  "I hear you. Let me give you a direct, honest take:\n\nThe short answer is that it depends heavily on your specific context — but here are the principles I'd anchor on:\n\n1. **Simplicity wins** — the solution you can actually maintain is better than the theoretically perfect one\n2. **Reversibility matters** — prefer choices you can undo over ones you can't\n3. **Measure, don't guess** — validate your assumptions with data before committing\n\nWhich of these is most relevant to your situation right now?",
];

function getMockReply(input: string): string {
  const lower = input.toLowerCase();
  for (const { keywords, reply } of MOCK_RESPONSES) {
    if (keywords.some(k => lower.includes(k))) return reply;
  }
  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
}

/* ── Streaming simulation ─────────────────────────────────────────────
   Yields characters with a small random delay to mimic token streaming.
─────────────────────────────────────────────────────────────────────── */
async function* streamText(text: string, signal: AbortSignal) {
  // Stream word-by-word for natural feel
  const words = text.split("");
  for (const char of words) {
    if (signal.aborted) return;
    yield char;
    // Slightly longer pauses at punctuation
    const delay = [".", "!", "?", "\n"].includes(char)
      ? 30 + Math.random() * 40
      : 8 + Math.random() * 12;
    await new Promise(r => setTimeout(r, delay));
  }
}

/* ── Icons ───────────────────────────────────────────────────────────── */
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const BotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* ── Typing dots indicator ───────────────────────────────────────────── */
const TypingDots = () => (
  <motion.div
    className="ch-typing"
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 4 }}
    transition={{ duration: 0.18 }}
  >
    <div className="ch-typing-avatar"><BotIcon /></div>
    <div className="ch-typing-bubble">
      <span className="ch-dot" style={{ animationDelay: "0ms" }}/>
      <span className="ch-dot" style={{ animationDelay: "150ms" }}/>
      <span className="ch-dot" style={{ animationDelay: "300ms" }}/>
    </div>
  </motion.div>
);

/* ── Message bubble ──────────────────────────────────────────────────── */
const MessageBubble = ({
  message,
}: {
  message: ChatMessage;
  isLatest?: boolean;
}) => {
  const isUser = message.role === "user";

  const time = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Parse and render content with code block support
  const renderContent = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const lines   = part.slice(3, -3).split("\n");
        const lang    = lines[0].trim();
        const code    = lines.slice(1).join("\n");
        return (
          <div key={i} className="ch-code-block">
            {lang && <div className="ch-code-lang">{lang}</div>}
            <pre><code>{code}</code></pre>
          </div>
        );
      }
      // Render **bold** and newlines
      const formatted = part.split("\n").map((line, li) => {
        const boldParts = line.split(/(\*\*[^*]+\*\*)/g).map((s, si) =>
          s.startsWith("**") && s.endsWith("**")
            ? <strong key={si}>{s.slice(2, -2)}</strong>
            : s
        );
        return (
          <span key={li}>
            {boldParts}
            {li < part.split("\n").length - 1 && <br />}
          </span>
        );
      });
      return <span key={i}>{formatted}</span>;
    });
  };

  return (
    <motion.div
      className={`ch-msg ${isUser ? "ch-msg-user" : "ch-msg-ai"}`}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0,  scale: 1    }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {!isUser && (
        <div className="ch-ai-avatar">
          <BotIcon />
        </div>
      )}

      <div className="ch-msg-body">
        <div className={`ch-bubble ${isUser ? "ch-bubble-user" : "ch-bubble-ai"}`}>
          <div className="ch-bubble-text">
            {renderContent(message.content)}
            {message.streaming && <span className="ch-cursor" />}
          </div>
        </div>

        <div className={`ch-msg-meta ${isUser ? "ch-meta-right" : "ch-meta-left"}`}>
          <span className="ch-timestamp">{time}</span>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Chat component ─────────────────────────────────────────────── */
export function Chat({
  id,
  initialMessages = [],
}: {
  id: string;
  initialMessages?: Array<{ id: string; role: "user" | "assistant"; content: string }>;
}) {
  const [messages, setMessages]         = useState<ChatMessage[]>(
    initialMessages.map(m => ({ ...m, timestamp: new Date() }))
  );
  const [input,       setInput]         = useState("");
  const [isLoading,   setIsLoading]     = useState(false);
  const [isStreaming, setIsStreaming]   = useState(false);
  const [error,       setError]         = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const messagesEndRef       = useRef<HTMLDivElement>(null);
  const containerRef         = useRef<HTMLDivElement>(null);
  const abortRef             = useRef<AbortController | null>(null);

  /* ── Scroll ───────────────────────────────────────────────────────── */
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 140);
  };

  /* ── Core send with streaming ─────────────────────────────────────── */
  const sendMessages = useCallback(async (msgs: ChatMessage[]) => {
    setIsLoading(true);
    setIsStreaming(false);
    setError(null);

    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    // Simulate a short "thinking" delay (100–400ms)
    const thinkingMs = 120 + Math.random() * 280;
    await new Promise(r => setTimeout(r, thinkingMs));
    if (signal.aborted) return;

    setIsLoading(false);
    setIsStreaming(true);

    // Get the mock reply for the last user message
    const lastUserMsg = [...msgs].reverse().find(m => m.role === "user");
    const fullReply   = getMockReply(lastUserMsg?.content ?? "");

    // Create an empty assistant message to stream into
    const assistantId = Date.now().toString();
    const assistantMsg: ChatMessage = {
      id:        assistantId,
      role:      "assistant",
      content:   "",
      timestamp: new Date(),
      streaming: true,
    };
    setMessages(prev => [...prev, assistantMsg]);

    // Stream characters into the message
    try {
      for await (const char of streamText(fullReply, signal)) {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: m.content + char }
              : m
          )
        );
      }
    } catch {
      // aborted
    }

    // Finalise — remove streaming cursor
    setMessages(prev =>
      prev.map(m =>
        m.id === assistantId ? { ...m, streaming: false } : m
      )
    );
    setIsStreaming(false);
    abortRef.current = null;
  }, []);

  /* ── Submit ───────────────────────────────────────────────────────── */
  const handleSubmit = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading || isStreaming) return;

    const userMsg: ChatMessage = {
      id:        Date.now().toString(),
      role:      "user",
      content:   trimmed,
      timestamp: new Date(),
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    await sendMessages(next);
  }, [input, isLoading, isStreaming, messages, sendMessages]);

  /* ── Stop generation ──────────────────────────────────────────────── */
  const stop = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
    setIsStreaming(false);
    // Mark last streaming message as finalised
    setMessages(prev =>
      prev.map(m => m.streaming ? { ...m, streaming: false } : m)
    );
  }, []);

  /* ── Append (for suggestion chips) ───────────────────────────────── */
  const append = useCallback(async (msg: { id: string; role: "user" | "assistant"; content: string }) => {
    const newMsg: ChatMessage = { ...msg, timestamp: new Date() };
    const next = [...messages, newMsg];
    setMessages(next);
    if (msg.role === "user") await sendMessages(next);
  }, [messages, sendMessages]);

  /* ── Retry ────────────────────────────────────────────────────────── */
  const retryLast = useCallback(() => {
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (!lastUser) return;
    const idx      = messages.lastIndexOf(lastUser);
    const truncated = messages.slice(0, idx + 1);
    setMessages(truncated);
    setError(null);
    sendMessages(truncated);
  }, [messages, sendMessages]);

  const isGenerating = isLoading || isStreaming;

  /* ── Render ───────────────────────────────────────────────────────── */
  return (
    <div className="ch-root">

      {/* Header */}
      <ChatHeader chatId={id} />

      {/* Message list */}
      <div
        ref={containerRef}
        className="ch-messages"
        onScroll={handleScroll}
      >
        <div className="ch-messages-inner">

          {/* Overview / empty state */}
          <AnimatePresence>
            {messages.length === 0 && !isGenerating && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{   opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Overview />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isLatest={i === messages.length - 1}
            />
          ))}

          {/* Thinking dots — shown only before streaming starts */}
          <AnimatePresence>
            {isLoading && !isStreaming && <TypingDots key="dots" />}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="ch-error"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              >
                <ErrorIcon />
                <span>{error}</span>
                <button className="ch-error-retry"   onClick={retryLast}>Retry</button>
                <button className="ch-error-dismiss" onClick={() => setError(null)}>✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} style={{ height: 8 }} />
        </div>
      </div>

      {/* Scroll-to-bottom pill */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            className="ch-scroll-btn"
            onClick={() => scrollToBottom()}
            initial={{ opacity: 0, scale: 0.82, y: 8 }}
            animate={{ opacity: 1, scale: 1,    y: 0 }}
            exit={{   opacity: 0, scale: 0.82, y: 8 }}
            transition={{ duration: 0.15 }}
            aria-label="Scroll to bottom"
          >
            <ChevronDownIcon />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="ch-input-area">
        <div className="ch-input-inner">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isGenerating}
            stop={stop}
            messages={messages}
            append={append}
          />
        </div>
      </div>


    </div>
  );
}