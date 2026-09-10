import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Notebook, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200 ${
      isActive
        ? 'text-white bg-primary'
        : 'text-ink-secondary hover:text-ink hover:bg-bg-soft'
    }`;

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <NavLink to="/dashboard" className="flex items-center gap-2 text-ink">
              <Notebook size={20} className="text-primary" />
              <span className="font-semibold text-base tracking-tight">Journal</span>
            </NavLink>
            <nav className="hidden sm:flex items-center gap-1">
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/journals" className={linkClass}>Journals</NavLink>
              <NavLink to="/settings" className={linkClass}>Settings</NavLink>
              {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-ink-secondary">
              {user?.userName || user?.username}
            </span>
            <button onClick={handleLogout} className="btn-ghost px-2.5" aria-label="Log out">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="sm:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/journals" className={linkClass}>Journals</NavLink>
          <NavLink to="/settings" className={linkClass}>Settings</NavLink>
          {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
        </nav>
      </div>
    </header>
  );
}
