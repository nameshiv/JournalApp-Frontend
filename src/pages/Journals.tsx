import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import JournalCard from '@/components/journal/JournalCard';
import { Loading, ErrorState, EmptyState, ConfirmDialog } from '@/components/common/Feedback';
import { getJournalEntries, deleteJournalEntry } from '@/api/journalApi';
import { getErrorMessage } from '@/utils/errorHandler';
import type { JournalEntry } from '@/types/journal';

export default function Journals() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getJournalEntries();
      
      const sortedData = [...data].sort(
      (a, b) =>
        new Date(b.date ?? '').getTime() -
        new Date(a.date ?? '').getTime()
    );

    setEntries(sortedData);
      
    } catch (err) {
      setError(getErrorMessage(err).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteJournalEntry(deleteId);
      setEntries(prev => prev.filter(e => e.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setDeleteError(getErrorMessage(err).message);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = entries.filter(entry => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      entry.title?.toLowerCase().includes(q) ||
      entry.content?.toLowerCase().includes(q)
    );
  });

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-ink">Journals</h1>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 w-full sm:w-56"
              placeholder="Search entries..."
            />
          </div>
          <Link to="/journals/new" className="btn-primary whitespace-nowrap">
            <Plus size={16} />
            <span className="hidden sm:inline">New Entry</span>
            <span className="sm:hidden">New</span>
          </Link>
        </div>
      </div>

      {loading && <Loading message="Loading journals..." />}

      {!loading && error && <ErrorState message={error} onRetry={fetchEntries} />}

      {!loading && !error && filtered.length === 0 && entries.length === 0 && (
        <EmptyState
          message="You haven't written any journal entries yet."
          action={
            <Link to="/journals/new" className="btn-primary">
              <Plus size={16} />
              Create your first entry
            </Link>
          }
        />
      )}

      {!loading && !error && filtered.length === 0 && entries.length > 0 && (
        <EmptyState message="No entries match your search." />
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(entry => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

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

      {deleteError && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="px-4 py-3 rounded-md shadow-card text-sm font-medium bg-error text-white">
            {deleteError}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
