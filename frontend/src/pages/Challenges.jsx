import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  Award,
  Bike,
  Bus,
  Salad,
  Apple,
  ZapOff,
  Thermometer,
  ShoppingBag,
  Recycle,
  Droplets,
  Trees,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Challenges({ setActiveTab }) {
  const { user, showNotification, refreshUser } = useAuth();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const data = await api.getChallenges();
      setChallenges(data.challenges || []);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleJoin = async (id, title) => {
    if (!user) {
      showNotification('Please log in or use Demo Login to join eco challenges.', 'error');
      setActiveTab('login');
      return;
    }

    try {
      setActionLoading(id);
      const res = await api.joinChallenge(id);
      showNotification(res.message || `Joined challenge: "${title}"!`, 'info');
      // Update local status
      setChallenges((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'in_progress' } : c))
      );
    } catch (err) {
      console.error('Error joining challenge:', err);
      showNotification('Could not join challenge.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id, title) => {
    if (!user) {
      showNotification('Please log in first.', 'error');
      setActiveTab('login');
      return;
    }

    try {
      setActionLoading(id);
      const res = await api.completeChallenge(id);
      showNotification(
        res.message || `Challenge Completed! +${res.points_earned} Eco-Points earned! 🌿`,
        'success'
      );
      if (res.new_badges && res.new_badges.length > 0) {
        setTimeout(() => {
          showNotification(`New Badge Unlocked: ${res.new_badges.join(', ')}! 🏅`, 'success');
        }, 1500);
      }
      setChallenges((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: 'completed' } : c))
      );
      refreshUser();
    } catch (err) {
      console.error('Error completing challenge:', err);
      showNotification('Could not complete challenge.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const getIcon = (iconName) => {
    const props = { className: 'w-5 h-5' };
    switch (iconName) {
      case 'Bike':
        return <Bike {...props} className="w-5 h-5 text-emerald-600" />;
      case 'Bus':
        return <Bus {...props} className="w-5 h-5 text-blue-600" />;
      case 'Salad':
        return <Salad {...props} className="w-5 h-5 text-green-600" />;
      case 'Apple':
        return <Apple {...props} className="w-5 h-5 text-rose-600" />;
      case 'ZapOff':
        return <ZapOff {...props} className="w-5 h-5 text-amber-500" />;
      case 'Thermometer':
        return <Thermometer {...props} className="w-5 h-5 text-orange-500" />;
      case 'ShoppingBag':
        return <ShoppingBag {...props} className="w-5 h-5 text-teal-600" />;
      case 'Recycle':
        return <Recycle {...props} className="w-5 h-5 text-emerald-500" />;
      case 'Droplets':
        return <Droplets {...props} className="w-5 h-5 text-sky-500" />;
      case 'Trees':
        return <Trees {...props} className="w-5 h-5 text-emerald-700" />;
      default:
        return <CheckSquare {...props} className="w-5 h-5 text-eco-600" />;
    }
  };

  const filteredChallenges = challenges.filter((c) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'in_progress') return c.status === 'in_progress';
    if (filterCategory === 'completed') return c.status === 'completed';
    return c.category === filterCategory;
  });

  const completedCount = challenges.filter((c) => c.status === 'completed').length;
  const inProgressCount = challenges.filter((c) => c.status === 'in_progress').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Gamified Micro-Actions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Eco Action Challenges
            </h1>
            <p className="text-sm text-emerald-100 max-w-xl leading-relaxed">
              Build daily low-carbon habits. Complete challenges like cycling, conserving power, avoiding single-use plastics, and diverting food waste to boost your streak and earn eco-points!
            </p>
          </div>

          {/* Stats Widget */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="text-center px-3 border-r border-white/20">
              <span className="text-[10px] uppercase font-bold text-emerald-200">Streak</span>
              <div className="text-xl font-extrabold text-white flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
                {user?.streak_days || 1}d
              </div>
            </div>
            <div className="text-center px-3 border-r border-white/20">
              <span className="text-[10px] uppercase font-bold text-emerald-200">Active</span>
              <div className="text-xl font-extrabold text-white">{inProgressCount}</div>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-bold text-emerald-200">Done</span>
              <div className="text-xl font-extrabold text-emerald-300">{completedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Challenges' },
            { id: 'in_progress', label: `In Progress (${inProgressCount})` },
            { id: 'completed', label: `Completed (${completedCount})` },
            { id: 'transport', label: 'Transport' },
            { id: 'energy', label: 'Energy' },
            { id: 'food', label: 'Food' },
            { id: 'waste', label: 'Waste' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                filterCategory === tab.id
                  ? 'bg-eco-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredChallenges.length}</strong> missions
        </span>
      </div>

      {/* Challenges List Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-4 border-eco-200 border-t-eco-600 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Loading challenges...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredChallenges.map((ch) => {
            const isCompleted = ch.status === 'completed';
            const isInProgress = ch.status === 'in_progress';

            return (
              <div
                key={ch.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                    : isInProgress
                    ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                    : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-eco'
                }`}
              >
                <div>
                  {/* Category Pill & Points Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-xs">
                        {getIcon(ch.icon)}
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {ch.category} &bull; {ch.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                      +{ch.points} pts
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {ch.description}
                  </p>

                  {/* CO2 Impact & Difficulty */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-[11px]">
                    <span className="font-semibold text-emerald-700">
                      Saves ~<strong>{ch.co2_saved_kg} kg CO₂</strong>
                    </span>
                    <span className="text-slate-400">
                      Difficulty: <strong>{ch.difficulty}</strong>
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {isCompleted ? (
                    <div className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-100/70 rounded-xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Completed &bull; +{ch.points} Pts Earned
                    </div>
                  ) : isInProgress ? (
                    <button
                      onClick={() => handleComplete(ch.id, ch.title)}
                      disabled={actionLoading === ch.id}
                      className="w-full py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {actionLoading === ch.id ? 'Submitting...' : 'Mark Complete & Claim Points'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(ch.id, ch.title)}
                      disabled={actionLoading === ch.id}
                      className="w-full py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-eco-50 hover:text-eco-800 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {actionLoading === ch.id ? 'Joining...' : 'Accept Challenge'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
