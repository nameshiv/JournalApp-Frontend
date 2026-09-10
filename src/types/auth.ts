    export interface User {
      id?: string;
      userName?: string;
      username?: string;
      roles?: string[];
      role?: string;
      sentimentAnalysis?: boolean;
      weeklySentiment?: string | null;
      weeklySentimentCounts?: Record<string, number>;
    }

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
}
