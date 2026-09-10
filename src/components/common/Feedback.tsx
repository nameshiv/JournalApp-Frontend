import { ReactNode } from 'react';

interface LoadingProps {
  message?: string;
  className?: string;
}

export function Loading({ message = 'Loading...', className = '' }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="flex items-center gap-3 text-ink-secondary">
        <div className="w-4 h-4 border-2 border-border border-t-primary rounded-full animate-spin" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="card p-6 text-center">
      <p className="text-sm text-error">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-4">
          Try again
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  message: string;
  action?: ReactNode;
}

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="card p-8 sm:p-12 text-center">
      <p className="text-ink-secondary text-sm mb-4">{message}</p>
      {action}
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
  children,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative card p-6 max-w-sm w-full">
        <h3 className="text-base font-semibold text-ink mb-2">{title}</h3>
        <p className="text-sm text-ink-secondary mb-6">{message}</p>
        {children}
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={danger ? 'btn-danger' : 'btn-primary'}
            disabled={loading}
          >
            {loading ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export function Toast({ message, type = 'success' }: ToastProps) {
  const colors = {
    success: 'bg-success text-white',
    error: 'bg-error text-white',
    info: 'bg-info text-white',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-[fadeIn_0.2s_ease-out]">
      <div className={`px-4 py-3 rounded-md shadow-card text-sm font-medium ${colors[type]}`}>
        {message}
      </div>
    </div>
  );
}
