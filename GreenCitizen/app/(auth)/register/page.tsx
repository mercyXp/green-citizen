'use client';

import React, { useState } from 'react';
import { Leaf, Eye, EyeOff, Mail, Lock, User, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/app/components/ui/button';
import { Form } from '@/app/components/ui/form';
import { Card } from '@/app/components/ui/card';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    district: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const zambianDistricts = [
    'Lusaka', 'Copperbelt', 'Southern', 'Northern', 'Eastern',
    'Western', 'North-Western', 'Luapula', 'Central', 'Muchinga'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      alert('You must agree to the terms');
      return;
    }

    setLoading(true);

    try {
      /**
       * 1. Create Supabase Auth user
       */
      const { data, error } = await supabase.auth.signUp({
        email: formData.email || undefined,
        password: formData.password,
      });

      if (error || !data.user) {
        throw error;
      }

      /**
       * 2. Create public.users profile row
       */
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          username: formData.username,
          display_name: formData.username,
          district: formData.district,
          allow_public_profile: false,
        });

      if (profileError) {
        throw profileError;
      }

      /**
       * 3. Redirect to dashboard (middleware will protect)
       */
      router.push('/dashboard');

    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-green flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="w-10 h-10 text-white" />
            <span className="text-3xl font-bold text-white">Green Citizen</span>
          </div>
          <p className="text-green-50">Join Zambia&apos;s climate action network</p>
        </div>

        <Card className="glass">
          <Card.Header>
            <h2 className="text-2xl font-bold">Create Your Account</h2>
            <p className="text-gray-600 mt-1">Become a verified Green Citizen</p>
          </Card.Header>

          <Card.Body>
            <Form onSubmit={handleSubmit}>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Username */}
                <Form.Group>
                  <Form.Label required>Username</Form.Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Form.Input
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="pl-11"
                      required
                    />
                  </div>
                </Form.Group>

                {/* Email */}
                <Form.Group>
                  <Form.Label>Email (optional)</Form.Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Form.Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-11"
                    />
                  </div>
                </Form.Group>
              </div>

              {/* District */}
              <Form.Group>
                <Form.Label required>District</Form.Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Form.Select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="pl-11"
                    required
                  >
                    <option value="">Select district</option>
                    {zambianDistricts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Password */}
                <Form.Group>
                  <Form.Label required>Password</Form.Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Form.Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-11 pr-12"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </Form.Group>

                {/* Confirm */}
                <Form.Group>
                  <Form.Label required>Confirm Password</Form.Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Form.Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-11 pr-12"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </Form.Group>
              </div>

              {/* Privacy Notice */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <CheckCircle className="text-green-600" />
                  <p className="text-sm text-gray-600">
                    Your identity is protected. Only your username is public.
                  </p>
                </div>
              </div>

              {/* Terms */}
              <Form.Group>
                <label className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                    required
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the Terms and Privacy Policy
                  </span>
                </label>
              </Form.Group>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
