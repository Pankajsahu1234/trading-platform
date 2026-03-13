import { TrendingUp } from 'lucide-react';

export const StatCard = ({ label, value, icon, colorClass = "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400" }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-4 transition-all duration-300 hover:scale-105 hover:border-blue-200 dark:hover:border-blue-700 group">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClass} shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{value}</p>
    </div>
    <TrendingUp className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
  </div>
);