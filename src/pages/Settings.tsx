import { useState, useEffect } from 'react';

import AppLayout from '@/components/layout/AppLayout';

import {
  Loading,
  ConfirmDialog,
  Toast
} from '@/components/common/Feedback';

import { useAuth } from '@/hooks/useAuth';

import {
  updateSentimentAnalysis,
  deleteUser
} from '@/api/userApi';

import { getErrorMessage } from '@/utils/errorHandler';

export default function Settings() {

  const {
    user,
    logout,
    updateUser
  } = useAuth();

  const [sentimentEnabled, setSentimentEnabled] =
    useState(false);

  const [loadingSetting, setLoadingSetting] =
    useState(false);

  const [showDelete, setShowDelete] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [toast, setToast] =
    useState('');

  /*
   * Always keep the toggle synchronized
   * with the authenticated user's backend state.
   */
  useEffect(() => {

    setSentimentEnabled(
      !!user?.sentimentAnalysis
    );

  }, [user?.sentimentAnalysis]);


  const handleToggleSentiment = async (
    enabled: boolean
  ) => {

    setError('');
    setLoadingSetting(true);

    try {

      /*
       * Backend saves the setting,
       * calculates weekly sentiment,
       * and returns the complete updated User.
       */
      const updatedUser =
        await updateSentimentAnalysis({
          sentimentAnalysis: enabled,
        });

      /*
       * Use backend response as source of truth.
       */
      updateUser(updatedUser);

      /*
       * Update this page immediately.
       */
      setSentimentEnabled(
         !!updatedUser.sentimentAnalysis
      );

      setToast(
        updatedUser.sentimentAnalysis
          ? 'Sentiment analysis enabled'
          : 'Sentiment analysis disabled'
      );

      setTimeout(
        () => setToast(''),
        3000
      );

    } catch (err) {

      setError(
        getErrorMessage(err).message
      );

    } finally {

      setLoadingSetting(false);
    }
  };


  const handleDeleteAccount = async () => {

    setDeleting(true);
    setError('');

    try {

      await deleteUser();

      logout();

      window.location.href = '/login';

    } catch (err) {

      setError(
        getErrorMessage(err).message
      );

    } finally {

      setDeleting(false);
      setShowDelete(false);
    }
  };


  return (

    <AppLayout>

      <h1 className="text-2xl font-semibold text-ink mb-6">
        Settings
      </h1>

      <div className="space-y-6 max-w-xl">

        {/* Sentiment Analysis */}

        <div className="card p-6">

          <h2 className="text-base font-semibold text-ink mb-1">
            Sentiment Analysis
          </h2>

          <p className="text-sm text-ink-secondary mb-4">
            When enabled, your journal entries will be
            analyzed for sentiment.
          </p>

          <div className="flex items-center justify-between">

            <span className="text-sm text-ink">
              {sentimentEnabled
                ? 'Enabled'
                : 'Disabled'}
            </span>

            <button
              onClick={() =>
                handleToggleSentiment(
                  !sentimentEnabled
                )
              }
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                sentimentEnabled
                  ? 'bg-primary'
                  : 'bg-border'
              }`}
              disabled={loadingSetting}
              aria-label="Toggle sentiment analysis"
            >

              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                  sentimentEnabled
                    ? 'translate-x-5'
                    : ''
                }`}
              />

            </button>

          </div>

          {loadingSetting && (

            <div className="mt-3">

              <Loading
                message="Updating..."
                className="!py-2"
              />

            </div>

          )}

        </div>


        {/* Account */}

        <div className="card p-6">

          <h2 className="text-base font-semibold text-ink mb-1">
            Account
          </h2>

          <p className="text-sm text-ink-secondary mb-4">
            Manage your account. This action is permanent.
          </p>

          <button
            onClick={() =>
              setShowDelete(true)
            }
            className="btn-danger"
          >
            Delete account
          </button>

        </div>


        {error && (

          <div className="text-sm text-error bg-error/5 border border-error/20 rounded-md px-3 py-2">
            {error}
          </div>

        )}

      </div>


      <ConfirmDialog
        open={showDelete}
        title="Delete your account?"
        message="This will permanently delete your account and all associated data. This action cannot be undone."
        confirmLabel="Delete account"
        danger
        loading={deleting}
        onConfirm={handleDeleteAccount}
        onCancel={() =>
          setShowDelete(false)
        }
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