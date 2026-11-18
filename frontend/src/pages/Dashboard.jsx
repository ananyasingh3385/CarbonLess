import React, { useState, useEffect } from 'react';
import {
  Leaf,
  TrendingDown,
  Calendar,
  Flame,
  Award,
  Trees,
  Car,
  Zap,
  Salad,
  Trash2,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ setActiveTab }) {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDays, setSelectedDays] = useState(30);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [sumData, trendData] = await Promise.all([
        api.getDashboardSummary(),
        api.getDashboardTrends(selectedDays),
      ]);
      setSummary(sumData);
      setTrends(trendData.trends || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDays]);

  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7'];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-eco-200 border-t-eco-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500">Loading your live carbon metrics...</p>
      </div>
    );
  }

  const metrics = summary?.metrics || {
    total_annual_kg: 3970,
    monthly_footprint_kg: 330.8,
    daily_footprint_kg: 10.87,
    carbon_savings_kg: 48.6,
    trees_offset_equivalent: 26.5,
    reduction_vs_benchmark_pct: 17.3,
    eco_points: user?.points || 580,
    streak_days: user?.streak_days || 12,
    target_reduction_pct: 30,
    rating: { grade: 'A', label: 'Planet Protector', color: '#059669', desc: 'Well below global benchmark!' },
  };

  const categoryData = summary?.category_distribution || [
    { name: 'Transportation', value: 1650, color: '#059669', icon: 'Car' },
    { name: 'Electricity & Energy', value: 820, color: '#10b981', icon: 'Zap' },
    { name: 'Food Habits', value: 1380, color: '#34d399', icon: 'Salad' },
    { name: 'Waste Generation', value: 120, color: '#6ee7b7', icon: 'Trash2' },
  ];

  const totalCatVal = categoryData.reduce((acc, curr) => acc + curr.value, 0) || 1;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Welcome & Quick Eco Rating Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-eco-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-eco-900/10 relative overflow-hidden">
        {/* Subtle background geometric rings */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none"></div>
        <div className="absolute right-40 -top-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-900/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Real-Time Environmental Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user ? user.name : 'Eco Champion'}! 👋
            </h1>
            <p className="text-sm text-emerald-100 max-w-xl leading-relaxed">
              You are actively monitoring your carbon impact. Every bicycle ride, meatless meal, and unplugged charger helps heal our planet.
            </p>
          </div>

          {/* Eco Grade Badge Pill */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 self-start md:self-auto">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-inner"
              style={{ backgroundColor: metrics.rating?.color || '#059669' }}
            >
              {metrics.rating?.grade || 'A'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
                  Climate Status
                </span>
              </div>
              <p className="text-base font-bold text-white">{metrics.rating?.label || 'Planet Protector'}</p>
              <p className="text-[11px] text-emerald-100/90">{metrics.rating?.desc}</p>
            </div>
          </div>
        </div>

        {/* Target Progress Bar */}
        <div className="relative z-10 mt-6 pt-6 border-t border-emerald-600/40">
          <div className="flex justify-between items-center text-xs font-medium text-emerald-100 mb-2">
            <span className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-300" />
              Annual Reduction Target: <strong className="text-white">{metrics.target_reduction_pct}%</strong>
            </span>
            <span className="text-emerald-200 font-bold">
              Progress: 21.4% / {metrics.target_reduction_pct}%
            </span>
          </div>
          <div className="w-full h-3 bg-emerald-950/40 rounded-full overflow-hidden p-0.5 border border-emerald-500/30">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-emerald-300 to-white rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(100, (21.4 / metrics.target_reduction_pct) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Annual Footprint */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-eco transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Footprint
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {(metrics.total_annual_kg / 1000).toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-slate-500">tonnes/yr</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              ≈ <strong>{metrics.total_annual_kg.toLocaleString()}</strong> kg CO₂e / year
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-medium">
              {metrics.reduction_vs_benchmark_pct > 0
                ? `${metrics.reduction_vs_benchmark_pct}% below global avg`
                : `${Math.abs(metrics.reduction_vs_benchmark_pct)}% above global avg`}
            </span>
            <span className="text-slate-400">Avg: 4.8t</span>
          </div>
        </div>

        {/* Daily & Monthly Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-eco transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Daily & Monthly
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-slate-900">
                {metrics.daily_footprint_kg}
              </span>
              <span className="text-sm font-semibold text-slate-500">kg/day</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monthly rate: <strong>{metrics.monthly_footprint_kg}</strong> kg/mo
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-blue-700 font-medium">Paris target: ~5.5 kg/day</span>
            <button
              onClick={() => setActiveTab('calculator')}
              className="text-eco-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              Update <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Carbon Savings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-eco transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Carbon Avoided
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-emerald-600">
                +{metrics.carbon_savings_kg}
              </span>
              <span className="text-sm font-semibold text-slate-500">kg CO₂</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Saved through eco challenges &amp; choices
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-amber-700 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {metrics.streak_days} day streak
            </span>
            <button
              onClick={() => setActiveTab('challenges')}
              className="text-eco-600 font-semibold hover:underline"
            >
              Join More
            </button>
          </div>
        </div>

        {/* Tree Offset Equivalent */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-eco transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tree Equivalence
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Trees className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-teal-700">
                {metrics.trees_offset_equivalent}
              </span>
              <span className="text-sm font-semibold text-slate-500">trees/mo</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Equivalent tree carbon absorption capacity
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-teal-700 font-medium">1 mature tree ≈ 22kg/yr</span>
            <span className="text-slate-400">EPA metric</span>
          </div>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 30-Day Emission & Savings Trend Area Chart (Span 2) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Daily Emissions &amp; Carbon Savings Trend
              </h3>
              <p className="text-xs text-slate-500">
                Historical daily footprints vs active eco reductions (kg CO₂e)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedDays}
                onChange={(e) => setSelectedDays(Number(e.target.value))}
                className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-eco-500"
              >
                <option value={7}>Last 7 Days</option>
                <option value={14}>Last 14 Days</option>
                <option value={30}>Last 30 Days</option>
              </select>
              <button
                onClick={fetchDashboardData}
                disabled={refreshing}
                title="Refresh live data"
                className="p-1.5 text-slate-500 hover:text-eco-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                  formatter={(value, name) => [
                    `${value} kg CO₂`,
                    name === 'total' ? 'Emissions' : 'Savings',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="total"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  name="savings"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-600">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-eco-600 inline-block"></span>
              Daily Emissions (kg CO₂)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              Eco Savings Avoided (kg CO₂)
            </span>
          </div>
        </div>

        {/* Category Breakdown Donut Chart (Span 1) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Emissions by Pillar</h3>
            <p className="text-xs text-slate-500 mb-2">Annual percentage distribution</p>
          </div>

          <div className="h-52 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} kg/yr`, 'Emissions']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] text-slate-400 font-medium uppercase">Total</span>
              <span className="text-base font-extrabold text-slate-800">
                {(metrics.total_annual_kg / 1000).toFixed(1)}t
              </span>
            </div>
          </div>

          {/* Category detail list */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {categoryData.map((cat, idx) => {
              const pct = Math.round((cat.value / totalCatVal) * 100);
              return (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    ></span>
                    <span className="text-slate-600 truncate max-w-[130px]">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{cat.value} kg</span>
                    <span className="text-slate-400 text-[11px] w-8 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Interactive Eco Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Recalculate Card */}
        <div
          onClick={() => setActiveTab('calculator')}
          className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border border-emerald-200/80 cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
            Refine Footprint
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Update your transport, electricity, dietary habits, or waste metrics for fine-tuned calculation.
          </p>
        </div>

        {/* Personalized Recommendations Card */}
        <div
          onClick={() => setActiveTab('recommendations')}
          className="bg-gradient-to-br from-amber-50/60 to-white p-5 rounded-2xl border border-amber-200/80 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <h4 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
            Smart Recommendations
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            See personalized high-impact suggestions tailored to your biggest emission categories.
          </p>
        </div>

        {/* Daily Challenges Card */}
        <div
          onClick={() => setActiveTab('challenges')}
          className="bg-gradient-to-br from-teal-50/60 to-white p-5 rounded-2xl border border-teal-200/80 cursor-pointer hover:border-teal-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <h4 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
            Daily Eco Challenges
          </h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Complete daily missions like cycling and zero-waste cooking to earn points and climb ranks.
          </p>
        </div>
      </div>
    </div>
  );
}
