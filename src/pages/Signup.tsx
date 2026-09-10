import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errorHandler';
import { Notebook } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup({ username, password });
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <Notebook size={24} className="text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-ink">Create your account</h1>
          <p className="text-sm text-ink-secondary mt-1.5">Start your journaling journey</p>
        </div>

        {success ? (
          <div className="card p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-success text-lg font-semibold">✓</span>
            </div>
            <h2 className="text-base font-semibold text-ink mb-2">Account created</h2>
            <p className="text-sm text-ink-secondary mb-6">
              You can now sign in with your credentials.
            </p>
            <button onClick={() => navigate('/login')} className="btn-primary w-full">
              Go to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div>
              <label htmlFor="username" className="label">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="Choose a username"
                autoComplete="off"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Choose a password"
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-error bg-error/5 border border-error/20 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        )}

        {!success && (
          <p className="text-center text-sm text-ink-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
