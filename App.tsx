import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BountyCard from './components/BountyCard';
import BountyDetails from './components/BountyDetails';
import CreateBountyModal from './components/CreateBountyModal';
import { Bounty, BountyStatus, ViewState, WalletState } from './types';
import { INITIAL_BOUNTIES } from './constants';
import { Plus, Search } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [bounties, setBounties] = useState<Bounty[]>(INITIAL_BOUNTIES);
  const [selectedBountyId, setSelectedBountyId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  
  // Simulated Wallet State
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    balanceUSDC: 0
  });

  // Effect to simulate checking wallet connection on load
  useEffect(() => {
    // In a real app, use wagmi's useAccount()
  }, []);

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setTimeout(() => {
        setWallet({
            address: '0x71C...9A21',
            isConnected: true,
            balanceUSDC: 5000
        });
    }, 800);
  };

  const handleCreateBounty = (data: any) => {
    const newBounty: Bounty = {
        id: Math.floor(Math.random() * 10000),
        githubIssueUrl: data.githubUrl,
        title: data.title,
        description: data.description,
        amountUSDC: data.amount,
        status: BountyStatus.OPEN,
        maintainerAddress: wallet.address || '0xSimulatedUser',
        tags: data.tags,
        createdAt: new Date().toISOString()
    };
    
    // Simulate API call / Contract interaction
    setBounties([newBounty, ...bounties]);
    setIsModalOpen(false);
    // Ensure we are on home view to see the new bounty
    if (view !== ViewState.HOME) {
        setView(ViewState.HOME);
    }
  };

  const handleViewBounty = (id: number) => {
      setSelectedBountyId(id);
      setView(ViewState.DETAILS);
      window.scrollTo(0, 0);
  };

  const handleClaimBounty = (id: number) => {
    if (!wallet.isConnected) return;
    
    // Simulate contract interaction: claimBounty(id)
    const updated = bounties.map(b => {
        if (b.id === id) {
            return { ...b, status: BountyStatus.IN_PROGRESS, workerAddress: wallet.address || '' };
        }
        return b;
    });
    setBounties(updated);
  };

  const handleReleaseBounty = (id: number) => {
      // Simulate contract interaction: releaseBounty(id)
      const updated = bounties.map(b => {
        if (b.id === id) return { ...b, status: BountyStatus.COMPLETED };
        return b;
      });
      setBounties(updated);
  };

  const filteredBounties = bounties.filter(b => 
    b.title.toLowerCase().includes(filter.toLowerCase()) || 
    b.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
  );

  const selectedBounty = bounties.find(b => b.id === selectedBountyId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-base-blue selection:text-white pb-20">
      <Navbar 
        wallet={wallet} 
        onConnect={handleConnectWallet} 
        currentView={view}
        onNavigate={(targetView) => {
            if (targetView === ViewState.CREATE) {
                setIsModalOpen(true);
            } else {
                setView(targetView);
            }
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {view === ViewState.HOME && (
          <div className="animate-in fade-in duration-500">
            {/* Hero / Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-gradient-to-br from-base-blue/20 to-slate-900 border border-base-blue/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="text-slate-400 text-sm font-medium mb-1">Total Value Locked</div>
                    <div className="text-3xl font-bold text-white">$12,450 <span className="text-base text-base-blue">USDC</span></div>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <div className="text-slate-400 text-sm font-medium mb-1">Active Bounties</div>
                <div className="text-3xl font-bold text-white">{bounties.filter(b => b.status === BountyStatus.OPEN).length}</div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:border-slate-700 transition-colors" onClick={() => setIsModalOpen(true)}>
                <div>
                   <div className="text-slate-400 text-sm font-medium mb-1">New Bounty</div>
                   <div className="text-sm text-slate-300">Fund an issue with USDC</div>
                </div>
                <div className="bg-white group-hover:bg-slate-200 text-slate-900 p-3 rounded-full shadow-lg transition-all">
                  <Plus className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search bounties by title or tag..." 
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-base-blue outline-none transition-all placeholder:text-slate-600"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            {/* Bounty List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBounties.length > 0 ? (
                  filteredBounties.map(bounty => (
                    <BountyCard 
                      key={bounty.id} 
                      bounty={bounty} 
                      wallet={wallet}
                      onClick={handleViewBounty}
                    />
                  ))
              ) : (
                  <div className="col-span-full text-center py-20 text-slate-500 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                      <p>No bounties found matching your search.</p>
                      <button onClick={() => setFilter('')} className="text-base-blue hover:underline mt-2 text-sm">Clear filters</button>
                  </div>
              )}
            </div>
          </div>
        )}

        {view === ViewState.DETAILS && selectedBounty && (
             <BountyDetails 
                bounty={selectedBounty}
                wallet={wallet}
                onBack={() => setView(ViewState.HOME)}
                onClaim={handleClaimBounty}
                onRelease={handleReleaseBounty}
             />
        )}

      </main>

      <CreateBountyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateBounty} 
      />
    </div>
  );
};

export default App;