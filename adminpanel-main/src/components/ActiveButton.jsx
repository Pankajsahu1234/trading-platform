import React from 'react';

export const ActiveButton = ({ label, isActive, onClick, count }) => {
  return (
    <button
      onClick={onClick}
      className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
      }`}
    >
      {label}
      {count > 0 && (
        <span className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black ${
          isActive ? 'bg-white text-indigo-600' : 'bg-rose-500 text-white'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};