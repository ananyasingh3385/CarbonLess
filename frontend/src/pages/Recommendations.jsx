import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Filter,
  DollarSign,
  Car,
  Zap,
  Salad,
  Trash2,
  Flame,
  Plus,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Recommendations({ setActiveTab }) {
  const { user, showNotification, refreshUser } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [adoptingId, setAdoptingId] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await api.getRecommendations();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleAdopt = async (rec) => {
    if (!user) {
      showNotification('Please log in or use Demo Login to commit to eco actions.', 'error');
      setActiveTab('login');
      return;
    }

    try {
      setAdoptingId(rec.id);
      const res = await api.adoptRecommendation(rec.id);
      showNotification(res.message || `Committed to: ${rec.title}! +25 Eco-Points!`, 'success');
      // Update local state
      setRecommendations((prev) =>
        prev.map((r) => (r.id === rec.id ? { ...r, adopted: true, status: 'active' } : r))
      );
      refreshUser();
    } catch (err) {
      console.error('Failed to adopt recommendation:', err);
      showNotification('Failed to save commitment.', 'error');
    } finally {
      setAdoptingId(null);
    }
  };

  const filteredRecs = recommendations.filter((r) => {
    if (filterCategory === 'all') return true;
    return r.category === filterCategory;
  });

  const totalPossibleSavings = recommendations.reduce((acc, curr) => acc + curr.annual_saving_kg, 0);
  const adoptedSavings = recommendations
    .filter((r) => r.adopted)
    .reduce((acc, curr) => acc + curr.annual_saving_kg, 0);

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'transport':
        return <Car className="w-4 h-4 text-emerald-600" />;
      case 'energy':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'food':
        return <Salad className="w-4 h-4 text-green-600" />;
      case 'waste':
        return <Trash2 className="w-4 h-4 text-teal-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-eco-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart AI Eco Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Personalized Reduction Recommendations
            </h1>
            <p className="text-sm text-emerald-100 max-w-xl leading-relaxed">
              Targeted, high-yield interventions designed to slash your annual carbon emissions while cutting everyday living expenses.
            </p>
          </div>

          {/* Quick Potential Savings Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 sm:min-w-[240px]">
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold block">
              Committed Savings
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {adoptedSavings.toLocaleString()} <span className="text-sm font-normal text-emerald-200">kg CO₂/yr</span>
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-1">
              Out of {totalPossibleSavings.toLocaleString()} kg potential annual savings
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Opportunities' },
            { id: 'transport', label: 'Transportation' },
            { id: 'energy', label: 'Energy & Heating' },
            { id: 'food', label: 'Food Habits' },
            { id: 'waste', label: 'Waste Diversion' },
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
          Showing <strong>{filteredRecs.length}</strong> smart recommendations
        </span>
      </div>

      {/* Recommendations Cards Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-4 border-eco-200 border-t-eco-600 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Analyzing your footprint profile...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecs.map((rec) => {
            const isAdopted = rec.adopted;
            const isHigh = rec.impact_level === 'High';

            return (
              <div
                key={rec.id}
                className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                  isAdopted
                    ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                    : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-eco'
                }`}
              >
                <div>
                  {/* Card Header Pills */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-slate-100 flex items-center justify-center">
                        {getCategoryIcon(rec.category)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {rec.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isHigh
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {rec.impact_level} Impact
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {rec.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {rec.description}
                  </p>

                  {/* Financial & Environmental Metrics Bar */}
                  <div className="grid grid-cols-2 gap-3 mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium uppercase block">
                        CO₂ Reduction
                      </span>
                      <span className="font-extrabold text-emerald-700 text-sm">
                        -{rec.annual_saving_kg} kg/yr
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium uppercase block">
                        Estimated Payback
                      </span>
                      <span className="font-semibold text-slate-700 text-xs">
                        {rec.payback}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Difficulty: <strong>{rec.difficulty}</strong>
                  </span>

                  {isAdopted ? (
                    <button
                      disabled
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300"
                    >
                      <Check className="w-4 h-4 text-emerald-700" />
                      Active Commitment
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAdopt(rec)}
                      disabled={adoptingId === rec.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-eco-600 hover:bg-eco-700 shadow-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      {adoptingId === rec.id ? 'Saving...' : 'Commit to Action (+25 Pts)'}
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
