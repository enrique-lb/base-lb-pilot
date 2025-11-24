export enum BountyStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Bounty {
  id: number;
  githubIssueUrl: string;
  title: string;
  description: string;
  amountUSDC: number;
  status: BountyStatus;
  maintainerAddress: string;
  workerAddress?: string;
  tags: string[];
  createdAt: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balanceUSDC: number;
}

export enum ViewState {
  HOME = 'HOME',
  CREATE = 'CREATE',
  DETAILS = 'DETAILS'
}

// Gemini Analysis Result
export interface IssueAnalysis {
  title: string;
  summary: string;
  suggestedPrice: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  tags: string[];
}
