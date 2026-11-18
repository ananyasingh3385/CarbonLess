import React, { useState, useEffect } from 'react';
import {
  Award,
  Trophy,
  Sparkles,
  Flame,
  Medal,
  CheckCircle2,
  Lock,
  Compass,
  Bike,
  Zap,
  Leaf,
  Recycle,
  Shield,
  Crown,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RewardsLeaderboard() {
  const { user } = useAuth();
  const [badgesData, setBadgesData] = useState({ badges: [], unlocked_count: 0, total_count: 0 });
  const [leaderboardData, setLeaderboardData] = useState({ leaderboard: [], user_rank: null });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('badges'); // 'badges' | 'leaderboard'

  useEffect(() => {
    async function loadRewards() {
      try {
        setLoading(true);
        const [bRes, lRes] = await Promise.all([
          api.getBadges(),
          api.getLeaderboard(),
        ]);
        setBadgesData(bRes);
        setLeaderboardData(lRes);
      } catch (err) {
        console.error('Failed to load rewards data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRewards();
  }, []);

  const getBadgeIcon = (iconName, isUnlocked) => {
    const className = `w-7 h-7 ${isUnlocked ? 'text-amber-500' : 'text-slate-400'}`;
    switch (iconName) {
      case 'Compass':
        return <Compass className={className} />;
      case 'Bike':
        return <Bike className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Leaf':
        return <Leaf className={className} />;
      case 'Recycle':
        return <Recycle className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Bronze':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Silver':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Emerald':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Eco Recognition &amp; Hall of Fame</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Eco-Points, Badges &amp; Leaderboard
            </h1>
            <p className="text-sm text-emerald-100 max-w-xl leading-relaxed">
              Earn recognition for your emissions reductions. Complete calculations, stick to challenges, unlock rare badges, and rise through the community ranks.
            </p>
          </div>

          {/* User Scorecard Pill */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 self-start md:self-auto">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-slate-900 flex items-center justify-center font-black text-xl shadow-md">
              <Sparkles className="w-6 h-6 text-amber-900 fill-amber-700" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">
                Your Eco Balance
              </span>
              <div className="text-2xl font-black text-white">
                {user?.points || 0} <span className="text-xs font-normal text-emerald-200">pts</span>
              </div>
              <div className="text-[11px] text-emerald-100/90 flex items-center gap-2 mt-0.5">
                <span>{badgesData.unlocked_count} of {badgesData.total_count} Badges</span>
                <span>&bull;</span>
                <span>Rank #{leaderboardData.user_rank || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Tabs (Badges vs Leaderboard) */}
      <div className="flex border-b border-slate-200 gap-8">
        <button
          onClick={() => setActiveTab('badges')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative ${
            activeTab === 'badges'
              ? 'text-eco-700 border-b-2 border-eco-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          Achievement Badges ({badgesData.unlocked_count}/{badgesData.total_count})
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all relative ${
            activeTab === 'leaderboard'
              ? 'text-eco-700 border-b-2 border-eco-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Community Leaderboard
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-4 border-eco-200 border-t-eco-600 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Loading rewards data...</p>
        </div>
      ) : activeTab === 'badges' ? (
        /* BADGES GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {badgesData.badges.map((b) => {
            const isUnlocked = b.is_unlocked;

            return (
              <div
                key={b.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-eco'
                    : 'bg-slate-50/70 border-slate-200 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getTierColor(
                        b.tier
                      )}`}
                    >
                      {b.tier}
                    </span>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3 text-slate-400" /> Locked
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-100 to-amber-50 border border-amber-200'
                          : 'bg-slate-200/80 border border-slate-300 text-slate-400'
                      }`}
                    >
                      {getBadgeIcon(b.icon, isUnlocked)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{b.name}</h3>
                      <span className="text-[10px] text-slate-400 font-medium uppercase">
                        {b.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {b.description}
                  </p>
                </div>

                {/* Progress bar towards requirement */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                    <span>Target: {b.points_required} pts</span>
                    <span>{b.progress_pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-amber-500' : 'bg-eco-500'
                      }`}
                      style={{ width: `${b.progress_pct}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LEADERBOARD VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Global Eco-Warrior Rankings
              </h3>
              <p className="text-xs text-slate-500">
                Top participants ranked by accumulated Eco-Points and verified CO₂ emissions avoided.
              </p>
            </div>
            {leaderboardData.user_rank && (
              <div className="text-xs font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                Your Global Position: #{leaderboardData.user_rank}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-6">Participant</th>
                  <th className="py-3.5 px-6">Eco-Points</th>
                  <th className="py-3.5 px-6">Habit Streak</th>
                  <th className="py-3.5 px-6">CO₂ Avoided</th>
                  <th className="py-3.5 px-6 text-right">Badge Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {leaderboardData.leaderboard.map((item) => {
                  const isUser = item.is_current_user;
                  const isTop3 = item.rank <= 3;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isUser
                          ? 'bg-emerald-50/70 font-semibold text-emerald-950'
                          : 'hover:bg-slate-50/80 text-slate-700'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-2">
                          {item.rank === 1 && (
                            <div className="w-7 h-7 rounded-full bg-amber-400 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              🥇
                            </div>
                          )}
                          {item.rank === 2 && (
                            <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 flex items-center justify-center font-bold text-xs shadow-xs">
                              🥈
                            </div>
                          )}
                          {item.rank === 3 && (
                            <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                              🥉
                            </div>
                          )}
                          {item.rank > 3 && (
                            <span className="w-7 text-center font-bold text-slate-500">
                              #{item.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Participant */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-eco-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                            {item.name ? item.name.charAt(0) : 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {item.name} {isUser && '(You)'}
                            </span>
                            <span className="text-[10px] text-slate-400">Verified Citizen</span>
                          </div>
                        </div>
                      </td>

                      {/* Eco-Points */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-1.5 font-extrabold text-slate-900">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          {item.points.toLocaleString()}
                        </div>
                      </td>

                      {/* Streak */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-1 text-rose-600 font-bold">
                          <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                          {item.streak_days} days
                        </div>
                      </td>

                      {/* Total CO2 avoided */}
                      <td className="py-3.5 px-6">
                        <span className="font-bold text-emerald-700">
                          {item.total_co2_saved} kg
                        </span>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3.5 px-6 text-right">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            item.points >= 1000
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : item.points >= 500
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                              : item.points >= 250
                              ? 'bg-slate-100 text-slate-800 border-slate-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300'
                          }`}
                        >
                          {item.points >= 1000
                            ? 'Emerald'
                            : item.points >= 500
                            ? 'Gold'
                            : item.points >= 250
                            ? 'Silver'
                            : 'Bronze'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
