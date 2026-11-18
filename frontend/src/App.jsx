import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Recommendations from './pages/Recommendations';
import Challenges from './pages/Challenges';
import RewardsLeaderboard from './pages/RewardsLeaderboard';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'calculator' && <Calculator setActiveTab={setActiveTab} />}
          {activeTab === 'recommendations' && <Recommendations setActiveTab={setActiveTab} />}
          {activeTab === 'challenges' && <Challenges setActiveTab={setActiveTab} />}
          {activeTab === 'rewards' && <RewardsLeaderboard />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'profile' && <Profile setActiveTab={setActiveTab} />}
          {activeTab === 'login' && <Login setActiveTab={setActiveTab} />}
          {activeTab === 'register' && <Register setActiveTab={setActiveTab} />}
        </main>
      </div>

      <Footer setActiveTab={setActiveTab} />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
