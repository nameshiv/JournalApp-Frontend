import { useState, useEffect } from 'react';

import { Users, ShieldCheck, Trash2 } from 'lucide-react';

import AppLayout from '@/components/layout/AppLayout';

import {
  Loading,
  ErrorState,
  ConfirmDialog,
  Toast,
} from '@/components/common/Feedback';

import {
  getAllUsers,
  clearAppCache,
  makeAdmin,
  removeAdmin,
} from '@/api/adminApi';

import { getErrorMessage } from '@/utils/errorHandler';

import type { AdminUser } from '@/types/admin';

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCache, setShowCache] = useState(false);
  const [clearing, setClearing] = useState(false);

  const [toast, setToast] = useState('');
  const [actionError, setActionError] = useState('');

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showMakeAdmin, setShowMakeAdmin] = useState(false);
  const [showRemoveAdmin, setShowRemoveAdmin] = useState(false);
  const [adminActionLoading, setAdminActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getAllUsers();
      setUsers(data as AdminUser[]);
    } catch (err) {
      setError(getErrorMessage(err).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleMakeAdmin = async () => {
    if (!selectedUser?.id) return;

    setAdminActionLoading(true);
    setActionError('');

    try {
      await makeAdmin(selectedUser.id);

      setShowMakeAdmin(false);
      setSelectedUser(null);

      showToast('User is now an admin');

      await fetchUsers();
    } catch (err) {
      setActionError(getErrorMessage(err).message);
    } finally {
      setAdminActionLoading(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!selectedUser?.id) return;

    setAdminActionLoading(true);
    setActionError('');

    try {
      await removeAdmin(selectedUser.id);

      setShowRemoveAdmin(false);
      setSelectedUser(null);

      showToast('Admin privileges removed');

      await fetchUsers();
    } catch (err) {
      setActionError(getErrorMessage(err).message);
    } finally {
      setAdminActionLoading(false);
    }
  };

  const handleClearCache = async () => {
    setClearing(true);
    setActionError('');

    try {
      await clearAppCache();

      setShowCache(false);

      showToast('Application cache cleared');
    } catch (err) {
      setActionError(getErrorMessage(err).message);
    } finally {
      setClearing(false);
    }
  };

  const getUserName = (u: AdminUser) =>
    u.userName || u.username || 'Unknown';

  const getRole = (u: AdminUser) => {
    if (u.roles && u.roles.length) {
      return u.roles.join(', ');
    }

    if (u.role) {
      return u.role;
    }

    return 'USER';
  };

  const isAdmin = (u: AdminUser) => {
    const roles = u.roles || (u.role ? [u.role] : []);

    return roles.some(
      (r) => r?.toUpperCase().includes('ADMIN')
    );
  };

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-ink">
            Admin Dashboard
          </h1>

          <p className="text-sm text-ink-secondary mt-1">
            Manage users and application settings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCache(true)}
            className="btn-secondary"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">
              Clear Cache
            </span>
          </button>
        </div>
      </div>

      {loading && <Loading message="Loading users..." />}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={fetchUsers}
        />
      )}

      {!loading && !error && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-bg-soft/50">
            <div className="flex items-center gap-2">
              <Users
                size={16}
                className="text-ink-secondary"
              />

              <h2 className="text-sm font-semibold text-ink">
                All Users ({users.length})
              </h2>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-ink-muted">
                No users found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-ink-muted">
                    <th className="px-5 py-3 font-medium">
                      Username
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Role
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Sentiment Analysis
                    </th>

                    <th className="px-5 py-3 font-medium text-right">
                      Status
                    </th>

                    <th className="px-5 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u, i) => (
                    <tr
                      key={u.id || getUserName(u) + i}
                      className="border-b border-border last:border-0 hover:bg-bg-soft/30 transition-colors"
                    >
                      <td className="px-5 py-3 text-ink font-medium">
                        {getUserName(u)}
                      </td>

                      <td className="px-5 py-3 text-ink-secondary">
                        {getRole(u)}
                      </td>

                      <td className="px-5 py-3 text-ink-secondary">
                        {u.sentimentAnalysis === true
                          ? 'Enabled'
                          : u.sentimentAnalysis === false
                            ? 'Disabled'
                            : '—'}
                      </td>

                      <td className="px-5 py-3 text-right">
                        {isAdmin(u) ? (
                          <span className="inline-flex items-center gap-1 text-xs text-primary">
                            <ShieldCheck size={14} />
                            Admin
                          </span>
                        ) : (
                          <span className="text-xs text-ink-muted">
                            User
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3 text-right">
                        {u.id && (
                          isAdmin(u) ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(u);
                                setShowRemoveAdmin(true);
                                setActionError('');
                              }}
                              className="text-xs text-error hover:underline"
                            >
                              Remove Admin
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(u);
                                setShowMakeAdmin(true);
                                setActionError('');
                              }}
                              className="text-xs text-primary hover:underline"
                            >
                              Make Admin
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {actionError && (
        <div className="mt-4 text-sm text-error bg-error/5 border border-error/20 rounded-md px-3 py-2 max-w-xl">
          {actionError}
        </div>
      )}

      {/* Make Admin Dialog */}
      <ConfirmDialog
        open={showMakeAdmin}
        title="Make user an admin?"
        message={
          selectedUser
            ? `This will give ${getUserName(selectedUser)} admin privileges. Their existing account and data will not be changed.`
            : ''
        }
        confirmLabel="Make Admin"
        loading={adminActionLoading}
        onConfirm={handleMakeAdmin}
        onCancel={() => {
          setShowMakeAdmin(false);
          setSelectedUser(null);
          setActionError('');
        }}
      />

      {/* Remove Admin Dialog */}
      <ConfirmDialog
        open={showRemoveAdmin}
        title="Remove admin privileges?"
        message={
          selectedUser
            ? `This will remove admin privileges from ${getUserName(selectedUser)}. Their user account and data will not be deleted.`
            : ''
        }
        confirmLabel="Remove Admin"
        danger
        loading={adminActionLoading}
        onConfirm={handleRemoveAdmin}
        onCancel={() => {
          setShowRemoveAdmin(false);
          setSelectedUser(null);
          setActionError('');
        }}
      />

      {/* Clear Cache Dialog */}
      <ConfirmDialog
        open={showCache}
        title="Clear application cache?"
        message="This will clear the application cache on the server. This may temporarily slow down responses."
        confirmLabel="Clear cache"
        danger
        loading={clearing}
        onConfirm={handleClearCache}
        onCancel={() => {
          setShowCache(false);
          setActionError('');
        }}
      />

      {toast && (
        <Toast
          message={toast}
          type="success"
        />
      )}
    </AppLayout>
  );
}