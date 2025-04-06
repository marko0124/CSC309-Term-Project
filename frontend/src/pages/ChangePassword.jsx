import React, {useState} from 'react';
import {useAuth} from '../context/authContext';
import './UserProfile.css';
import apiClient from '../api/client';
import ProfileSidebar from './ProfileSidebar';

const ChangePassword = () => {
    const {user} = useAuth();
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

    return (
        <div className="page">
            <ProfileSidebar />
            <div className="profile-page">
                <div className="profile-card">
                    <div className="profile-header">
                        <h1>Change Password</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-group">
                            <label htmlFor="old">Current Password</label>
                            <input
                                type="password"
                                id="old"
                                name="old"
                                value={formData.old}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new">New Password</label>
                            <input
                                type="password"
                                id="new"
                                name="new"
                                value={formData.new}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirm"
                                name="confirm"
                                value={formData.confirm}
                                onChange={handleChange}
                            />
                        </div>

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

                        <button
                            type="submit"
                            className="btn-save"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default ChangePassword;