
import React from 'react';

interface PrivacyScoreProps {
  score: number;
  label: string;
}

const PrivacyScore: React.FC<PrivacyScoreProps> = ({ score, label }) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 50) return 'text-amber-400';
    return 'text-rose-500';
  };

  const getBarColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500';
    if (s >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">{label}</p>
          <h2 className={`text-4xl font-bold ${getScoreColor(score)}`}>
            {score}<span className="text-xl text-zinc-600 ml-1">/100</span>
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-400">Security Rating</p>
          <p className="text-sm font-semibold text-white">
            {score >= 80 ? 'Excellent' : score >= 50 ? 'Compromised' : 'Critical Risk'}
          </p>
        </div>
      </div>
      
      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      
      <div className="mt-4 flex gap-4 text-[10px] text-zinc-500 uppercase tracking-tighter">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div> 80-100 Secure
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div> 50-79 At Risk
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div> 0-49 Exposed
        </div>
      </div>
    </div>
  );
};

export default PrivacyScore;
