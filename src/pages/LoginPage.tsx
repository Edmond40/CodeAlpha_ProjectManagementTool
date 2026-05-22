import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    console.log('Login attempt:', data);
    navigate('/dashboard');
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your details to access your workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input
            type="email"
            placeholder="name@company.com"
            error={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">
              {errors.email.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Password</label>
            <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={!!errors.password}
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">
              {errors.password.message}
            </motion.p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/auth/register" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
