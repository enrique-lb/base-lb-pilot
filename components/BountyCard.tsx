import React from 'react';
import { Bounty, BountyStatus, WalletState } from '../types';
import { DollarSign, ExternalLink, ArrowRight } from 'lucide-react';

interface BountyCardProps {
  bounty: Bounty;
  wallet: WalletState;
  onClick: (id: number) => void;
}

const BountyCard: React.FC<BountyCardProps> = ({ bounty, wallet, onClick }) => {
  
  const getStatusColor = (status: BountyStatus) => {
    switch (status) {
      case BountyStatus.OPEN: return 'bg-green-500/10 text-green-400 border-green-500/20';
      case BountyStatus.IN_PROGRESS: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case BountyStatus.COMPLETED: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  return (
    <div 
        onClick={() => onClick(bounty.id)}
        className="group relative bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-base-blue/5 cursor-pointer flex flex-col h-full"
    >
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1 pr-4">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(bounty.status)} mb-2`}>
            {bounty.status.replace('_', ' ')}
          </div>
          <h3 className="text-xl font-semibold text-slate-100 group-hover:text-base-blue transition-colors">
            {bounty.title}
          </h3>
          <div className="flex items-center text-slate-500 text-xs mt-1">
             <span className="font-mono">#{bounty.id}</span>
             <span className="mx-2">•</span>
             <span>{new Date(bounty.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="text-right shrink-0">
          <div className="flex items-center text-2xl font-bold text-white">
            <DollarSign className="w-5 h-5 text-base-blue mr-0.5" />
            {bounty.amountUSDC}
          </div>
          <div className="text-xs text-slate-500 mt-1">USDC</div>
        </div>
      </div>

      {/* Description Preview */}
      <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
        {bounty.description}
      </p>

      {/* Footer Tags & CTA */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
        <div className="flex space-x-2">
          {bounty.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">
              {tag}
            </span>
          ))}
          {bounty.tags.length > 3 && (
             <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300">+{bounty.tags.length - 3}</span>
          )}
        </div>

        <div className="flex items-center text-slate-500 text-sm font-medium group-hover:text-white transition-colors">
            View Details
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default BountyCard;
