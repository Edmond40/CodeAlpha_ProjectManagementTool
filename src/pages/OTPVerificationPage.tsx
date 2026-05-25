import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function OTPVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value.slice(-1);
    setOtp(newOtp);
    if (value && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Verify your email</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Enter the 6-digit code sent to your email.
      </p>
      <form className="mt-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="flex gap-2 justify-center">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              maxLength={1}
              autoFocus={idx === 0}
            />
          ))}
        </div>
        <Button type="submit" className="w-full">Verify code</Button>
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Didn't get a code?{' '}
            <button type="button" className="text-primary hover:underline font-medium">Resend</button>
          </p>
          <Link to="/auth/login" className="block text-xs text-muted-foreground hover:text-foreground">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}
