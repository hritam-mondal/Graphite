const calculateStrength = (password: string): string => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  switch (strength) {
    case 0:
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "Weak";
  }
};

export function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = calculateStrength(password);

  return (
    <div className="password-strength-meter">
      <p>Password strength: <strong>{strength}</strong></p>
      <div className="strength-bar">
        <div className={`strength-indicator strength-${strength.toLowerCase()}`} />
      </div>
    </div>
  );
}