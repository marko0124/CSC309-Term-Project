import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../../context/authContext';
import './LogIn.css';
import apiClient from '../../api/client';

const LogIn = () => {
    const nav = useNavigate();
    const {login} = useAuth();
    const [utorid, setUtorid] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [reset, setReset] = useState(false);
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
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("expiresAt", response.data.expiresAt);
            const result = await login(response.data.token);
            if (!result.success) {
                throw new Error("No user found.");
            }
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

    const reqPasswordReset = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/resets', {utorid});
            setResetToken(response.data.resetToken);
            setResetReq(true);
        } catch (err) {
            if (err.response) {
                if (err.response.status === 400) {
                    setError("Bad request.");
                } else if (err.response.status === 429) {
                    setError("Too many password reset requests.");
                } else if (err.response.status === 404) {
                    setError("User not found.");
                }
            } else {
                setError("Network error. Please check your connection and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const completePasswordReset = async (e) => {
        e.preventDefault();
        if (newPass !== confirmPass) {
            setError("Passwords do not match.");
            return;
        }
        setError("");
        setLoading(true);

        try {
            await apiClient.post(`/auth/resets/${resetToken}`, {
                utorid,
                password: newPass
            });
            setResetSuccess(true);
            setTimeout(() => {
                setReset(false);
                setResetSuccess(false);
                setResetReq(false);
                setResetToken("");
                setNewPass("");
                setConfirmPass("");
                nav('/');
            }, 2000);
        } catch (err) {
            if (err.response) {
                if (err.response.status === 400) {
                    setError("Bad request.");
                } else if (err.response.status === 404) {
                    setError("User or reset token not found.");
                } else if (err.response.status === 410) {
                    setError("Reset token has expired.");
                }
            } else {
                setError("Network error. Please check your connection and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (reset) {
        if (resetSuccess) {
            return (
                <div className="login-container">
                    <div className="login-form">
                        <h1>Password Reset Successful</h1>
                        <p>Your password has been updated.</p>
                    </div>
                </div>
            );
        }
        if (resetReq) {
            return (
                <div className="login-page">
                    <div className="login-card">
                        <div className="login-container">
                            <form className="login-form" onSubmit={completePasswordReset}>
                                <h1>Reset Your Password</h1>
                                <p>Enter your new password</p>

                                <div className='form-group'>
                                    <label>New Password</label>
                                    <input 
                                        type="password"
                                        id="newPass"
                                        value={newPass}
                                        onChange={(e) => setNewPass(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Confirm Password</label>
                                    <input 
                                        type="password"
                                        id="confirmPass"
                                        value={confirmPass}
                                        onChange={(e) => setConfirmPass(e.target.value)}
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
                                        {loading ? 'Loading...' : 'Reset Password'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn-link"
                                        onClick={() => {
                                            setReset(false);
                                            setResetReq(false);
                                        }}
                                        disabled={loading}
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="login-page">
                <div className="login-card">
                    <div className="login-container">
                        <form className="login-form" onSubmit={reqPasswordReset}>
                            <h1>Reset Your Password</h1>
                            <p>Enter UTORid for password reset.</p>

                            <div className='form-group'>
                                <label>UTORid</label>
                                <input 
                                    type="text"
                                    id="utorid"
                                    value={utorid}
                                    onChange={(e) => setUtorid(e.target.value)}
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
                                    {loading ? 'Loading...' : 'Request Reset'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn-link"
                                    onClick={() => setReset(false)}
                                    disabled={loading}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="login-page">
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
                                onClick={() => setReset(true)}
                                disabled={loading}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LogIn;