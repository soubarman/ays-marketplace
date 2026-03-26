import React, { createContext, useContext, useState, type ReactNode } from 'react';

import { apiClient } from '../api/client';

export type UserRole = 'customer' | 'provider' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  district?: string;
  pincode?: string;
  phone?: string;
  service?: string;
  pricePerHour?: number;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, email: string, password?: string) => Promise<void>;
  register: (registerData: any) => Promise<void>;
  updateProfile: (profileData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  React.useEffect(() => {
    // Try to restore session on mount
    const checkUser = async () => {
      try {
        if (localStorage.getItem('ays_token')) {
          const userData = await apiClient('/auth/me');
          setUser({
            ...userData,
            id: userData._id,
          });
        }
      } catch (err) {
        localStorage.removeItem('ays_token');
      }
    };
    checkUser();
  }, []);

  const login = async (_role: UserRole, email: string, password = 'password') => {
    const data = await apiClient('/auth/login', { body: { email, password } });
    localStorage.setItem('ays_token', data.token);
    setUser({
      id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
  };
  
  const register = async (registerData: any) => {
    const data = await apiClient('/auth/register', { body: registerData });
    localStorage.setItem('ays_token', data.token);
    setUser({
      ...data,
      id: data._id,
    });
  };

  const updateProfile = async (profileData: any) => {
    const updatedUser = await apiClient('/users/profile', { method: 'PUT', body: profileData });
    setUser((prev: any) => ({ ...prev, ...updatedUser }));
  };

  const logout = () => {
    localStorage.removeItem('ays_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
