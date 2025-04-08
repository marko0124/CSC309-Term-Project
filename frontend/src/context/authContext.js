import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [originalRole, setOriginalRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const nav = useNavigate();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const expiresAt = localStorage.getItem('expiresAt');
                if (!token || !expiresAt) {
                    setUser(null);
                    setOriginalRole("");
                    setLoading(false);
                    return;
                }
    
                const expiry = new Date(expiresAt);
                const now = new Date();
                if (now > expiry) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('expiresAt');
                    sessionStorage.removeItem("currRole");
                    setUser(null);
                    setOriginalRole("");
                    setLoading(false);
                    return;
                }
    
                try {
                    const currRole = sessionStorage.getItem("currRole");
                    const response = await apiClient.get('/users/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status !== 200) {
                        throw new Error('Could not fetch user.');
                    }
                    setUser({
                        ...response.data,
                        role: currRole || response.data.role,
                        token
                    });
                    setOriginalRole(response.data.role);
                } catch (err) {
                    setError(err.message);
                    setUser(null);
                    setOriginalRole("");
                }
            } catch (err) {
                setError("Not authorized.");
            } finally {
                setLoading(false);
            }
        };
        checkLogin();
    }, []);

    const login = async (token) => {
        setLoading(true);
        setError("");
        setOriginalRole("");

        try {
            const userData = await apiClient.get('/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!userData === 200) {
                throw new Error("No user.");
            }
            setUser({
                ...userData.data,
                token
            });
            setOriginalRole(userData.data.role);
            return {success: true};
        } catch (err) {
            setError(err.message);
            return {success: false, error: err.message};
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
        sessionStorage.removeItem("currRole");
        setUser(null);
        setOriginalRole("");
        nav('/');
    };

    const changeRole = (role) => {
        if (role === originalRole) {
            sessionStorage.removeItem("currRole");
        } else {
            sessionStorage.setItem("currRole", role);
        }
        setUser({
            ...user,
            role
        });
    }

    const value = {
        user,
        originalRole,
        loading,
        error,
        login,
        logout,
        changeRole,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;