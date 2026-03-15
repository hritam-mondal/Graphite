import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useEffect, useCallback, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AttachedFile {
  name: string;
  size: number;
  type: string;
  id: string;
}

type ThinkingLevel = "off" | "normal" | "deep";
type ModelProvider  = "anthropic" | "openai";

interface AIModel {
  id: string;
  name: string;
  desc: string;
  provider: ModelProvider;
  badge: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const suggestedActions = [
  { icon: "✦", title: "Future of AI",     label: "What's coming next in AI?",               action: "Tell me about the future of AI" },
  { icon: "◈", title: "Machine Learning", label: "Break down ML concepts simply",            action: "What is machine learning?" },
  { icon: "◎", title: "Getting Started",  label: "How do I get the most out of this?",       action: "How do I use this chatbot?" },
  { icon: "⬡", title: "Capabilities",     label: "Explore what I can help you with",         action: "What can you help me with?" },
];

const THINKING_OPTIONS: { value: ThinkingLevel; label: string; desc: string }[] = [
  { value: "off",    label: "Off",    desc: "Standard responses" },
  { value: "normal", label: "Normal", desc: "Thinks before answering" },
  { value: "deep",   label: "Deep",   desc: "Extended reasoning" },
];

const MODELS: AIModel[] = [
  { id: "claude-opus-4-5",   name: "Claude Opus",   desc: "Most capable",              provider: "anthropic", badge: "Opus"   },
  { id: "claude-sonnet-4-5", name: "Claude Sonnet", desc: "Balanced speed & quality",  provider: "anthropic", badge: "Sonnet" },
  { id: "claude-haiku-4-5",  name: "Claude Haiku",  desc: "Fast & lightweight",        provider: "anthropic", badge: "Haiku"  },
  { id: "gpt-4o",            name: "GPT-4o",        desc: "OpenAI flagship",           provider: "openai",    badge: "4o"    },
  { id: "gpt-4o-mini",       name: "GPT-4o mini",   desc: "Fast & affordable",         provider: "openai",    badge: "mini"  },
  { id: "o1-preview",        name: "o1 Preview",    desc: "Advanced reasoning",        provider: "openai",    badge: "o1"    },
];

// ── Icons ──────────────────────────────────────────────────────────────────────

const PaperclipIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const BrainIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const StopIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="3" />
  </svg>
);

const XIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const ImageFileIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  return type.startsWith("image/") ? <ImageFileIcon /> : <FileTextIcon />;
}

// ── Dropdown menu (shared, upward) ─────────────────────────────────────────────

const dropdownVariants = {
  hidden:  { opacity: 0, y: 8,  scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1    },
  exit:    { opacity: 0, y: 6,  scale: 0.97 },
};

// ── Component ──────────────────────────────────────────────────────────────────

