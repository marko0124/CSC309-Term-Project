import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';
import apiClient from '../api/client';

const LogIn = () => {
    const nav = useNavigate();
    const [utorid, setUtorid] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetMode, setResetMode] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [resetReq, setResetReq] = useState(false);
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.post(`/auth/tokens`, {
                utorid,
                password
            });

            const data = response;
            localStorage.setItem("token", data.token);
            localStorage.setItem("expiresAt", data.expiresAt);
            nav('/home');
        } catch (err) {
            if (err.message.includes("401")) {
                setError("Invalid credentials. Please try again");
            } else if (err.message.includes("404")) {
                setError("User not found.");
            } else {
                setError("Network error. Please check your connection and try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="login-card">
            <div className="login-container">
                <form className="login-form" onSubmit={handleLogin}>
                    <h1>Log In</h1>
                    
                    <div className="form-group">
                        <label>UTORid</label>
                        <input
                            type="text"
                            id="utorid"
                            value={utorid}
                            onChange={(e) => setUtorid(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                        <button 
                            type="button" 
                            className="btn-link"
                            onClick={() => setResetMode(true)}
                            disabled={loading}
                        >
                            Forgot Password?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LogIn;