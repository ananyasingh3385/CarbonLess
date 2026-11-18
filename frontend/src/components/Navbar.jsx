import React, { useState } from 'react';
import {
  Leaf,
  BarChart3,
  Calculator,
  Lightbulb,
  CheckSquare,
  Award,
  FileText,
  User,
  LogOut,
  Flame,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'challenges', label: 'Challenges', icon: CheckSquare },
    { id: 'rewards', label: 'Rewards & Leaderboard', icon: Award },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-eco-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-eco-600 to-eco-400 flex items-center justify-center text-white shadow-md shadow-eco-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-eco-700 transition-colors">
                  Carbon<span className="text-eco-600">Less</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-eco-100 text-eco-800 px-2 py-0.5 rounded-full border border-eco-200">
                  Eco App
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Track Impact &bull; Reduce Carbon &bull; Save Earth
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-eco-50 text-eco-800 font-semibold shadow-xs border border-eco-200/60'
                      : 'text-slate-600 hover:text-eco-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-eco-600' : 'text-slate-400 group-hover:text-eco-500'
                    }`}
                  />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <>
                {/* Eco Points Chip */}
                <div
                  title="Your Eco-Points balance"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full shadow-xs text-xs font-semibold text-slate-800"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>{user.points || 0}</span>
                  <span className="text-[11px] text-emerald-700 font-normal">pts</span>
                </div>

                {/* Streak Counter */}
                <div
                  title="Daily Eco Habit Streak"
                  className="flex items-center gap-1.5 bg-rose-50 border border-rose-200/80 px-3 py-1.5 rounded-full shadow-xs text-xs font-semibold text-rose-700"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                  <span>{user.streak_days || 1}d</span>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-eco-300 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-eco-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="text-xs font-medium text-slate-700 max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          handleNavClick('profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-eco-50 hover:text-eco-800 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        My Profile & Targets
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={demoLogin}
                  className="px-3 py-1.5 text-xs font-semibold text-eco-700 bg-eco-50 hover:bg-eco-100 rounded-lg border border-eco-200 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  Quick Demo Login
                </button>
                <button
                  onClick={() => handleNavClick('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-eco-700"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-eco-600 hover:bg-eco-700 rounded-lg shadow-sm transition-all"
                >
                  Join Free
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-full text-xs font-semibold text-slate-800">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                <span>{user.points}</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-eco-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-eco-100 px-4 pt-2 pb-5 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-eco-50 text-eco-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-eco-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick('profile')}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profile ({user.name})
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full py-2 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="w-full py-2 text-center text-xs font-semibold text-white bg-eco-600 rounded-lg"
                >
                  Sign Up
                </button>
                <button
                  onClick={demoLogin}
                  className="col-span-2 py-2 text-center text-xs font-semibold text-eco-800 bg-eco-100 rounded-lg"
                >
                  ⚡ One-Click Demo Mode
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
