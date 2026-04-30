"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthTokens } from '@/lib/api/auth';

interface AuthContextType {
    user: AuthUser | null;
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    login: (user: AuthUser, tokens: AuthTokens) => void;
    logout: () => void;
    updateUser: (user: AuthUser) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [tokens, setTokens] = useState<AuthTokens | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load auth data from localStorage on mount
        const storedUser = localStorage.getItem('auth_user');
        const storedTokens = localStorage.getItem('auth_tokens');

        if (storedUser && storedTokens) {
            try {
                setUser(JSON.parse(storedUser));
                setTokens(JSON.parse(storedTokens));
            } catch (e) {
                console.error("Failed to parse stored auth data", e);
                localStorage.removeItem('auth_user');
                localStorage.removeItem('auth_tokens');
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback((user: AuthUser, tokens: AuthTokens) => {
        setUser(user);
        setTokens(tokens);
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('auth_tokens', JSON.stringify(tokens));
        // Also set as cookie if needed for server-side
        document.cookie = `access_token=${tokens.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setTokens(null);
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_tokens');
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }, []);

    const updateUser = useCallback((updatedUser: AuthUser) => {
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            tokens,
            isAuthenticated: !!user,
            login,
            logout,
            updateUser,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
