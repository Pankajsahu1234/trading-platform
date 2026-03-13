import React, { useState } from "react";

export const WithdrawTableWrapper = ({ withdrawals, onAction }) => {
  const [loadingId, setLoadingId] = useState(null);

  const handleAction = async (withdrawal, status) => {
    setLoadingId(withdrawal.id);
    try {
      await onAction(withdrawal, status);
    } finally {
      setLoadingId(null);
    }
  };

  if (withdrawals.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-16 text-center border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-teal-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-slate-600 font-bold text-lg mb-1">All Clear!</p>
        <p className="text-slate-400 font-medium text-sm">
          No pending withdrawal requests at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-transparent">
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm">
            ⏳
          </span>
          Pending Withdrawals
          <span className="ml-2 px-2.5 py-1 rounded-full bg-rose-500 text-white text-xs font-bold">
            {withdrawals.length}
          </span>
        </h2>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">User</th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">Type</th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">
              Wallet
            </th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">
              Requested
            </th>
            <th className="px-6 py-4 text-xs uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {withdrawals.map((wd) => (
            <tr
              key={wd.id}
              className="hover:bg-teal-50/30 transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {(wd.userName || "U").charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-700">
                    {wd.userName || "Unknown"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-slate-600 text-xs">
                  {wd.userEmail || "N/A"}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                    wd.withdrawalType === "PROFIT"
                      ? "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-300"
                      : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300"
                  }`}
                >
                  {wd.withdrawalType === "PROFIT" ? "💰" : "💵"}
                  {wd.withdrawalType || "PRINCIPAL"}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-rose-600 font-black text-base">
                  $
                  {(wd.finalAmount || wd.requestedAmount || 0).toLocaleString()}
                </span>
              </td>
              <td className="px-6 py-4">
                <div
                  className="font-mono text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-600 inline-block max-w-xs truncate"
                  title={wd.userWalletAddress}
                >
                  {wd.userWalletAddress
                    ? wd.userWalletAddress.slice(0, 12) + "..."
                    : "N/A"}
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-slate-500">
                {wd.requestedDate
                  ? new Date(wd.requestedDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(wd, "Approved")}
                    disabled={loadingId === wd.id}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-400 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-emerald-200 hover:shadow-lg flex items-center gap-1.5"
                  >
                    {loadingId === wd.id ? (
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(wd, "Rejected")}
                    disabled={loadingId === wd.id}
                    className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:from-slate-300 disabled:to-slate-400 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-rose-200 hover:shadow-lg flex items-center gap-1.5"
                  >
                    {loadingId === wd.id ? (
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
