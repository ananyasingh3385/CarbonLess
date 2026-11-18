import React from 'react';
import { Leaf, ShieldCheck, Heart, Globe, Sparkles, ExternalLink } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-eco-500 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Carbon<span className="text-eco-400">Less</span>
              </span>
            </div>
            
            <p className="text-sm font-medium text-eco-300 italic">
              "Track Your Impact. Reduce Your Carbon. Save Our Planet."
            </p>
            
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              CarbonLess empowers individuals, households, and communities to track their carbon footprint across transportation, energy, nutrition, and waste with scientifically verified emission factors, real-time analytics, and actionable eco challenges.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1.5 text-eco-400">
                <ShieldCheck className="w-4 h-4" /> IPCC &amp; EPA Methodology
              </span>
              <span className="inline-flex items-center gap-1.5 text-eco-400">
                <Globe className="w-4 h-4" /> Paris 1.5°C Alignment
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="hover:text-eco-400 transition-colors"
                >
                  Live Carbon Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="hover:text-eco-400 transition-colors"
                >
                  Scientific Footprint Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className="hover:text-eco-400 transition-colors"
                >
                  Smart Reduction Recommendations
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('challenges')}
                  className="hover:text-eco-400 transition-colors"
                >
                  Daily Eco Challenges &amp; Streaks
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className="hover:text-eco-400 transition-colors"
                >
                  Badges &amp; Leaderboards
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="hover:text-eco-400 transition-colors"
                >
                  Weekly &amp; Monthly Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Scientific Standards & Credits */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Scientific Standards
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Calculations utilize verified emission coefficients from DEFRA GHG Conversion Factors, US EPA Greenhouse Gas Equivalencies, and IPCC Sixth Assessment Reports.
            </p>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
              <p className="text-[11px] text-eco-300 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Eco Target: 2.0 Tonnes/Yr
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Target per capita emissions under the Paris Climate Accord.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CarbonLess. Open Sustainability Initiative.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Planet Earth
            </span>
            <span className="bg-eco-900/40 text-eco-400 border border-eco-800/60 px-2.5 py-0.5 rounded-full font-mono text-[10px]">
              100% Green Hosted
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
