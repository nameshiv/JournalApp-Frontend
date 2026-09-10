import type { JournalEntry } from '@/types/journal';
import { formatDate } from '@/utils/dateUtils';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface JournalCardProps {
  entry: JournalEntry;
  onDelete: (id: string) => void;
}

const sentimentStyles: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  HAPPY: {
    label: 'Happy',
    color: 'text-success bg-success/10',
    emoji: '😊',
  },
  SAD: {
    label: 'Sad',
    color: 'text-info bg-info/10',
    emoji: '😔',
  },
  NEUTRAL: {
    label: 'Neutral',
    color: 'text-ink-secondary bg-bg-soft',
    emoji: '😐',
  },
  ANGRY: {
    label: 'Angry',
    color: 'text-error bg-error/10',
    emoji: '😡',
  },
  ANXIOUS: {
    label: 'Anxious',
    color: 'text-warning bg-warning/10',
    emoji: '😰',
  },
};

export function getSentimentStyle(sentiment?: string | null) {
  if (!sentiment) return null;
  const key = sentiment.toUpperCase();
  return sentimentStyles[key] || { label: sentiment, color: 'text-ink-secondary bg-bg-soft', emoji: '•' };
}

export function SentimentBadge({ sentiment }: { sentiment?: string | null; }) {
  const style = getSentimentStyle(sentiment);
  if (!style) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${style.color}`}>
      <span>{style.emoji}</span>
      {style.label}
    </span>
  );
}

export default function JournalCard({ entry, onDelete }: JournalCardProps) {
  const dateStr = formatDate(entry.date || entry.createdDate);

  return (
    <div className="card p-5 hover:shadow-hover transition-shadow duration-200 group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Link to={`/journals/${entry.id}/edit`} className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-ink group-hover:text-primary transition-colors line-clamp-2">
            {entry.title || 'Untitled'}
          </h3>
        </Link>
        <SentimentBadge sentiment={entry.sentiment} />
      </div>

      <Link to={`/journals/${entry.id}/edit`} className="block">
        <p className="text-sm text-ink-secondary line-clamp-3 mb-3 leading-relaxed">
          {entry.content || 'No content'}
        </p>
      </Link>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-ink-muted">{dateStr}</span>
        <div className="flex items-center gap-1">
          <Link
            to={`/journals/${entry.id}`}
            className="p-1.5 rounded-md text-ink-secondary hover:bg-bg-soft hover:text-ink transition-colors"
            aria-label="View entry"
          >
            <Eye size={15} />
          </Link>
          <Link
            to={`/journals/${entry.id}/edit`}
            className="p-1.5 rounded-md text-ink-secondary hover:bg-bg-soft hover:text-ink transition-colors"
            aria-label="Edit entry"
          >
            <Pencil size={15} />
          </Link>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-1.5 rounded-md text-ink-secondary hover:bg-error/10 hover:text-error transition-colors"
            aria-label="Delete entry"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
