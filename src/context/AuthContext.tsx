import {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

import type { User } from '@/types/auth';

import {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getStoredUser,
  setStoredUser,
} from '@/utils/authStorage';

import {
  login as apiLogin,
  signup as apiSignup,
  getCurrentUser,
  type LoginRequest,
} from '@/api/authApi';

import { setOnUnauthorized } from '@/api/client';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;

  login: (data: LoginRequest) => Promise<void>;
  signup: (data: LoginRequest) => Promise<void>;
  logout: () => void;

  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);

function inferUserFromToken(token: string): User | null {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    const decoded = JSON.parse(atob(payload));

    const roles =
      decoded.roles ||
      (decoded.role ? [decoded.role] : ['USER']);

    return {
      userName:
        decoded.sub ||
        decoded.username ||
        decoded.userName ||
        '',

      username:
        decoded.sub ||
        decoded.username ||
        decoded.userName ||
        '',

      roles,
      role: roles[0],

      sentimentAnalysis:
        decoded.sentimentAnalysis ?? false,
    };
  } catch {
    return null;
  }
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const logout = useCallback(() => {
    removeAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  /*
   * Update the authenticated user AND localStorage.
   *
   * This is important because the JWT itself doesn't change
   * when sentimentAnalysis is toggled.
   */
  const updateUser = useCallback(
    (updates: Partial<User>) => {
      setUser((currentUser) => {
        if (!currentUser) {
          return currentUser;
        }

        const updatedUser = {
          ...currentUser,
          ...updates,
        };

        setStoredUser(
          JSON.stringify(updatedUser)
        );

        return updatedUser;
      });
    },
    []
  );

const refreshUser = useCallback(async () => {
  try {
    const freshUser = await getCurrentUser();

    console.log("FRESH USER FROM BACKEND:", freshUser);

    setUser(freshUser);
    setStoredUser(JSON.stringify(freshUser));
  } catch (error) {
    console.error("Failed to refresh user:", error);
  }
}, []);

  useEffect(() => {
    setOnUnauthorized(logout);
  }, [logout]);

 useEffect(() => {
  const storedToken = getAuthToken();

  if (!storedToken) {
    setIsLoading(false);
    return;
  }

  setToken(storedToken);

  getCurrentUser()
    .then((backendUser) => {
      setUser(backendUser);
      setStoredUser(JSON.stringify(backendUser));
    })
    .catch(() => {
      const storedUserStr = getStoredUser();

      if (storedUserStr) {
        try {
          setUser(JSON.parse(storedUserStr) as User);
        } catch {
          const inferred = inferUserFromToken(storedToken);

          if (inferred) {
            setUser(inferred);
          }
        }
      }
    })
    .finally(() => {
      setIsLoading(false);
    });
}, []);

const login = useCallback(
  async (data: LoginRequest) => {
    const jwt = await apiLogin(data);

    if (!jwt || typeof jwt !== 'string') {
      throw new Error(
        'No token received from server.'
      );
    }

    setAuthToken(jwt);
    setToken(jwt);

    try {
      const backendUser = await getCurrentUser();

  
      const loggedInUser = {
        ...backendUser,
        sentimentAnalysis: false,
      };

      setUser(loggedInUser);

      setStoredUser(
        JSON.stringify(loggedInUser)
      );

    } catch (error) {
      console.error(
        'Failed to fetch user from backend:',
        error
      );

      const finalUser =
        inferUserFromToken(jwt);

      if (finalUser) {
        const loggedInUser = {
          ...finalUser,
          sentimentAnalysis: false,
        };

        setUser(loggedInUser);

        setStoredUser(
          JSON.stringify(loggedInUser)
        );
      }
    }
  },
  []
);

  const signup = useCallback(
    async (data: LoginRequest) => {
      await apiSignup(data);
    },
    []
  );

  const isAdmin = (() => {
    if (!user) {
      return false;
    }

    const roles =
      user.roles ||
      (user.role ? [user.role] : []);

    return roles.some((role) =>
      role?.toUpperCase().includes('ADMIN')
    );
  })();

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;