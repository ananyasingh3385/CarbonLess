import React, { useState } from 'react';
import {
  User,
  Target,
  Sparkles,
  Flame,
  Award,
  Save,
  LogOut,
  Calendar,
  ShieldCheck,
  Leaf,
  Bike,
  Sun,
  Droplets,
  Trees,
  Wind,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile({ setActiveTab }) {
  const { user, refreshUser, logout, showNotification } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || 'Committed to a greener future.');
  const [avatar, setAvatar] = useState(user?.avatar || 'leaf');
  const [targetReduction, setTargetReduction] = useState(user?.target_reduction_pct || 25);
  const [saving, setSaving] = useState(false);

  const avatars = [
    { id: 'leaf', label: 'Leaf', icon: Leaf },
    { id: 'bike', label: 'Cyclist', icon: Bike },
    { id: 'sun', label: 'Solar', icon: Sun },
    { id: 'droplets', label: 'Water', icon: Droplets },
    { id: 'trees', label: 'Forest', icon: Trees },
    { id: 'wind', label: 'Clean Wind', icon: Wind },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateProfile({
        name,
        bio,
        avatar,
        target_reduction_pct: targetReduction,
      });
      await refreshUser();
      showNotification('Profile & Climate Targets Updated!', 'success');
    } catch (err) {
      console.error('Update profile error:', err);
      showNotification('Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Please Sign In</h3>
        <p className="text-xs text-slate-500">You need to be logged in to view and manage your profile.</p>
        <button
          onClick={() => setActiveTab('login')}
          className="px-5 py-2.5 bg-eco-600 text-white text-xs font-bold rounded-xl"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header Profile Summary Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center font-black text-3xl shadow-md uppercase">
            {user.name ? user.name.charAt(0) : 'U'}
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-200 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Eco Profile</span>
            </div>
            <h1 className="text-2xl font-black">{user.name}</h1>
            <p className="text-xs text-emerald-100">{user.email}</p>
            <p className="text-xs text-emerald-200/90 italic pt-1">{user.bio}</p>
          </div>
        </div>

        {/* Lifetime Statistics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-600/40 relative z-10 text-xs">
          <div>
            <span className="text-[10px] text-emerald-300 font-medium uppercase block">Eco-Points</span>
            <span className="text-xl font-black text-white flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              {user.points || 0}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-emerald-300 font-medium uppercase block">Habit Streak</span>
            <span className="text-xl font-black text-rose-300 flex items-center gap-1">
              <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
              {user.streak_days || 1} days
            </span>
          </div>

          <div>
            <span className="text-[10px] text-emerald-300 font-medium uppercase block">Badges Earned</span>
            <span className="text-xl font-black text-amber-300 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-300" />
              {user.badges_count || 3}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-emerald-300 font-medium uppercase block">Total CO₂ Saved</span>
            <span className="text-xl font-black text-emerald-200">
              {user.total_co2_saved_kg || 48.6} kg
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Profile Settings &amp; Personal Climate Goals
        </h3>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-xl p-3 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Personal Bio / Motivation
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Why are you reducing your footprint?"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-eco-500/20 focus:border-eco-500"
            />
          </div>

          {/* Avatar Icon Theme */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Eco Persona Icon
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {avatars.map((av) => {
                const Icon = av.icon;
                const isSelected = avatar === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setAvatar(av.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'border-eco-600 bg-eco-50/80 text-eco-800 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-eco-600" />
                    <span className="text-[11px]">{av.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personal Reduction Target */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-xs font-bold text-slate-900 block">
                  Annual Carbon Reduction Target
                </label>
                <span className="text-[11px] text-slate-500">
                  Aim to reduce emissions by {targetReduction}% this year
                </span>
              </div>
              <span className="text-xl font-black text-eco-700">{targetReduction}%</span>
            </div>

            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={targetReduction}
              onChange={(e) => setTargetReduction(Number(e.target.value))}
              className="w-full accent-eco-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>10% (Modest)</span>
              <span>25% (Recommended)</span>
              <span>60% (Net Zero Champion)</span>
            </div>
          </div>

          {/* Save & Logout Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700"
            >
              <LogOut className="w-4 h-4" /> Sign Out of Account
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-eco-600 hover:bg-eco-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
