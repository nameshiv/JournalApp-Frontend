export type Sentiment =
  | 'HAPPY'
  | 'SAD'
  | 'NEUTRAL'
  | 'ANGRY'
  | 'ANXIOUS';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  sentiment?: Sentiment | null;
  date?: string;
  createdDate?: string;
}

export interface JournalEntryInput {
  title: string;
  content: string;
  sentiment?: Sentiment;
}

export interface SentimentResult {
  sentiment: Sentiment;
  dominantEmotion?: string;
}
