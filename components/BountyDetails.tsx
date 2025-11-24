import React from 'react';
import { Bounty, BountyStatus, WalletState } from '../types';
import { ArrowLeft, ExternalLink, GitPullRequest, DollarSign, Clock, CheckCircle, Shield, User, Github } from 'lucide-react';

interface BountyDetailsProps {
  bounty: Bounty;
  wallet: WalletState;
  onBack: () => void;
  onClaim: (id: number) => void;
  onRelease: (id: number) => void;
}

const BountyDetails: React.FC<BountyDetailsProps> = ({ bounty, wallet, onBack, onClaim, onRelease }) => {
  const isMaintainer = wallet.address === bounty.maintainerAddress;
  const isWorker = wallet.address === bounty.workerAddress;

  const getStatusBadge = (status: BountyStatus) => {
    switch (status) {
      case BountyStatus.OPEN: 
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">Open for Claims</span>;
      case BountyStatus.IN_PROGRESS: 
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">In Progress</span>;
      case BountyStatus.COMPLETED: 
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">Completed</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Navigation */}
      <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Explore
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                    {getStatusBadge(bounty.status)}
                    <span className="text-slate-500 text-sm">{new Date(bounty.createdAt).toLocaleDateString()}</span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">{bounty.title}</h1>
                
                <div className="flex flex-wrap gap-2">
                    {bounty.tags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium border border-slate-700/50">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Description Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Github className="w-5 h-5 mr-2" />
                    Issue Description
                </h3>
                <div className="prose prose-invert prose-slate max-w-none">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{bounty.description}</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-800">
                    <a 
                        href={bounty.githubIssueUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center text-base-blue hover:text-blue-400 transition-colors"
                    >
                        View original issue on GitHub
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                </div>
            </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            
            {/* Value Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <DollarSign className="w-32 h-32 text-base-blue" />
                </div>
                <div className="relative z-10">
                    <div className="text-slate-400 font-medium mb-1">Total Bounty</div>
                    <div className="text-4xl font-bold text-white flex items-center">
                        {bounty.amountUSDC} <span className="text-lg text-base-blue ml-2">USDC</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center text-sm text-slate-400">
                        <Shield className="w-4 h-4 mr-2 text-green-500" />
                        Funds held in Escrow
                    </div>
                </div>
            </div>

            {/* Action Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Actions</h3>
                
                {!wallet.isConnected ? (
                    <div className="text-center p-4 bg-slate-950 rounded-xl border border-slate-800 border-dashed">
                        <p className="text-slate-400 text-sm mb-3">Connect your wallet to claim or manage this bounty.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                         {bounty.status === BountyStatus.OPEN && (
                            <button
                                onClick={() => onClaim(bounty.id)}
                                className="w-full py-3 px-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center"
                            >
                                <GitPullRequest className="w-5 h-5 mr-2" />
                                Claim Issue
                            </button>
                         )}

                         {bounty.status === BountyStatus.IN_PROGRESS && isMaintainer && (
                             <button
                                onClick={() => onRelease(bounty.id)}
                                className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-colors flex items-center justify-center shadow-lg shadow-green-900/20"
                             >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Release Funds
                             </button>
                         )}

                         {bounty.status === BountyStatus.IN_PROGRESS && !isMaintainer && (
                             <div className="w-full py-3 px-4 bg-slate-800 text-yellow-500 font-medium rounded-xl flex items-center justify-center">
                                <Clock className="w-5 h-5 mr-2" />
                                Work in Progress
                             </div>
                         )}

                         {bounty.status === BountyStatus.COMPLETED && (
                             <div className="w-full py-3 px-4 bg-green-500/10 text-green-400 border border-green-500/20 font-medium rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Bounty Paid
                             </div>
                         )}
                    </div>
                )}
            </div>

            {/* Info Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Participants</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-slate-400 text-sm">
                            <User className="w-4 h-4 mr-2" />
                            Maintainer
                        </div>
                        <div className="font-mono text-xs text-base-blue bg-blue-900/10 px-2 py-1 rounded">
                            {bounty.maintainerAddress.slice(0, 6)}...{bounty.maintainerAddress.slice(-4)}
                        </div>
                    </div>
                    {bounty.workerAddress && (
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                            <div className="flex items-center text-slate-400 text-sm">
                                <User className="w-4 h-4 mr-2" />
                                Worker
                            </div>
                            <div className="font-mono text-xs text-purple-400 bg-purple-900/10 px-2 py-1 rounded">
                                {bounty.workerAddress.slice(0, 6)}...{bounty.workerAddress.slice(-4)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default BountyDetails;
