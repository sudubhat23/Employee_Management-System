import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : { 
            id: 1, 
            username: 'admin', 
            role: 'ROLE_ADMIN', 
            name: 'Admin User',
            email: 'admin@company.com',
            employeeId: null
        };
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const auth = localStorage.getItem('isAuthenticated');
        return auth !== null ? auth === 'true' : false; // Require login by default
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
                name: (authData.name ? authData.name : (authData.firstname ? authData.firstname + ' ' + (authData.lastname || '') : 'User')).trim(),
                role: authData.role || 'ROLE_ADMIN',
                employeeId: authData.employeeId || null
            };
            setUser(userInfo);
            localStorage.setItem('user', JSON.stringify(userInfo));
        }
    };

    const updateLocalProfile = (updatedDetails) => {
        setUser((prev) => {
            const next = { ...prev, ...updatedDetails };
            localStorage.setItem('user', JSON.stringify(next));
            return next;
        });
    };

    const switchDemoRole = (roleType) => {
        if (roleType === 'employee') {
            const empUser = {
                id: 3,
                username: 'sarah',
                email: 'sarah.connor@techcorp.com',
                name: 'Sarah Connor',
                role: 'ROLE_EMPLOYEE',
                employeeId: 1
            };
            setUser(empUser);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(empUser));
            localStorage.setItem('isAuthenticated', 'true');
        } else if (roleType === 'manager') {
            const mgrUser = {
                id: 2,
                username: 'elena',
                email: 'elena.r@techcorp.com',
                name: 'Elena Rostova',
                role: 'ROLE_MANAGER',
                employeeId: 3
            };
            setUser(mgrUser);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(mgrUser));
            localStorage.setItem('isAuthenticated', 'true');
        } else {
            // Default to Admin
            const adminUser = {
                id: 1,
                username: 'admin',
                email: 'admin@company.com',
                name: 'Administrator',
                role: 'ROLE_ADMIN',
                employeeId: null
            };
            setUser(adminUser);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(adminUser));
            localStorage.setItem('isAuthenticated', 'true');
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

    const isAdmin = user?.role === 'ROLE_ADMIN';
    const isManager = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_MANAGER';
    const isEmployee = user?.role === 'ROLE_EMPLOYEE';

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            token, 
            user, 
            login, 
            logout, 
            theme, 
            toggleTheme,
            isAdmin,
            isManager,
            isEmployee,
            switchDemoRole,
            updateLocalProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};
