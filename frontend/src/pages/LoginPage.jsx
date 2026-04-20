import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });


  const onSubmit = async (data) => {
    try {
      const { user, token } = await authService.login(data.email, data.password);
      const normalizedUser = { id: (user)._id ?? user.id, name: user.name, email: user.email, avatar: user.avatar };
      login(normalizedUser, token);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (err) {
      setError('email', { message: err.message || 'Invalid email or password' });
    }
  };

  const handleGoogle = async () => {
    try {
      await authService.initiateGoogleLogin();
      // page will redirect to Google — no further handling needed here
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed');
    }
  };

  return (
    <AuthLayout heading="Welcome back" subheading="Sign in to your TripSync account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" loading={isSubmitting} className="w-full mt-2" size="lg">
          Sign in
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E0E0E0]" />
          </div>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-[#6B7280]">
        Don't have an account?{' '}
        <Link to="/register" className="text-[#E94560] font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
