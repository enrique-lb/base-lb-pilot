import React from 'react';
import { SOLIDITY_CONTRACT_CODE, SQL_SCHEMA_CODE, API_ROUTE_CODE } from '../constants';
import { Copy, FileCode, Database, Server } from 'lucide-react';

const CodeBlock = ({ title, icon: Icon, code }: { title: string, icon: any, code: string }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mb-8">
    <div className="bg-slate-950/50 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
      <div className="flex items-center space-x-2 text-slate-200 font-medium">
        <Icon className="w-4 h-4 text-base-blue" />
        <span>{title}</span>
      </div>
      <button 
        className="text-xs text-slate-500 hover:text-white flex items-center"
        onClick={() => navigator.clipboard.writeText(code)}
      >
        <Copy className="w-3 h-3 mr-1" /> Copy
      </button>
    </div>
    <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-slate-400 leading-relaxed">
      <code>{code}</code>
    </pre>
  </div>
);

const DeveloperDocs = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-3">System Architecture</h1>
            <p className="text-slate-400">
                The technical foundation of Base Bounties. These components handle the 
                lifecycle of a bounty from deposit to GitHub PR merger to on-chain release.
            </p>
        </div>

        <CodeBlock title="BountyEscrow.sol (Base Smart Contract)" icon={FileCode} code={SOLIDITY_CONTRACT_CODE} />
        <CodeBlock title="Supabase Database Schema" icon={Database} code={SQL_SCHEMA_CODE} />
        <CodeBlock title="Next.js GitHub Webhook Handler" icon={Server} code={API_ROUTE_CODE} />
    </div>
  );
};

export default DeveloperDocs;
