import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useUsers } from './hooks/useUsers';
import { StatCard } from './components/StatCards';
import { UserTableWrapper } from './features/UserTableWrapper';
import { WithdrawTableWrapper } from './features/WithdrawTableWrapper';
import { TransactionTableWrapper } from './features/TransactionTableWrapper';
import Logo from './components/Logo';
import SettingsComponent from './components/Settings';
import {
  LayoutDashboard,
  Users,
  Clock,
  CreditCard,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  Diamond,
  Sun,
  Moon
} from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { logout, admin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const {
    users,
    loading,
    error,
    withdrawals,
    transactions,
    stats,
    updateUser,
    deleteUser,
    handleWithdrawalAction
  } = useUsers();

  const fmt = (n) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(n);

  const NavItem = ({ icon: Icon, label, isActive, onClick, badge }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive
          ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white shadow-md shadow-blue-500/20'
          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      {sidebarOpen && (
        <>
          <span className="font-semibold text-sm flex-1 text-left">{label}</span>
          {badge > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              isActive ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'
            }`}>
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col fixed h-screen z-30 shadow-2xl`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            {sidebarOpen && (
              <div>
                <h1 className="font-black text-lg text-white tracking-tight">TradeMaster</h1>
                <p className="text-xs text-gray-400 font-medium">Admin Panel</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute -right-3 top-8 bg-gray-800 border border-gray-700 rounded-full p-1 text-gray-400 hover:text-blue-400 hover:border-blue-500 transition-all shadow-md"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            isActive={activeTab === 'Dashboard'}
            onClick={() => setActiveTab('Dashboard')}
          />
          <NavItem
            icon={Users}
            label="Users"
            isActive={activeTab === 'User Overview'}
            onClick={() => setActiveTab('User Overview')}
          />
          <NavItem
            icon={Clock}
            label="Withdrawals"
            isActive={activeTab === 'Pending Withdrawals'}
            onClick={() => setActiveTab('Pending Withdrawals')}
            badge={withdrawals.length}
          />
          <NavItem
            icon={CreditCard}
            label="Transactions"
            isActive={activeTab === 'Transactions'}
            onClick={() => setActiveTab('Transactions')}
          />

          <div className="pt-4 pb-2">
            {sidebarOpen && <div className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">System</div>}
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-gray-800 hover:text-gray-100 group"
          >
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span className="font-semibold text-sm">Settings</span>}
          </button>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-800 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm text-white">{admin?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-400">{admin?.email || 'admin@dev.com'}</p>
                </div>
              )}
            </button>

            {showProfile && sidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl py-2 z-50">
                <button
                  onClick={() => {
                    logout();
                    setShowProfile(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-900/20 font-semibold flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-8 py-6 sticky top-0 z-20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-gray-100 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {activeTab === 'Dashboard' ? 'Dashboard Overview' : activeTab === 'User Overview' ? 'Users Management' : activeTab}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="relative p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="relative p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              icon={<Users className="w-6 h-6" />}
              colorClass="bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400"
            />
            <StatCard
              label="Total Deposits"
              value={fmt(stats.totalDeposits)}
              icon={<TrendingUp className="w-6 h-6" />}
              colorClass="bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 dark:from-emerald-900/30 dark:to-emerald-800/30 dark:text-emerald-400"
            />
            <StatCard
              label="Total Withdrawn"
              value={fmt(stats.totalWithdrawn)}
              icon={<ArrowUpRight className="w-6 h-6" />}
              colorClass="bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600 dark:from-rose-900/30 dark:to-rose-800/30 dark:text-rose-400"
            />
            <StatCard
              label="Platinum Members"
              value={stats.platinum}
              icon={<Diamond className="w-6 h-6" />}
              colorClass="bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 dark:from-purple-900/30 dark:to-purple-800/30 dark:text-purple-400"
            />
          </div>

          {/* Content based on active tab */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
            {(activeTab === 'Dashboard' || activeTab === 'User Overview') && (
              <UserTableWrapper
                users={users}
                loading={loading}
                error={error}
                onDelete={deleteUser}
                onUpdate={updateUser}
              />
            )}

            {activeTab === 'Pending Withdrawals' && (
              <WithdrawTableWrapper
                withdrawals={withdrawals}
                onAction={handleWithdrawalAction}
              />
            )}

            {activeTab === 'Transactions' && (
              <TransactionTableWrapper transactions={transactions} />
            )}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsComponent isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
