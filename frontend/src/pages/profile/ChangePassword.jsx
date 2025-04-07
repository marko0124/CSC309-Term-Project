import React, {useState} from 'react';
import {useAuth} from '../../context/authContext';
import './ChangePassword.css';
import apiClient from '../../api/client';
import HomeNavbar from '../navbar/HomeNavbar';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const {user} = useAuth();
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        old: "",
        new: "",
        confirm: ""
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (formData.new !== formData.confirm) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);

        try {
            const response = await apiClient.patch('users/me/password',
                {old: formData.old, new: formData.new},
                {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error(`Failed to update user password. With status ${response.status}`);
            }
            setSuccess("Password successfully updated.");
            setFormData({
                old: "",
                new: "",
                confirm: ""
            });
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError("Current password is incorrect.");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    if(loading) {
        if (loading) {
            return (
                <div className="profile-page">
                    <div className="profile-card">
                        <h1>Loading...</h1>
                    </div>
                </div>
            );
        }
    }

    const fullDescription = "Update your account password.";

    return (
        <div className='password-page'>
            <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            <HomeNavbar />
            
            {/* Header Section */}
            <div className='header-container'> 
                <div className='header-text'>
                    <h1>Change Password</h1>
                    <div className='header-text-details'>
                        <p className='user-tag'>{String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1)}</p>
                        <p>Account Security</p>
                    </div>
                    <div className='expandable-text'>
                        <p className='header-text-description'>
                            {fullDescription}
                        </p>
                    </div>
                </div>
            </div>
        
            <div className="custom-shape-divider-top-1743545933">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
                </svg>
            </div>
            
            {/* Main Content */}
            <div className='password-container'>
                <div className='password-form-wrapper'>
                    <div className="password-form-title">Update Your Password</div>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}
                    
                    <form className="password-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Current Password <span className="required">*</span></label>
                            <input
                                type="password"
                                id="old"
                                name="old"
                                value={formData.old}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>New Password <span className="required">*</span></label>
                            <input
                                type="password"
                                id="new"
                                name="new"
                                value={formData.new}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                            <div className="form-help">
                                Must be 8-20 characters and include at least one lowercase letter, 
                                one uppercase letter, one number, and one special character.
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Confirm New Password <span className="required">*</span></label>
                            <input
                                type="password"
                                id="confirm"
                                name="confirm"
                                value={formData.confirm}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>
                        
                        <div className="password-requirements">
                            <h3>Password Requirements:</h3>
                            <ul>
                                <li>8 to 20 characters in length</li>
                                <li>At least one uppercase letter (A-Z)</li>
                                <li>At least one lowercase letter (a-z)</li>
                                <li>At least one number (0-9)</li>
                                <li>At least one special character (@$!%*?&)</li>
                            </ul>
                        </div>
                        
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="update-button"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </form>
                    <div className="action-section">
                        <div className="info-card action-card">
                            <div className="info-section">
                                <h3>Account Actions</h3>
                                <div className="action-buttons">
                                    <button 
                                        className="action-button"
                                        onClick={() => nav('/profile')}
                                    >
                                        Back to Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='footer'>Footer</div>
        </div>
    );
};

export default ChangePassword;