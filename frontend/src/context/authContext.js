import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
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
                    setLoading(false);
                    return;
                }
    
                const expiry = new Date(expiresAt);
                const now = new Date();
                if (now > expiry) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('expiresAt');
                    setUser(null);
                    setLoading(false);
                    return;
                }
    
                try {
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
                        token
                    });
                } catch (err) {
                    setError(err.message);
                    setUser(null);
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
        setUser(null);
        nav('/');
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;