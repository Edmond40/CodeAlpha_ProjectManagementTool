import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    console.log('Register attempt:', data);
    navigate('/dashboard');
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Start managing your projects efficiently today.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Full Name</label>
          <Input
            type="text"
            placeholder="John Doe"
            error={!!errors.fullName}
            {...register('fullName')}
          />
          {errors.fullName && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">
              {errors.fullName.message}
            </motion.p>
          )}
        </div>

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
          <label className="text-sm font-medium text-foreground">Password</label>
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
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
