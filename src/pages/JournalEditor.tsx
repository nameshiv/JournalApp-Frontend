import { useState, useEffect, FormEvent } from 'react';

import { useNavigate, useParams, Link } from 'react-router-dom';

import { ArrowLeft } from 'lucide-react';

import AppLayout from '@/components/layout/AppLayout';

import { Loading, ErrorState } from '@/components/common/Feedback';

import {
  createJournalEntry,
  getJournalEntry,
  updateJournalEntry,
} from '@/api/journalApi';

import { getErrorMessage } from '@/utils/errorHandler';

import { formatShortDate } from '@/utils/dateUtils';

import { useAuth } from '@/hooks/useAuth';

import type { JournalEntry, Sentiment } from '@/types/journal';

export default function JournalEditor() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { user, refreshUser } = useAuth();

  const isEdit = !!id;

  const sentimentEnabled = !!user?.sentimentAnalysis;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [sentiment, setSentiment] = useState<Sentiment | ''>('');

  const [entry, setEntry] = useState<JournalEntry | null>(null);

  const [loading, setLoading] = useState(isEdit);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
  const pingHealth = () => {
    fetch(`${import.meta.env.VITE_API_URL}/health-check`).catch(() => {});
  };

  pingHealth();

  const interval = setInterval(pingHealth, 12 * 60 * 1000);

  return () => {
    clearInterval(interval);
  };
}, []);

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);

        const data = await getJournalEntry(id!);

        setEntry(data);

        setTitle(data.title || '');

        setContent(data.content || '');

        // Load the existing sentiment when editing
        setSentiment(data.sentiment ?? '');
      } catch (err) {
        setError(getErrorMessage(err).message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError('');

    setSaving(true);

    try {
      const journalData = {
        title,
        content,
        ...(sentimentEnabled && sentiment
          ? { sentiment }
          : {}),
      };

      if (isEdit && id) {
        await updateJournalEntry(id, journalData);
        await refreshUser();
        
        navigate('/journals');
      } else {
        await createJournalEntry(journalData);
        await refreshUser();
        
        navigate('/journals');
      }
    } catch (err) {
      setError(getErrorMessage(err).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <Loading message="Loading entry..." />
      </AppLayout>
    );
  }

  if (error && isEdit && !entry) {
    return (
      <AppLayout>
        <ErrorState
          message={error}
          onRetry={() => navigate('/journals')}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <Link
          to="/journals"
          className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Journals
        </Link>
      </div>

      <h1 className="text-2xl font-semibold text-ink mb-1">
        {isEdit ? 'Edit entry' : 'Write about your day'}
      </h1>

      {isEdit && entry?.date && (
        <p className="text-sm text-ink-muted mb-6">
          {formatShortDate(
            entry.date || entry.createdDate
          )}
        </p>
      )}

      {!isEdit && (
        <p className="text-sm text-ink-secondary mb-6">
          Take your time. There's no rush.
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="card p-6 space-y-5"
      >
        <div>
          <label htmlFor="title" className="label">
            Title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="Give your entry a title"
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="content" className="label">
            Your thoughts
          </label>

          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input min-h-[240px] resize-y leading-relaxed"
            placeholder="Write freely about your day..."
            required
          />
        </div>

        {/* Sentiment selection */}
        {sentimentEnabled && (
          <div>
            <label
              htmlFor="sentiment"
              className="label"
            >
              How was your day?
            </label>

            <select
              id="sentiment"
              value={sentiment}
              onChange={(e) =>
                setSentiment(
                  e.target.value as Sentiment | ''
                )
              }
              className="input"
            >
              <option value="">
                Select your mood
              </option>

              <option value="HAPPY">
                😊 Happy
              </option>

              <option value="SAD">
                😔 Sad
              </option>

              <option value="NEUTRAL">
                😐 Neutral
              </option>

              <option value="ANGRY">
                😡 Angry
              </option>

              <option value="ANXIOUS">
                😰 Anxious
              </option>
            </select>
          </div>
        )}

        {error && (
          <div className="text-sm text-error bg-error/5 border border-error/20 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/journals')}
            className="btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving
              ? 'Saving...'
              : isEdit
                ? 'Save Changes'
                : 'Save Entry'}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
