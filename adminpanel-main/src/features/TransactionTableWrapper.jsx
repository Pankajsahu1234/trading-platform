import React from 'react';
import { TableWrapper, Th, Td } from '../components/TableWrapper';

export const TransactionTableWrapper = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-slate-600 font-bold text-lg mb-1">No Transactions Yet</p>
        <p className="text-slate-400 font-medium text-sm">Transaction history will appear here once users make withdrawals.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-slate-800">Transaction History</h2>
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 text-xs font-bold border border-teal-200">
            {transactions.length} Total
          </span>
        </div>
      </div>

      <TableWrapper>
        <thead>
          <tr>
            <Th>Date & Time</Th>
            <Th>User</Th>
            <Th>Type</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {transactions.map((tx, idx) => (
            <tr key={idx} className="hover:bg-teal-50/20 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-slate-800 font-bold text-sm">
                      {new Date(tx.timestamp || tx.processedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      {new Date(tx.timestamp || tx.processedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {tx.user_name.charAt(0)}
                  </div>
                  <span className="font-bold text-slate-800">{tx.user_name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  tx.type === 'Profit' 
                    ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border border-purple-300' 
                    : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300'
                }`}>
                  {tx.type === 'Profit' ? '📈' : '💵'}
                  {tx.type || 'Principal'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="font-black text-slate-900 text-base">${tx.amount.toLocaleString()}</span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                  tx.status === 'Approved' 
                    ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-300' 
                    : 'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-700 border border-rose-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${tx.status === 'Approved' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </TableWrapper>
    </div>
  );
};