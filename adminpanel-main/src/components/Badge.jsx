const RANK_STYLES = {
  Bronze:   'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200',
  Silver:   'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-600 border border-slate-300',
  Gold:     'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 border border-yellow-300',
  Platinum: 'bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-700 border border-cyan-300',
};

export default function Badge({ rank }) {
  const getIcon = (rank) => {
    switch(rank) {
      case 'Bronze': return '🥉';
      case 'Silver': return '🥈';
      case 'Gold': return '🥇';
      case 'Platinum': return '💎';
      default: return '';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight shadow-sm ${RANK_STYLES[rank] || 'bg-gray-100 border border-gray-200'}`}>
      <span>{getIcon(rank)}</span>
      {rank}
    </span>
  );
}