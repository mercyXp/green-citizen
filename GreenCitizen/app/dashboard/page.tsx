'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Loader2, Plus, Sprout, Droplets, Leaf, Recycle, Zap, BookOpen } from 'lucide-react';
import LogActionModal from '@/app/components/LogActionModal';

// =====================
// TYPES
// =====================

type UserProfile = {
  id: string;
  display_name: string | null;
  district: string;
  total_points: number;
  allow_public_profile: boolean;
};

type Action = {
  id: string;
  action_type: string;
  description: string | null;
  verification_level: 'pending' | 'verified' | 'champion';
  points: number;
  created_at: string;
};

// =====================
// DASHBOARD PAGE
// =====================
function DashboardPage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogActionOpen, setIsLogActionOpen] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.user.id)
        .single();

      const { data: actionsData } = await supabase
        .from('actions')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setProfile(profileData as UserProfile);
      setActions((actionsData as Action[]) || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const verifiedPoints = actions
    .filter((a) => a.verification_level === 'verified' || a.verification_level === 'champion')
    .reduce((sum, a) => sum + a.points, 0);

  const pendingActions = actions.filter((a) => a.verification_level === 'pending');

  return (
    <div className="min-h-screen space-y-4 bg-bg-primary p-3 sm:space-y-6 sm:p-6">
      {/* ===================== */}
      {/* HEADER */}
      {/* ===================== */}
      <Card>
        <CardContent className="flex flex-col gap-1 p-3 sm:gap-2 sm:p-6">
          <h1 className="text-lg font-semibold sm:text-2xl">
            Welcome, {profile.display_name ?? 'Citizen'}
          </h1>
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            <span className="text-secondary">{profile.district}</span>
            <Badge variant="info" className="text-xs">
              Active Citizen
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* IMPACT SUMMARY */}
      {/* ===================== */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-6">
            <p className="text-xs text-secondary sm:text-sm">Total Actions</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{actions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <p className="text-xs text-secondary sm:text-sm">Verified Points</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{verifiedPoints}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-6">
            <p className="text-xs text-secondary sm:text-sm">Pending</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{pendingActions.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* ===================== */}
      {/* PRIMARY CTA */}
      {/* ===================== */}
      <Card>
        <CardContent className="flex flex-col items-start justify-between gap-3 p-3 sm:flex-row sm:items-center sm:p-6">
          <div className="flex-1">
            <h2 className="text-sm font-semibold sm:text-base">Log an Environmental Action</h2>
            <p className="text-xs text-secondary sm:text-sm">
              Record your climate-positive activities
            </p>
          </div>
          <Button 
            onClick={() => setIsLogActionOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 sm:mr-2" /> 
            <span className="hidden sm:inline">Log Action</span>
            <span className="sm:hidden">Log</span>
          </Button>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* ATTENTION PANEL */}
      {/* ===================== */}
      {pendingActions.length > 0 && (
        <Card>
          <CardContent className="p-3 sm:p-6">
            <h3 className="text-sm font-semibold sm:text-base">Actions Needing Attention</h3>
            <p className="text-xs text-secondary sm:text-sm">
              {pendingActions.length} action(s) awaiting verification
            </p>
          </CardContent>
        </Card>
      )}

      {/* ===================== */}
      {/* RECENT ACTIONS */}
      {/* ===================== */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <h3 className="mb-3 text-sm font-semibold sm:mb-4 sm:text-base">Recent Actions</h3>
          <div className="space-y-2 sm:space-y-3">
            {actions.length === 0 ? (
              <p className="text-xs text-secondary sm:text-sm">No actions logged yet. Start by logging your first action!</p>
            ) : (
              actions.map((action) => (
                <div
                  key={action.id}
                  className="flex flex-col gap-2 rounded-lg border border-border-primary p-2 sm:flex-row sm:items-center sm:justify-between sm:p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-medium sm:text-sm capitalize">
                      {action.action_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-tertiary">
                      {new Date(action.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        action.verification_level === 'verified' || action.verification_level === 'champion'
                          ? 'success'
                          : action.verification_level === 'pending'
                          ? 'warning'
                          : 'error'
                      }
                      className="text-xs"
                    >
                      {action.verification_level}
                    </Badge>
                    <span className="text-xs font-semibold text-primary">+{action.points}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* GREEN TIPS & RESOURCES */}
      {/* ===================== */}
      <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-primary">
            Green Tips & Resources
          </h3>
          <div className="space-y-2">
            <a
              href="/resources/tree-planting"
              className="flex items-center gap-2 text-xs sm:text-sm text-secondary hover:text-primary transition-colors"
            >
              <Sprout className="h-4 w-4" />
              <span className="text-secondary">Tree Planting Guide</span>
            </a>
            <a
              href="/resources/water-conservation"
              className="flex items-center gap-2 text-xs sm:text-sm text-secondary hover:text-primary transition-colors"
            >
              <Droplets className="h-4 w-4" />
              <span className="text-secondary">Water Conservation Tips</span>
            </a>
            <a
              href="/resources/conservation-farming"
              className="flex items-center gap-2 text-xs sm:text-sm text-secondary hover:text-primary transition-colors"
            >
              <Leaf className="h-4 w-4" />
              <span className="text-secondary">Conservation Farming Practices</span>
            </a>
            <a
              href="/resources/recycling"
              className="flex items-center gap-2 text-xs sm:text-sm text-secondary hover:text-primary transition-colors"
            >
              <Recycle className="h-4 w-4" />
              <span className="text-secondary">How to Recycle Properly</span>
            </a>
            <a
              href="/resources/energy-saving"
              className="flex items-center gap-2 text-xs sm:text-sm text-secondary hover:text-primary transition-colors"
            >
              <Zap className="h-4 w-4" />
              <span className="text-secondary">Energy Saving Tips</span>
            </a>
            <a
              href="/resources"
              className="flex items-center gap-2 text-xs sm:text-sm text-secondary hover:text-primary transition-colors pt-2 border-t border-secondary/20"
            >
              <BookOpen className="h-4 w-4" />
              <span className="font-semibold text-secondary">View All Resources →</span>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* LOG ACTION MODAL */}
      {/* ===================== */}
      <LogActionModal
        isOpen={isLogActionOpen}
        onClose={() => setIsLogActionOpen(false)}
        userId={profile.id}
        onActionLogged={loadDashboard}
      />
    </div>
  );
}
export default DashboardPage;