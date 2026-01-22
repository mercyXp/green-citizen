'use client';

import { useState } from 'react';
import { Leaf, Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';

import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Spinner } from '@/app/components/ui/spinner';
import { Notification } from '@/app/components/ui/notification';

import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.identifier, // or username logic later
      password: formData.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // redirect handled by middleware
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold">GreenCitizen</span>
          </div>
          <p className="text-secondary">Welcome back, Green Citizen</p>
        </div>

        {/* Error */}
        {error && (
          <Notification type="error" className="mb-4">
            {error}
          </Notification>
        )}

        {/* Card */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">
            Login to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identifier */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email or Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <Input
                  value={formData.identifier}
                  onChange={(e) =>
                    setFormData({ ...formData, identifier: e.target.value })
                  }
                  placeholder="you@example.com"
                  className="pl-11"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Your password"
                  className="pl-11 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="text-primary">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner />
                  Signing in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm mt-6 text-secondary">
            Don’t have an account?{' '}
            <a href="/register" className="text-primary font-semibold">
              Sign up
            </a>
          </p>
        </Card>

        {/* Legal */}
        <p className="text-center mt-6 text-xs text-tertiary">
          By logging in, you agree to our{' '}
          <a href="/terms" className="text-primary">Terms</a> and{' '}
          <a href="/privacy" className="text-primary">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
