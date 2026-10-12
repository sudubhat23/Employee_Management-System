import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { username: 'Admin', role: 'ROLE_ADMIN', name: 'Sudarshan Bhat' };
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true' || true; // Default true for smooth portfolio browsing
    });

    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const login = (authData) => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
        
        if (authData) {
            if (authData.token) {
                setToken(authData.token);
                localStorage.setItem('token', authData.token);
            }
            const userInfo = {
                id: authData.id,
                username: authData.username || 'admin',
                email: authData.email || 'admin@company.com',
                name: (authData.firstname ? authData.firstname + ' ' + (authData.lastname || '') : 'Admin User').trim(),
                role: authData.role || 'ROLE_ADMIN'
            };
            setUser(userInfo);
            localStorage.setItem('user', JSON.stringify(userInfo));
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setToken(null);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, theme, toggleTheme }}>
            {children}
        </AuthContext.Provider>
    );
};
