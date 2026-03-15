import { motion } from "framer-motion";

const capabilities = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    label: "Natural conversation",
    desc: "Chat fluidly across any topic",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    label: "Web search",
    desc: "Pull in real-time information",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
      </svg>
    ),
    label: "Deep thinking",
    desc: "Extended reasoning on hard problems",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
    label: "File analysis",
    desc: "Read PDFs, images, docs & more",
  },
];

const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { 
    opacity: 1, 
    y: 0, 
  },
};

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="ov-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
    >
      {/* Orbs live in their own clipped box so they never affect layout */}
      <div className="ov-orb-stage" aria-hidden>
        <div className="ov-orb ov-orb--a" />
        <div className="ov-orb ov-orb--b" />
        <div className="ov-orb ov-orb--c" />
      </div>

      <motion.div className="ov-inner" variants={stagger} initial="initial" animate="animate">

        {/* Headline */}
        <motion.div variants={fadeUp} className="ov-headline-wrap">
          <h1 className="ov-headline">Graphite</h1>
        </motion.div>

        {/* Subline */}
        <motion.p variants={fadeUp} className="ov-sub">
          Your intelligent thinking partner for any task.<br />
          Reason deeply, search the web, and work with your files.
        </motion.p>

        {/* Divider */}
        <motion.div variants={fadeUp} className="ov-divider">
          <span className="ov-divider-line" />
          <span className="ov-divider-label">What I can do</span>
          <span className="ov-divider-line" />
        </motion.div>

        {/* Capabilities grid */}
        <motion.div variants={stagger} className="ov-caps">
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="ov-cap"
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <span className="ov-cap-icon">{cap.icon}</span>
              <span className="ov-cap-body">
                <span className="ov-cap-label">{cap.label}</span>
                <span className="ov-cap-desc">{cap.desc}</span>
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Nudge */}
        <motion.p variants={fadeUp} className="ov-nudge">
          Type a message below or pick a suggestion to get started ↓
        </motion.p>

      </motion.div>
    </motion.div>
  );
};