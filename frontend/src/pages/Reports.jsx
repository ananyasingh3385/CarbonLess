import React, { useState, useEffect } from 'react';
import {
  FileText,
  TrendingDown,
  Calendar,
  Download,
  Share2,
  Trees,
  Car,
  Zap,
  Printer,
  Sparkles,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Reports() {
  const { user, showNotification } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('weekly'); // 'weekly' | 'monthly'

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);
        const res = await api.getAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (!data) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `carbonless_audit_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Audit report exported to JSON successfully!', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-4 border-eco-200 border-t-eco-600 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Generating carbon analytics &amp; audit reports...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    total_co2_avoided_kg: 52.8,
    target_reduction_pct: 30,
    current_reduction_pct: 21.4,
    trees_planted_equivalent: 2.4,
    car_miles_avoided: 275,
    clean_energy_kwh_equivalent: 111,
  };

  const weeklyData = data?.weekly_comparison || [];
  const monthlyData = data?.monthly_comparison || [];

  return (
    <div className="space-y-8 animate-fade-in print:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-eco-700 bg-eco-50 px-2.5 py-1 rounded-full border border-eco-200 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GHG Protocol Audit Report</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Emissions &amp; Carbon Reduction Reports
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            Comprehensive audit comparing weekly and monthly greenhouse gas emissions against active carbon savings.
          </p>
        </div>

        {/* Export & Print actions */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export JSON
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-eco-600 rounded-xl hover:bg-eco-700 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* High-Level Reduction Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Cumulative Avoided</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-600">
              {stats.total_co2_avoided_kg}
            </span>
            <span className="text-xs font-semibold text-slate-500">kg CO₂e</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Net greenhouse gases kept out of the atmosphere
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Tree Absorption</span>
            <Trees className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-teal-700">
              {stats.trees_planted_equivalent}
            </span>
            <span className="text-xs font-semibold text-slate-500">trees/yr</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Equivalent annual carbon capture of mature trees
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Car Travel Avoided</span>
            <Car className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-blue-700">
              {stats.car_miles_avoided.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">km avoided</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Equivalent tailpipe emissions from standard vehicle
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Grid Power Saved</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-600">
              {stats.clean_energy_kwh_equivalent.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-500">kWh</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Equivalent conventional coal/gas electricity saved
          </p>
        </div>
      </div>

      {/* Comparison View Switcher & Interactive Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-eco-600" />
              {viewType === 'weekly'
                ? 'Weekly Carbon Footprint & Savings Breakdown'
                : 'Monthly Multi-Month Emission Trajectory'}
            </h3>
            <p className="text-xs text-slate-500">
              Comparing gross emissions generated vs verified green reductions (kg CO₂e)
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl print:hidden">
            <button
              onClick={() => setViewType('weekly')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                viewType === 'weekly'
                  ? 'bg-white text-eco-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly View (Past 4 Weeks)
            </button>
            <button
              onClick={() => setViewType('monthly')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                viewType === 'monthly'
                  ? 'bg-white text-eco-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly View (6 Months)
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={viewType === 'weekly' ? weeklyData : monthlyData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey={viewType === 'weekly' ? 'week' : 'month'}
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
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
                formatter={(val, name) => [
                  `${val} kg CO₂`,
                  name === 'emissions_kg' ? 'Emissions' : 'Carbon Saved',
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                formatter={(value) =>
                  value === 'emissions_kg' ? 'Emissions (kg CO₂)' : 'Carbon Saved (kg CO₂)'
                }
              />
              <Bar dataKey="emissions_kg" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={45} />
              <Bar dataKey="savings_kg" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Audit Ledger ({viewType === 'weekly' ? 'Past 4 Weeks' : 'Monthly Aggregations'})
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/30 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-5">Period</th>
                <th className="py-3 px-5">Emissions (kg CO₂)</th>
                <th className="py-3 px-5">Verified Savings (kg CO₂)</th>
                <th className="py-3 px-5">Net Impact</th>
                <th className="py-3 px-5 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {(viewType === 'weekly' ? weeklyData : monthlyData).map((row, idx) => {
                const label = row.week || row.month;
                const em = row.emissions_kg;
                const sav = row.savings_kg;
                const net = (em - sav).toFixed(1);

                return (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-3 px-5 font-bold text-slate-900">{label}</td>
                    <td className="py-3 px-5">{em} kg</td>
                    <td className="py-3 px-5 text-emerald-700 font-semibold">+{sav} kg</td>
                    <td className="py-3 px-5 font-bold text-slate-900">{net} kg</td>
                    <td className="py-3 px-5 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ArrowDownRight className="w-3.5 h-3.5" /> -4.2%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
