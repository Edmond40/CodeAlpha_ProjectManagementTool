import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <CheckCircle className="w-6 h-6 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Check your email</h2>
        <p className="text-sm text-muted-foreground mt-2">
          We sent a reset link to <strong className="text-foreground">{email}</strong>
        </p>
        <Link to="/auth/login" className="mt-6 inline-flex items-center gap-1 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </motion.div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Reset password</h2>
      <p className="text-sm text-muted-foreground mt-1">Enter your email and we'll send you a reset link.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium block text-foreground mb-1.5">Email address</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="you@example.com"
              className="pl-9"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full">Send reset link</Button>
        <div className="text-center">
          <Link to="/auth/login" className="text-sm text-primary hover:underline">Back to login</Link>
        </div>
      </form>
    </div>
  );
}
