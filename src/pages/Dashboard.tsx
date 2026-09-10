import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { Plus, BookOpen } from 'lucide-react';

import AppLayout from '@/components/layout/AppLayout';

import WeatherCard from '@/components/weather/WeatherCard';

import SentimentCard from '@/components/sentiment/SentimentCard';

import JournalCard from '@/components/journal/JournalCard';

import { Loading, ErrorState } from '@/components/common/Feedback';

import {ConfirmDialog} from '@/components/common/Feedback';

import {
  getJournalEntries,
  deleteJournalEntry,
} from '@/api/journalApi';

import { getErrorMessage } from '@/utils/errorHandler';

import { getGreeting } from '@/utils/dateUtils';

import { useAuth } from '@/hooks/useAuth';

import type { JournalEntry } from '@/types/journal';


export default function Dashboard() {
  const { user, refreshUser  } = useAuth();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');


  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getJournalEntries();

      setEntries(data);
    } catch (err) {
      setError(getErrorMessage(err).message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchEntries();
  }, []);


  // Delete journal entry after confirmation
  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    setDeleteError('');

    try {
      await deleteJournalEntry(deleteId);
      await refreshUser();

      // Remove deleted entry from Dashboard immediately
      setEntries(prev =>
        prev.filter(entry => entry.id !== deleteId)
      );

      // Close confirmation dialog
      setDeleteId(null);
    } catch (err) {
      setDeleteError(getErrorMessage(err).message);
    } finally {
      setDeleting(false);
    }
  };


  const recentEntries = entries.slice(0, 3);

  const name = user?.userName || user?.username || 'there';

  const greeting = getGreeting();


  return (
    <AppLayout>

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-ink">
          {greeting}, {name}
        </h1>

        <p className="text-ink-secondary text-sm mt-1.5">
          Take a moment to reflect on your day.
        </p>
      </div>


      {/* Weather + Sentiment row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

        <WeatherCard />

        <SentimentCard
          loading={loading}
        />

      </div>


      {/* Recent entries header */}
      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-2">

          <BookOpen
            size={18}
            className="text-ink-secondary"
          />

          <h2 className="text-lg font-semibold text-ink">
            Your Journal
          </h2>

        </div>


        <Link
          to="/journals/new"
          className="btn-primary"
        >
          <Plus size={16} />

          <span className="hidden sm:inline">
            New Entry
          </span>

          <span className="sm:hidden">
            New
          </span>
        </Link>

      </div>


      {/* Loading */}
      {loading && (
        <Loading message="Loading journals..." />
      )}


      {/* Error */}
      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={fetchEntries}
        />
      )}


      {/* No journal entries */}
      {!loading &&
        !error &&
        recentEntries.length === 0 && (
          <div className="card p-8 sm:p-12 text-center">

            <p className="text-ink-secondary text-sm mb-4">
              You haven't written any journal entries yet.
            </p>

            <Link
              to="/journals/new"
              className="btn-primary"
            >
              <Plus size={16} />

              Create your first entry
            </Link>

          </div>
        )}


      {/* Recent journal entries */}
      {!loading &&
        !error &&
        recentEntries.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {recentEntries.map(entry => (
                <JournalCard
                  key={entry.id}
                  entry={entry}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}

            </div>


            {/* View all entries */}
            {entries.length > 3 && (
              <div className="mt-6 text-center">

                <Link
                  to="/journals"
                  className="btn-secondary"
                >
                  View all entries
                </Link>

              </div>
            )}

          </>
        )}


      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete entry?"
        message="This will permanently delete your journal entry. This cannot be undone."
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteId(null);
          setDeleteError('');
        }}
      />


      {/* Delete error */}
      {deleteError && (
        <p className="text-error text-sm mt-3">
          {deleteError}
        </p>
      )}

    </AppLayout>
  );
}
