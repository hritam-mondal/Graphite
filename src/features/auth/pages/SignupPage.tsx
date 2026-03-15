import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { PasswordStrengthMeter } from "@components/common/PasswordStrengthMeter";
import { Spinner } from "@components/ui/Spinner";

// ── Schema ────────────────────────────────────────────────────────────────────

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[^a-zA-Z0-9]/, "Must include a special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type SignupFormInputs = z.infer<typeof signupSchema>;

// ── Icons ─────────────────────────────────────────────────────────────────────

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

// ── Field component ───────────────────────────────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  icon: React.ReactNode;
  error?: string;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
  showToggle?: boolean;
  onToggle?: () => void;
  showPassword?: boolean;
}

const Field: React.FC<FieldProps> = ({
  id, label, type = "text", icon, error, registration,
  showToggle = false, onToggle, showPassword,
}) => (
  <div className="sp-field">
    <label className="sp-label" htmlFor={id}>{label}</label>
    <div className={`sp-input-wrap${error ? " sp-input-wrap--error" : ""}`}>
      <span className="sp-input-icon">{icon}</span>
      <input
        id={id}
        type={showToggle ? (showPassword ? "text" : "password") : type}
        className="sp-input"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...registration}
      />
      {showToggle && (
        <button
          type="button"
          className="sp-eye-btn"
          onClick={onToggle}
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
    {error && (
      <p id={`${id}-error`} className="sp-error" role="alert">{error}</p>
    )}
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting]       = useState(false);
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm,  setShowConfirm]        = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormInputs>({ resolver: zodResolver(signupSchema) });

  const onSubmit: SubmitHandler<SignupFormInputs> = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    navigate("/login", { state: { success: "Account created successfully!" } });
  };

  const password = watch("password");

  return (
    <div className="sp-root">

      {/* Card */}
      <div className="sp-card">

        {/* Header */}
        <div className="sp-header">
          <div className="sp-logo" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="sp-title">Create your account</h1>
          <p className="sp-subtitle">Join thousands of users today</p>
        </div>

        {/* Form */}
        <form className="sp-form" onSubmit={handleSubmit(onSubmit)} noValidate>

          <Field
            id="fullName"
            label="Full name"
            icon={<UserIcon />}
            error={errors.fullName?.message}
            registration={register("fullName")}
          />

          <Field
            id="email"
            label="Email address"
            type="email"
            icon={<MailIcon />}
            error={errors.email?.message}
            registration={register("email")}
          />

          <div className="sp-field">
            <label className="sp-label" htmlFor="password">Password</label>
            <div className={`sp-input-wrap${errors.password ? " sp-input-wrap--error" : ""}`}>
              <span className="sp-input-icon"><LockIcon /></span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="sp-input"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password")}
              />
              <button
                type="button"
                className="sp-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="sp-error" role="alert">{errors.password.message}</p>
            )}
            {password && <PasswordStrengthMeter password={password} />}
          </div>

          <Field
            id="confirmPassword"
            label="Confirm password"
            icon={<LockIcon />}
            error={errors.confirmPassword?.message}
            registration={register("confirmPassword")}
            showToggle
            onToggle={() => setShowConfirm((v) => !v)}
            showPassword={showConfirm}
          />

          <button
            type="submit"
            className="sp-submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner />
                <span>Creating account…</span>
              </>
            ) : (
              <>
                <span>Create account</span>
                <ArrowRightIcon />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="sp-footer">
          Already have an account?{" "}
          <a className="sp-link" href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;