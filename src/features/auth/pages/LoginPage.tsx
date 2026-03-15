// ============================================================
//  LoginPage.tsx  —  src/pages/LoginPage.tsx
//  Self-contained: includes its own Spinner + ThemeToggle
//  so you only need to drop in this one file.
// ============================================================

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";

// ── Schema ────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginFormInputs = z.infer<typeof loginSchema>;

// ── Keyframe injection (runs once) ────────────────────────────
if (typeof document !== "undefined" && !document.getElementById("lp-kf")) {
  const s = document.createElement("style");
  s.id = "lp-kf";
  s.textContent = `
    @keyframes lp-spin    { to { transform: rotate(360deg); } }
    @keyframes lp-fadeUp  {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    .lp-input::placeholder { color: var(--color-text-disabled); }
    .lp-submit:not(:disabled):hover { filter: brightness(1.08); }
    .lp-ghost-link:hover  { text-decoration: underline; }
    .lp-eye:hover         { color: var(--color-text-primary) !important; }
  `;
  document.head.appendChild(s);
}

// ── Sub-components ────────────────────────────────────────────

const Spinner: React.FC = () => (
  <span style={{
    display: "inline-block",
    width: 14, height: 14,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "lp-spin 0.7s linear infinite",
  }} aria-hidden="true" />
);


const EyeOpen: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOff: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ── Field error ───────────────────────────────────────────────
const FieldError: React.FC<{ id: string; message?: string }> = ({ id, message }) =>
  message ? (
    <p id={id} role="alert" style={{
      display: "flex", alignItems: "center", gap: 5,
      margin: 0, fontSize: 12, color: "var(--color-danger)",
    }}>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 14, height: 14, borderRadius: "50%",
        background: "var(--color-danger)", color: "#fff",
        fontSize: 9, fontWeight: 700, flexShrink: 0,
      }}>!</span>
      {message}
    </p>
  ) : null;

// ── Page ──────────────────────────────────────────────────────
const LoginPage: React.FC = () => {
  const navigate                        = useNavigate();
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused,      setFocused]      = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } =
    useForm<LoginFormInputs>({ resolver: zodResolver(loginSchema) });

  const onSubmit: SubmitHandler<LoginFormInputs> = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    navigate("/dashboard");
  };

  // Reusable input style composer
  const inputStyle = (name: string, hasError: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "10px 12px",
    fontSize: "var(--font-size-sm)",
    fontFamily: "inherit",
    color: "var(--color-text-primary)",
    background: "var(--color-surface-sunken)",
    border: "0.5px solid",
    borderColor: hasError
      ? "var(--color-danger)"
      : focused === name
      ? "var(--color-accent-default)"
      : "var(--color-border-default)",
    borderRadius: "var(--radius-md)",
    outline: "none",
    boxShadow: hasError
      ? "0 0 0 3px var(--color-danger-bg)"
      : focused === name
      ? "0 0 0 3px var(--color-accent-subtle)"
      : "none",
    transition: "border-color var(--transition-base), box-shadow var(--transition-base)",
  });

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--color-bg-subtle)",
      padding: "24px 16px",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 420,
        background: "var(--color-surface-default)",
        border: "0.5px solid var(--color-border-default)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        padding: "36px 32px 28px",
        animation: "lp-fadeUp 0.3s ease both",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 40, height: 40, margin: "0 auto 16px",
            borderRadius: "var(--radius-md)",
            background: "var(--color-accent-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              width: 18, height: 18, borderRadius: "50%",
              background: "var(--color-accent-default)", display: "block",
            }} />
          </div>
          <h1 style={{
            fontSize: "var(--font-size-xl)", fontWeight: 600,
            color: "var(--color-text-primary)", margin: "0 0 6px",
            lineHeight: "var(--leading-tight)",
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)", margin: 0 }}>
            Sign in to your account to continue
          </p>
        </div>

        <hr style={{ border: "none", borderTop: "0.5px solid var(--color-border-default)", margin: "0 0 24px" }} />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Email field */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="email" style={{
              fontSize: "var(--font-size-sm)", fontWeight: 500,
              color: "var(--color-text-primary)",
            }}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="lp-input"
              {...register("email")}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              style={inputStyle("email", !!errors.email)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-err" : undefined}
            />
            <FieldError id="email-err" message={errors.email?.message} />
          </div>

          {/* Password field */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label htmlFor="password" style={{
                fontSize: "var(--font-size-sm)", fontWeight: 500,
                color: "var(--color-text-primary)",
              }}>
                Password
              </label>
              <a href="#" className="lp-ghost-link" onClick={e => e.preventDefault()} style={{
                fontSize: 12,
                color: "var(--color-accent-default)",
                textDecoration: "none",
              }}>
                Forgot password?
              </a>
            </div>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="lp-input"
                {...register("password")}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                style={{ ...inputStyle("password", !!errors.password), paddingRight: 42 }}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "pw-err" : undefined}
              />
              <button
                type="button"
                className="lp-eye"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: 12,
                  background: "none", border: "none",
                  cursor: "pointer", padding: 0, lineHeight: 1,
                  color: "var(--color-text-secondary)",
                  display: "flex", alignItems: "center",
                  transition: "color var(--transition-base)",
                }}
              >
                {showPassword ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
            <FieldError id="pw-err" message={errors.password?.message} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="lp-submit"
            style={{
              width: "100%",
              padding: "11px 16px",
              marginTop: 4,
              fontSize: "var(--font-size-sm)",
              fontWeight: 500,
              fontFamily: "inherit",
              color: "var(--color-accent-contrast)",
              background: "var(--color-accent-default)",
              border: "none",
              borderRadius: "var(--radius-md)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.65 : 1,
              transition: "opacity var(--transition-base), filter var(--transition-base)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {loading ? <><Spinner /> Signing in…</> : "Sign in"}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          fontSize: 13,
          color: "var(--color-text-secondary)",
          margin: "20px 0 0",
        }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{
            color: "var(--color-accent-default)",
            textDecoration: "none",
            fontWeight: 500,
          }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;