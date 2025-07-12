import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  location?: string;
  availability?: string;
  profile_photo?: string;
  is_public: boolean;
  rating: number;
  bio?: string;
  date_joined: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[AuthContext] Checking authentication status...');
        const response = await fetch('http://172.16.91.34:8000/api/session-check/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('[AuthContext] Session check response:', data);
          
          if (data.authenticated) {
            setUser(data.user);
            console.log('[AuthContext] User authenticated:', data.user.username);
            
            // Set up session timeout warning
            if (data.time_remaining && data.time_remaining < 300) { // 5 minutes warning
              console.log('[AuthContext] Session expiring soon:', data.time_remaining, 'seconds');
            }
          } else {
            console.log('[AuthContext] User not authenticated');
            setUser(null);
          }
        } else {
          console.log('[AuthContext] Session check failed:', response.status);
          setUser(null);
        }
      } catch (error) {
        console.error('[AuthContext] Authentication check error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Set up periodic session checks (every 5 minutes)
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('[AuthContext] Attempting login...');
      const response = await fetch('http://172.16.91.34:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[AuthContext] Login successful:', data);
        setUser(data.user);
        
        // Log session information
        if (data.session_timeout) {
          console.log('[AuthContext] Session timeout set to:', data.session_timeout, 'seconds');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('[AuthContext] Login failed:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch('http://172.16.91.34:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        setUser(responseData.user);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('http://172.16.91.34:8000/api/auth/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const response = await fetch('http://172.16.91.34:8000/api/users/profile/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 