export function MultimodalInput({
  input,
  setInput,
  isLoading,
  stop,
  messages,
  append,
  handleSubmit,
}: {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  messages: Message[];
  append: (message: Message) => void;
  handleSubmit?: (event?: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
}) {
  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thinkingRef  = useRef<HTMLDivElement>(null);
  const modelRef     = useRef<HTMLDivElement>(null);

  const [webSearch,        setWebSearch]        = useState(false);
  const [thinkingLevel,    setThinkingLevel]    = useState<ThinkingLevel>("off");
  const [showThinkingMenu, setShowThinkingMenu] = useState(false);
  const [attachedFiles,    setAttachedFiles]    = useState<AttachedFile[]>([]);
  const [dragOver,         setDragOver]         = useState(false);
  const [selectedModel,    setSelectedModel]    = useState<AIModel>(MODELS[1]);
  const [showModelMenu,    setShowModelMenu]    = useState(false);

  const charCount   = input.length;
  const maxChars    = 4000;
  const isNearLimit = charCount > maxChars * 0.85;
  const canSubmit   = input.trim().length > 0 && !isLoading && charCount <= maxChars;

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, []);

  useEffect(() => { adjustHeight(); }, [input, adjustHeight]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (thinkingRef.current && !thinkingRef.current.contains(e.target as Node))
        setShowThinkingMenu(false);
      if (modelRef.current && !modelRef.current.contains(e.target as Node))
        setShowModelMenu(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit && handleSubmit) handleSubmit();
    }
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const next: AttachedFile[] = Array.from(fileList).map((f) => ({
      name: f.name, size: f.size, type: f.type,
      id: Math.random().toString(36).slice(2),
    }));
    setAttachedFiles((prev) => [...prev, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (id: string) =>
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));

  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const onDragLeave = () => setDragOver(false);
  const onDrop      = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const activeThinking = THINKING_OPTIONS.find((o) => o.value === thinkingLevel)!;

  const thinkingBtnClass = [
    "mi-tool-btn",
    thinkingLevel === "normal" ? "mi-tool-btn--think-normal" : "",
    thinkingLevel === "deep"   ? "mi-tool-btn--think-deep"   : "",
    showThinkingMenu           ? "mi-tool-btn--open"         : "",
  ].filter(Boolean).join(" ");

  const modelBtnClass = [
    "mi-model-btn",
    showModelMenu ? "mi-model-btn--open" : "",
  ].filter(Boolean).join(" ");

  const sendBtnClass = [
    "mi-send-btn",
    isLoading                ? "mi-send-btn--stop"     : "",
    !canSubmit && !isLoading ? "mi-send-btn--disabled"  : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="mi-root">

      {/* ── Suggestion cards ── */}
      <AnimatePresence>
        {messages.length === 0 && !isLoading && (
          <motion.div
            className="mi-suggestions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            {suggestedActions.map((a, i) => (
              <motion.button
                key={i}
                className="mi-suggestion-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.18 }}
                whileHover={{ y: -2, transition: { duration: 0.12 } }}
                onClick={() => append({ id: "", role: "user", content: a.action })}
              >
                <span className="mi-sug-icon">{a.icon}</span>
                <span className="mi-sug-body">
                  <span className="mi-sug-title">{a.title}</span>
                  <span className="mi-sug-label">{a.label}</span>
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active feature pills ── */}
      <AnimatePresence>
        {(webSearch || thinkingLevel !== "off") && (
          <motion.div
            className="mi-pills"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.16 }}
          >
            {webSearch && (
              <motion.span
                className="mi-pill mi-pill--search"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <GlobeIcon />
                Web search
                <button className="mi-pill-x" onClick={() => setWebSearch(false)} aria-label="Disable web search">
                  <XIcon />
                </button>
              </motion.span>
            )}
            {thinkingLevel !== "off" && (
              <motion.span
                className={`mi-pill mi-pill--think mi-pill--think-${thinkingLevel}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <BrainIcon />
                {activeThinking.label} thinking
                <button className="mi-pill-x" onClick={() => setThinkingLevel("off")} aria-label="Disable thinking">
                  <XIcon />
                </button>
              </motion.span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main box ── */}
      <div
        className={[
          "mi-box",
          input.length > 0 ? "mi-box--active" : "",
          isLoading        ? "mi-box--loading" : "",
          dragOver         ? "mi-box--drag"    : "",
        ].filter(Boolean).join(" ")}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {/* Loading bar */}
        <AnimatePresence>
          {isLoading && (
            <motion.div className="mi-loading-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          )}
        </AnimatePresence>

        {/* Drag overlay */}
        <AnimatePresence>
          {dragOver && (
            <motion.div className="mi-drag-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PaperclipIcon />
              <span>Drop files to attach</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* File chips */}
        <AnimatePresence>
          {attachedFiles.length > 0 && (
            <motion.div
              className="mi-files"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              {attachedFiles.map((f) => (
                <motion.div
                  key={f.id}
                  className="mi-chip"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.13 }}
                >
                  <span className="mi-chip-icon">{getFileIcon(f.type)}</span>
                  <span className="mi-chip-name">{f.name}</span>
                  <span className="mi-chip-size">{formatBytes(f.size)}</span>
                  <button className="mi-chip-remove" onClick={() => removeFile(f.id)} aria-label="Remove file">
                    <XIcon />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="mi-textarea"
          placeholder={dragOver ? "" : "Ask anything…"}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        {/* ── Toolbar ── */}
        <div className="mi-toolbar">
          <div className="mi-toolbar-left">

            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => addFiles(e.target.files)}
              accept="image/*,.pdf,.txt,.md,.csv,.json,.docx,.xlsx"
            />

            {/* Attach */}
            <button
              className={`mi-tool-btn${attachedFiles.length > 0 ? " mi-tool-btn--file-on" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              title="Attach files"
            >
              <PaperclipIcon />
              <span className="mi-tool-label">
                {attachedFiles.length > 0 ? `${attachedFiles.length} file${attachedFiles.length > 1 ? "s" : ""}` : "Attach"}
              </span>
            </button>

            <span className="mi-divider" />

            {/* Web search */}
            <button
              className={`mi-tool-btn${webSearch ? " mi-tool-btn--search-on" : ""}`}
              onClick={() => setWebSearch((v) => !v)}
              title="Toggle web search"
              aria-pressed={webSearch}
            >
              <GlobeIcon />
              <span className="mi-tool-label">Search</span>
              <span className="mi-on-dot" />
            </button>

            <span className="mi-divider" />

            {/* Thinking — upward dropdown */}
            <div className="mi-dropdown-wrap" ref={thinkingRef}>
              <button
                className={thinkingBtnClass}
                onClick={() => setShowThinkingMenu((v) => !v)}
                aria-haspopup="true"
                aria-expanded={showThinkingMenu}
              >
                <BrainIcon />
                <span className="mi-tool-label">
                  {thinkingLevel === "off" ? "Thinking" : activeThinking.label}
                </span>
                <span className={`mi-chevron-icon${showThinkingMenu ? " mi-chevron-icon--open" : ""}`}>
                  <ChevronUpIcon />
                </span>
              </button>

              <AnimatePresence>
                {showThinkingMenu && (
                  <motion.div
                    className="mi-dropdown mi-dropdown--left"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="mi-dropdown-header">Thinking depth</p>
                    {THINKING_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        className={`mi-dropdown-item${thinkingLevel === opt.value ? " mi-dropdown-item--active" : ""}`}
                        onClick={() => { setThinkingLevel(opt.value); setShowThinkingMenu(false); }}
                      >
                        <span className={`mi-think-dot mi-think-dot--${opt.value}`} />
                        <span className="mi-dropdown-item-body">
                          <span className="mi-dropdown-item-label">{opt.label}</span>
                          <span className="mi-dropdown-item-desc">{opt.desc}</span>
                        </span>
                        {thinkingLevel === opt.value && <span className="mi-dropdown-check"><CheckIcon /></span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right side ── */}
          <div className="mi-toolbar-right">

            {/* Model selector — upward dropdown */}
            <div className="mi-dropdown-wrap" ref={modelRef}>
              <button
                className={modelBtnClass}
                onClick={() => setShowModelMenu((v) => !v)}
                title="Choose model"
                aria-haspopup="true"
                aria-expanded={showModelMenu}
              >
                <span className={`mi-provider-dot mi-provider-dot--${selectedModel.provider}`} />
                <span className="mi-model-name">{selectedModel.name}</span>
                <span className={`mi-chevron-icon${showModelMenu ? " mi-chevron-icon--open" : ""}`}>
                  <ChevronUpIcon />
                </span>
              </button>

              <AnimatePresence>
                {showModelMenu && (
                  <motion.div
                    className="mi-dropdown mi-dropdown--right"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="mi-dropdown-header">Anthropic</p>
                    {MODELS.filter((m) => m.provider === "anthropic").map((model) => (
                      <button
                        key={model.id}
                        className={`mi-dropdown-item${selectedModel.id === model.id ? " mi-dropdown-item--active" : ""}`}
                        onClick={() => { setSelectedModel(model); setShowModelMenu(false); }}
                      >
                        <span className="mi-model-badge mi-model-badge--anthropic">{model.badge}</span>
                        <span className="mi-dropdown-item-body">
                          <span className="mi-dropdown-item-label">{model.name}</span>
                          <span className="mi-dropdown-item-desc">{model.desc}</span>
                        </span>
                        {selectedModel.id === model.id && <span className="mi-dropdown-check"><CheckIcon /></span>}
                      </button>
                    ))}

                    <div className="mi-dropdown-sep" />

                    <p className="mi-dropdown-header">OpenAI</p>
                    {MODELS.filter((m) => m.provider === "openai").map((model) => (
                      <button
                        key={model.id}
                        className={`mi-dropdown-item${selectedModel.id === model.id ? " mi-dropdown-item--active" : ""}`}
                        onClick={() => { setSelectedModel(model); setShowModelMenu(false); }}
                      >
                        <span className="mi-model-badge mi-model-badge--openai">{model.badge}</span>
                        <span className="mi-dropdown-item-body">
                          <span className="mi-dropdown-item-label">{model.name}</span>
                          <span className="mi-dropdown-item-desc">{model.desc}</span>
                        </span>
                        {selectedModel.id === model.id && <span className="mi-dropdown-check"><CheckIcon /></span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="mi-divider" />

            {/* Char count */}
            <AnimatePresence>
              {charCount > 0 && (
                <motion.span
                  className={`mi-char-count${isNearLimit ? " mi-char-count--warn" : ""}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                  {charCount}/{maxChars}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Send / Stop */}
            <motion.button
              className={sendBtnClass}
              onClick={() => isLoading ? stop() : canSubmit && handleSubmit?.()}
              whileTap={{ scale: 0.88 }}
              whileHover={canSubmit || isLoading ? { scale: 1.06 } : {}}
              disabled={!canSubmit && !isLoading}
              aria-label={isLoading ? "Stop generation" : "Send message"}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.span key="stop"
                    initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.12 }}
                  >
                    <StopIcon />
                  </motion.span>
                ) : (
                  <motion.span key="send"
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
                  >
                    <ArrowUpIcon />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hint */}
      <p className="mi-hint-text">
        {isLoading
          ? "Generating…"
          : "↵ send · Shift+↵ newline · drag & drop to attach"}
      </p>
    </div>
  );
}