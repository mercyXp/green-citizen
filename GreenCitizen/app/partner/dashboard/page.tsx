'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader } from '@/app/components/ui/card';
import { Loader2, BarChart3, Map, Users, Leaf, TrendingUp, Download } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface ActionByType {
  action_type: string;
  total_actions: number;
  verified_actions: number;
  champion_actions: number;
  total_points: number;
  verification_rate: number;
}

interface ActionByDistrict {
  district: string;
  total_actions: number;
  verified_actions: number;
  champion_actions: number;
  total_points: number;
  unique_citizens: number;
  verification_rate: number;
}

interface UserEngagement {
  id: string;
  username: string;
  display_name: string | null;
  district: string;
  total_actions_logged: number;
  verified_actions: number;
  total_points: number;
  last_action_date: string | null;
  days_since_last_action: number | null;
}

interface ActionSummary {
  pending_count: number;
  verified_count: number;
  champion_count: number;
  total_points: number;
  verification_rate: number;
}

export default function PartnerDashboardPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [byType, setByType] = useState<ActionByType[]>([]);
  const [byDistrict, setByDistrict] = useState<ActionByDistrict[]>([]);
  const [engagement, setEngagement] = useState<UserEngagement[]>([]);
  const [summary, setSummary] = useState<ActionSummary | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check user role
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', userData.user.id)
        .single();

      const role = (userProfile as any)?.role;
      setUserRole(role);

      if (role !== 'partner' && role !== 'admin') {
        setError('You do not have access to this dashboard');
        setLoading(false);
        return;
      }

      // Fetch all analytics in parallel
      const [typeRes, districtRes, engagementRes, summaryRes] = await Promise.all([
        supabase.from('analytics_actions_by_type').select('*'),
        supabase.from('analytics_actions_by_district').select('*'),
        supabase.from('analytics_user_engagement').select('*').limit(15),
        supabase.rpc('get_actions_summary'),
      ]);

      if (typeRes.error) throw typeRes.error;
      if (districtRes.error) throw districtRes.error;
      if (engagementRes.error) throw engagementRes.error;
      if (summaryRes.error) throw summaryRes.error;

      setByType((typeRes.data as ActionByType[]) || []);
      setByDistrict((districtRes.data as ActionByDistrict[]) || []);
      setEngagement((engagementRes.data as UserEngagement[]) || []);
      setSummary((summaryRes.data?.[0] as ActionSummary) || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      summary,
      byType,
      byDistrict,
      topEngagement: engagement.slice(0, 10),
    };

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2))
    );
    element.setAttribute('download', `greencitizen-impact-report-${new Date().getTime()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary p-4">
        <Card className="w-full max-w-md border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <CardContent className="p-6">
            <p className="text-sm font-semibold text-red-800 dark:text-red-200">Access Denied</p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-2">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalVerified = summary?.verified_count ?? 0;
  const totalActions = (summary?.pending_count ?? 0) + totalVerified + (summary?.champion_count ?? 0);
  const verificationRate = summary?.verification_rate ?? 0;

  return (
    <div className="min-h-screen space-y-6 bg-bg-primary p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-primary sm:text-3xl">
              Partner Impact Dashboard
            </h1>
            <p className="text-xs text-secondary sm:text-sm">Real-time impact metrics & analytics</p>
          </div>
        </div>
        <Button 
          onClick={downloadReport} 
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Stat 
            title="Pending Verification" 
            value={summary.pending_count} 
            icon={<Loader2 className="h-4 w-4 text-orange-500" />}
          />
          <Stat 
            title="Verified Actions" 
            value={summary.verified_count} 
            icon={<TrendingUp className="h-4 w-4 text-green-500" />}
          />
          <Stat 
            title="Champions" 
            value={summary.champion_count} 
            icon={<Leaf className="h-4 w-4 text-primary" />}
          />
          <Stat 
            title="Impact Points" 
            value={summary.total_points} 
            highlight
            icon={<BarChart3 className="h-4 w-4 text-secondary" />}
          />
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <MetricCard 
          title="Verification Rate" 
          value={`${verificationRate.toFixed(1)}%`}
          subtitle="Quality assurance"
        />
        <MetricCard 
          title="Total Actions" 
          value={totalActions}
          subtitle="All-time impact"
        />
        <MetricCard 
          title="Active Citizens" 
          value={engagement.length}
          subtitle="Engaged users"
          className="hidden sm:block"
        />
      </div>

      {/* Actions by Type */}
      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Leaf className="h-5 w-5" />
            Impact by Action Type
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {byType.length === 0 ? (
            <p className="text-sm text-secondary">No data available</p>
          ) : (
            byType.map((row) => (
              <div key={row.action_type} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize text-primary">
                    {row.action_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-semibold text-secondary">
                    {row.total_points} pts
                  </span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="text-tertiary">✓ {row.verified_actions}</span>
                  <span className="text-tertiary">★ {row.champion_actions}</span>
                  <span className="text-tertiary ml-auto">{row.verification_rate.toFixed(0)}% verified</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* District Impact */}
      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Map className="h-5 w-5" />
            Geographic Impact
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {byDistrict.length === 0 ? (
            <p className="text-sm text-secondary">No data available</p>
          ) : (
            byDistrict.map((row) => (
              <div key={row.district} className="space-y-1 border-b border-border-primary pb-3 last:border-b-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">{row.district}</span>
                  <span className="text-xs font-semibold text-secondary">{row.total_points} pts</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-tertiary">
                  <span>{row.unique_citizens} citizens</span>
                  <span>•</span>
                  <span>{row.total_actions} actions</span>
                  <span>•</span>
                  <span>{row.verification_rate.toFixed(0)}% verified</span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Top Engaged Citizens */}
      <Card>
        <CardHeader>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-primary">
            <Users className="h-5 w-5" />
            Top Engaged Citizens
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {engagement.length === 0 ? (
            <p className="text-sm text-secondary">No citizen data available</p>
          ) : (
            engagement.map((user, idx) => (
              <div key={user.id} className="flex items-center justify-between border-b border-border-primary pb-3 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-secondary w-5">#{idx + 1}</span>
                    <div>
                      <p className="text-sm font-semibold text-primary truncate">
                        {user.display_name ?? user.username}
                      </p>
                      <p className="text-xs text-tertiary">{user.district}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{user.total_points}</p>
                  <p className="text-xs text-secondary">{user.verified_actions} verified</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="text-center text-xs text-tertiary">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}

interface StatProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

function Stat({ title, value, icon, highlight }: StatProps) {
  return (
    <Card className={highlight ? 'bg-primary/10 border-primary/20' : ''}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium text-secondary">{title}</p>
          {icon}
        </div>
        <p className={`text-lg font-bold sm:text-xl ${highlight ? 'text-primary' : 'text-primary'}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  className?: string;
}

function MetricCard({ title, value, subtitle, className = '' }: MetricCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <p className="text-xs font-semibold text-secondary uppercase">{title}</p>
        <p className="text-2xl font-bold text-primary mt-1">{value}</p>
        <p className="text-xs text-tertiary mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}