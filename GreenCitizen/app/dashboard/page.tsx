'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Loader2, Plus } from 'lucide-react';

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
  status: 'pending' | 'approved' | 'rejected';
  points_awarded: number;
  created_at: string;
};

// =====================
// DASHBOARD PAGE
// =====================

export default function DashboardPage() {
  const supabase = createClient();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

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

      setProfile(profileData);
      setActions(actionsData || []);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const verifiedPoints = actions
    .filter(a => a.status === 'approved')
    .reduce((sum, a) => sum + a.points_awarded, 0);

  const pendingActions = actions.filter(a => a.status === 'pending');

  return (
    <div className="space-y-6 p-6">
      {/* ===================== */}
      {/* HEADER */}
      {/* ===================== */}
      <Card>
        <CardContent className="flex flex-col gap-2 p-6">
          <h1 className="text-2xl font-semibold">Welcome, {profile.display_name ?? 'Citizen'}</h1>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>{profile.district}</span>
            <Badge variant="outline">Active Citizen</Badge>
          </div>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* IMPACT SUMMARY */}
      {/* ===================== */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Actions</p>
            <p className="text-2xl font-bold">{actions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Verified Points</p>
            <p className="text-2xl font-bold">{verifiedPoints}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending Actions</p>
            <p className="text-2xl font-bold">{pendingActions.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* ===================== */}
      {/* PRIMARY CTA */}
      {/* ===================== */}
      <Card>
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h2 className="font-semibold">Log an Environmental Action</h2>
            <p className="text-sm text-muted-foreground">
              Record your climate-positive activities
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Log Action
          </Button>
        </CardContent>
      </Card>

      {/* ===================== */}
      {/* ATTENTION PANEL (PHASE 2) */}
      {/* ===================== */}
      {pendingActions.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold">Actions Needing Attention</h3>
            <p className="text-sm text-muted-foreground">
              {pendingActions.length} action(s) awaiting verification or evidence
            </p>
          </CardContent>
        </Card>
      )}

      {/* ===================== */}
      {/* RECENT ACTIONS */}
      {/* ===================== */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 font-semibold">Recent Actions</h3>
          <div className="space-y-3">
            {actions.map(action => (
              <div
                key={action.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{action.action_type}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(action.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      action.status === 'approved'
                        ? 'default'
                        : action.status === 'pending'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {action.status}
                  </Badge>
                  {action.status === 'pending' && (
                    <Button size="sm" variant="outline">
                      Add Evidence
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
