import React, { useState } from 'react';
import { X, Sparkles, Loader2, Github } from 'lucide-react';
import { analyzeIssueWithGemini } from '../services/geminiService';
import { IssueAnalysis } from '../types';

interface CreateBountyModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  isOpen: boolean;
}

const CreateBountyModal: React.FC<CreateBountyModalProps> = ({ onClose, onSubmit, isOpen }) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<IssueAnalysis | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!description) return;
    setIsAnalyzing(true);
    const result = await analyzeIssueWithGemini(description);
    setAnalysis(result);
    if (result) {
        setTitle(result.title);
        setAmount(result.suggestedPrice);
        setTags(result.tags);
    }
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        githubUrl,
        title: title || "New Bounty",
        description: description,
        amount,
        tags: tags.length > 0 ? tags : ['Manual'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 text-base-blue mr-2" />
            <h2 className="text-lg font-semibold text-white">Create New Bounty</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          
          {/* GitHub Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">GitHub Issue URL</label>
            <div className="relative">
                <Github className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                type="text"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-base-blue focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                placeholder="https://github.com/owner/repo/issues/123"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                />
            </div>
          </div>

          {/* Description Input & AI Trigger */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-slate-300">Issue Description</label>
                {!analysis && (
                    <span className="text-xs text-slate-500">Paste content below to auto-fill</span>
                )}
            </div>
            <textarea
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-base-blue outline-none h-32 resize-none placeholder:text-slate-600 leading-relaxed"
              placeholder="Paste the GitHub issue description here. The AI will analyze complexity, suggest a price, and generate a title."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <button 
                type="button" 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !description}
                className={`
                    w-full flex items-center justify-center py-2 rounded-lg text-sm font-medium transition-all border
                    ${isAnalyzing 
                        ? 'bg-purple-900/20 border-purple-500/30 text-purple-200' 
                        : 'bg-purple-600/10 border-purple-500/30 text-purple-400 hover:bg-purple-600/20 hover:text-purple-300'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                `}
            >
                {isAnalyzing ? (
                    <>
                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                        Analyzing Issue Logic...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Title & Price with AI
                    </>
                )}
            </button>
          </div>

          {/* AI Suggestions Panel */}
          {analysis && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                     <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Generated Title</label>
                     <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20">{analysis.difficulty}</span>
                </div>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded px-3 py-2 text-white text-sm focus:border-base-blue outline-none"
                />
                
                <div className="flex gap-2 flex-wrap">
                    {tags.map((t, i) => (
                        <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-700">{t}</span>
                    ))}
                </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Bounty Amount</label>
            <div className="relative">
              <input
                type="number"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-base-blue outline-none font-mono text-lg"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <div className="absolute left-3 top-3.5 text-slate-500">$</div>
              <div className="absolute right-4 top-3.5 text-sm text-slate-500 font-semibold">USDC</div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!title || !amount}
            className="w-full bg-base-blue hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            Deposit & Create Bounty
          </button>

          <p className="text-xs text-center text-slate-500 pb-2">
            Funds will be deposited to the Escrow Smart Contract.
          </p>

        </div>
      </div>
    </div>
  );
};

export default CreateBountyModal;
