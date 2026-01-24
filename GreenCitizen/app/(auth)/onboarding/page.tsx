'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, ArrowRight, CheckCircle2 } from 'lucide-react';

import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Spinner } from '@/app/components/ui/spinner';
import { Notification } from '@/app/components/ui/notification';

import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    district: '',
    agree_to_terms: false,
    public_profile: true,
    notifications_enabled: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.username.trim() || !formData.display_name.trim()) {
        setError('Please fill in all profile fields');
        return;
      }
    }
    if (step === 2) {
      if (!formData.district.trim()) {
        setError('Please select or enter your district');
        return;
      }
    }
    setError(null);
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!formData.agree_to_terms) {
      setError('You must agree to the terms to continue');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('No authenticated user found');
        setLoading(false);
        return;
      }

      // Update or insert user profile
      const { error: updateError } = await supabase
        .from('users')
        .upsert(
          {
            id: user.id,
            username: formData.username,
            display_name: formData.display_name,
            district: formData.district,
            public_profile: formData.public_profile,
            notifications_enabled: formData.notifications_enabled,
            onboarding_completed: true,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'id',
          }
        );

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 transition-colors duration-300 bg-gradient-primary">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-12 h-12 text-white" />
            <span className="text-4xl font-bold text-white">GreenCitizen</span>
          </div>
          <p className="text-white/80">Complete your profile to get started</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                    step >= num
                      ? 'bg-white text-primary'
                      : 'bg-white/30 text-white'
                  }`}
                >
                  {step > num ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    num
                  )}
                </div>
                {num < 3 && (
                  <div
                    className={`flex-1 h-1 transition-all ${
                      step > num ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-2 text-white/80 text-sm">
            Step {step} of 3
          </div>
        </div>

        {/* Error */}
        {error && (
          <Notification variant="error" message={error} className="mb-6" />
        )}

        {/* Success */}
        {success && (
          <Notification
            variant="success"
            message="Welcome! Redirecting to dashboard..."
            className="mb-6"
          />
        )}

        {/* Card */}
        <Card>
          {/* Step 1: Profile Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Let&apos;s start with your profile
                </h2>
                <p className="text-secondary">
                  This helps the community know who you are
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Display Name *
                  </label>
                  <Input
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Username *
                  </label>
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="johndoe"
                    required
                  />
                  <p className="text-xs text-tertiary mt-1">
                    Lowercase letters, numbers, and underscores only
                  </p>
                </div>
              </div>

              <Button onClick={handleNextStep} className="w-full">
                Next
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Location & Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Where are you based?
                </h2>
                <p className="text-secondary">
                  Help us show you relevant local opportunities
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    District / Province *
                  </label>
                  <Input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="e.g., Lusaka, Copperbelt"
                    required
                  />
                </div>

                <div className="space-y-3 border-t border-secondary pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="public_profile"
                      checked={formData.public_profile}
                      onChange={handleInputChange}
                      className="cursor-pointer"
                    />
                    <span className="text-secondary">
                      Make my profile public on leaderboards
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="notifications_enabled"
                      checked={formData.notifications_enabled}
                      onChange={handleInputChange}
                      className="cursor-pointer"
                    />
                    <span className="text-secondary">
                      Receive updates about challenges & opportunities
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handlePreviousStep}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={handleNextStep} className="flex-1">
                  Next
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Agree */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  Ready to make a difference?
                </h2>
                <p className="text-secondary">
                  Review your information and agree to our terms
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-3 bg-secondary/5 p-4 rounded-lg border border-secondary/20">
                <div>
                  <p className="text-xs text-tertiary uppercase">Display Name</p>
                  <p className="text-primary font-semibold">
                    {formData.display_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-tertiary uppercase">Username</p>
                  <p className="text-primary font-semibold">
                    @{formData.username}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-tertiary uppercase">District</p>
                  <p className="text-primary font-semibold">
                    {formData.district}
                  </p>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-4 border-t border-secondary pt-4">
                <label className="flex gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agree_to_terms"
                    checked={formData.agree_to_terms}
                    onChange={handleInputChange}
                    className="cursor-pointer mt-1"
                  />
                  <span className="text-secondary text-sm">
                    I agree to the GreenCitizen{' '}
                    <a href="/terms" className="text-primary font-semibold hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary font-semibold hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handlePreviousStep}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={loading || !formData.agree_to_terms}
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Let&apos;s Go
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          You can update your profile anytime from settings
        </p>
      </div>
    </div>
  );
}