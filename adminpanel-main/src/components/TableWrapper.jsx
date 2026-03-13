import React from 'react';

/**
 * Reusable wrapper to maintain consistent table styling across the dashboard.
 * @param {string} title - Optional title for the table section.
 * @param {React.ReactNode} children - The <table> element and its contents.
 */
export const TableWrapper = ({ title, children, badge }) => {
  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center gap-3 ml-1">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          {badge && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase">
              {badge}
            </span>
          )}
        </div>
      )}
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            {children}
          </table>
        </div>
      </div>
    </div>
  );
};

// Sub-components for semantic table structure
export const Th = ({ children, className = "" }) => (
  <th className={`px-6 py-4 bg-slate-50 text-slate-400 font-bold text-[11px] tracking-widest uppercase border-b ${className}`}>
    {children}
  </th>
);

export const Td = ({ children, className = "" }) => (
  <td className={`px-6 py-4 text-slate-700 border-b border-slate-50 ${className}`}>
    {children}
  </td>
);