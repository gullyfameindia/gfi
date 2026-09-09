'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Users, UserCheck, Trophy, PlayCircle, CheckCircle, Heart, Building2, TrendingUp } from 'lucide-react';
import { formatNumber, formatTimeAgo } from '@/lib/utils';
import { getUserRole } from '@/lib/auth';
import { getRecentActivity, getQuickStats, type RecentActivityResponse, type QuickStatsResponse } from '@/lib/dashboardApi';
import { getCompetitions, type Competition } from '@/lib/competitionApi';
import { getStoredAdmin } from '@/lib/authApi';

export default function Dashboard() {
  const [userRole, setUserRole] = useState<'admin' | 'sponsor'>('admin');
  const [isMounted, setIsMounted] = useState(false);
  const [recentActivity, setRecentActivity] = useState<RecentActivityResponse | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStatsResponse | null>(null);
  const [sponsorCompetitions, setSponsorCompetitions] = useState<Competition[]>([]);
  const [sponsorStats, setSponsorStats] = useState({
    totalCompetitions: 0,
    liveCompetitions: 0,
    totalEntries: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const role = getUserRole();
    if (role) {
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const role = getUserRole();
        const isSponsor = role === 'sponsor';

        if (isSponsor) {
          
          const adminData = getStoredAdmin();
          
          const sponsorId = adminData?._id || adminData?.id || adminData?.sponsorCode;
          
          if (process.env.NODE_ENV === 'development') {
            console.log('[Dashboard] Sponsor data:', {
              adminData,
              sponsorId,
              email: adminData?.email,
            });
          }
          
          if (sponsorId) {
            const compResult = await getCompetitions({ sponsorId });
            if (compResult.success && compResult.data) {
              const competitions = compResult.data.items || [];
              setSponsorCompetitions(competitions);
              
              
              const liveComps = competitions.filter((c: Competition) => 
                c.status === 'LIVE' || c.status === 'live'
              );
              const totalEntries = competitions.reduce((sum: number, c: Competition) => 
                sum + (c.entries || (Array.isArray(c.participants) ? c.participants.length : 0) || 0), 0
              );
              
              setSponsorStats({
                totalCompetitions: competitions.length,
                liveCompetitions: liveComps.length,
                totalEntries,
                totalViews: 0, 
              });
            } else {
              console.warn('[Dashboard] Failed to fetch sponsor competitions:', compResult.message);
            }
          } else {
            console.warn('[Dashboard] No sponsor ID found in stored admin data');
          }
        } else {
          
          const [activityResult, statsResult] = await Promise.all([
            getRecentActivity(),
            getQuickStats(),
          ]);

          if (activityResult.success && activityResult.data) {
            setRecentActivity(activityResult.data);
          } else {
            console.error('Failed to fetch recent activity:', activityResult.message);
          }

          if (statsResult.success && statsResult.data) {
            setQuickStats(statsResult.data);
          } else {
            console.error('Failed to fetch quick stats:', statsResult.message);
          }
        }
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (isMounted) {
      fetchDashboardData();
    }
  }, [isMounted]);

  const isSponsor = isMounted && userRole === 'sponsor';

  return (
    <DashboardLayout>
      <div className="space-y-3 md:space-y-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Gully Fame Admin Panel</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {isSponsor 
              ? "Track your competitions and brand performance" 
              : "Welcome back! Here's what's happening today."}
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h2>
            {loading ? (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500">Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-xs text-red-500">{error}</p>
              </div>
            ) : recentActivity ? (
              <div className="space-y-3">
                {recentActivity.newUsers && recentActivity.newUsers.length > 0 && (
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        New user registered: {recentActivity.newUsers[0].email || `${recentActivity.newUsers[0].firstName || ''} ${recentActivity.newUsers[0].lastName || ''}`.trim() || 'Unknown'}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{formatTimeAgo(recentActivity.newUsers[0].createdAt || '')}</p>
                    </div>
                  </div>
                )}
                {recentActivity.contestJoined && recentActivity.contestJoined.length > 0 && (
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div>
                      <p className="text-xs font-medium text-gray-900">Contest joined</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{recentActivity.contestJoined[0].joinedAt ? formatTimeAgo(recentActivity.contestJoined[0].joinedAt) : 'Recently'}</p>
                    </div>
                  </div>
                )}
                {recentActivity.latestCompetitions && recentActivity.latestCompetitions.length > 0 && (
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div>
                      <p className="text-xs font-medium text-gray-900">Latest competition: {recentActivity.latestCompetitions[0].title || 'Untitled'}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{formatTimeAgo(recentActivity.latestCompetitions[0].createdAt || '')}</p>
                    </div>
                  </div>
                )}
                {recentActivity.totalCompleted > 0 && (
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <div>
                      <p className="text-xs font-medium text-gray-900">Competition completed ({recentActivity.totalCompleted})</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">Total completed</p>
                    </div>
                  </div>
                )}
                {recentActivity.newCompetitionHeld && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-900">New competition held: {recentActivity.newCompetitionHeld.title || 'Untitled'}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{formatTimeAgo(recentActivity.newCompetitionHeld.createdAt || '')}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500">No recent activity</p>
              </div>
            )}
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h2>
            {loading ? (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500">Loading...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-xs text-red-500">{error}</p>
              </div>
            ) : quickStats ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Users</span>
                  <span className="text-sm font-bold text-gray-900">{formatNumber(quickStats.totalUsers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Active Competition</span>
                  <span className="text-sm font-bold text-gray-900">{quickStats.activeCompetitions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Reels</span>
                  <span className="text-sm font-bold text-gray-900">{formatNumber(quickStats.totalReels)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Competition</span>
                  <span className="text-sm font-bold text-gray-900">{quickStats.totalCompetitions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Active Sponsors</span>
                  <span className="text-sm font-bold text-gray-900">{quickStats.activeSponsors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Tips Given</span>
                  <span className="text-sm font-bold text-gray-900">{formatNumber(quickStats.tipsGiven)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-gray-500">No stats available</p>
              </div>
            )}
          </div>
        </div>

        {isSponsor ? (
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <div className="col-span-full text-center py-4">
                <p className="text-xs text-gray-500">Loading sponsor stats...</p>
              </div>
            ) : (
              <>
                <StatCard title="My Competitions" value={sponsorStats.totalCompetitions.toString()} icon={Trophy} />
                <StatCard title="Live Competitions" value={sponsorStats.liveCompetitions.toString()} icon={PlayCircle} color="green" />
                <StatCard title="Total Entries" value={formatNumber(sponsorStats.totalEntries)} icon={Users} />
                <StatCard title="Total Views" value={formatNumber(sponsorStats.totalViews)} icon={PlayCircle} color="blue" />
                {sponsorCompetitions.length > 0 && (
                  <>
                    <StatCard 
                      title="Approved Competitions" 
                      value={sponsorCompetitions.filter((c: Competition) => c.status === 'APPROVED').length.toString()} 
                      icon={CheckCircle} 
                      color="green" 
                    />
                    <StatCard 
                      title="Pending Competitions" 
                      value={sponsorCompetitions.filter((c: Competition) => c.status === 'CREATED').length.toString()} 
                      icon={Trophy} 
                      color="yellow" 
                    />
                    <StatCard 
                      title="Completed Competitions" 
                      value={sponsorCompetitions.filter((c: Competition) => c.status === 'COMPLETED').length.toString()} 
                      icon={CheckCircle} 
                      color="gray" 
                    />
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <StatCard title="Top Trending Category" value="Dance" icon={TrendingUp} color="purple" />
            <StatCard title="Top Winner (Week)" value="Dancer Pro" icon={Trophy} color="yellow" />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
