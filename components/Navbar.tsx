import React from 'react';
import { WalletState, ViewState } from '../types';
import { Wallet, Zap, ArrowLeft } from 'lucide-react';

interface NavbarProps {
  wallet: WalletState;
  onConnect: () => void;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Navbar: React.FC<NavbarProps> = ({ wallet, onConnect, currentView, onNavigate }) => {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer group" onClick={() => onNavigate(ViewState.HOME)}>
            <div className="w-8 h-8 rounded-full bg-base-blue flex items-center justify-center mr-2 shadow-lg shadow-base-blue/20 group-hover:scale-110 transition-transform">
               <Zap className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-base-blue transition-colors">
              Base<span className="text-base-blue text-white">Bounties</span>
            </span>
             by lightning bounties
          </div>

          {/* Navigation Links - Simplified */}
          <div className="hidden md:flex space-x-8">
             {/* Add future links here */}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {currentView !== ViewState.CREATE && (
                <button
                onClick={() => onNavigate(ViewState.CREATE)}
                className="hidden sm:block text-slate-300 hover:text-white text-sm font-medium px-3 py-2"
                >
                Create Bounty
                </button>
            )}
            
            <button
              onClick={onConnect}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-all
                ${wallet.isConnected 
                  ? 'bg-slate-800 text-base-blue border border-slate-700' 
                  : 'bg-base-blue hover:bg-blue-600 text-white shadow-lg shadow-blue-900/20'}
              `}
            >
              <Wallet className="w-4 h-4" />
              <span>
                {wallet.isConnected 
                  ? `${wallet.address?.slice(0, 6)}...${wallet.address?.slice(-4)}` 
                  : 'Connect Wallet'}
              </span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
