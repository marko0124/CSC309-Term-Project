import React, {useState, useEffect} from 'react';
import {useAuth} from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import {QRCodeSVG} from 'qrcode.react';
import './UserProfile.css';
import apiClient from '../api/client';
import HomeNavbar from './HomeNavbar';

const Users = () => {
    const {user} = useAuth();
    const nav = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editing, setEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        birthday: ""
    });

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await apiClient.get('/users/me', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                if (response.status !== 200) {
                    throw new Error("Failed to get user data.");
                }
                setUserData(response.data);
                setFormData({
                    name: response.data.name || "",
                    email: response.data.email || "",
                    birthday: response.data.birthday || ""
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getUserData();
    }, [nav, user]);

    const handleEdit = () => {
        setEditing(!editing);
        setSuccess("");
        setError("");
        if (!editing) {
            setFormData({
                name: userData?.name || "",
                email: userData?.email || "",
                birthday: userData?.birthday || ""
            });
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const changed = {};
            if (formData.name !== userData.name) changed.name = formData.name;
            if (formData.email !== userData.email) changed.email = formData.email;
            if (formData.birthday !== userData.birthday) changed.birthday = formData.birthday;

            if (Object.keys(changed).length === 0) {
                setEditing(false);
                setLoading(false);
                return;
            }
            const response = await apiClient.patch('/users/me', changed, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (response.status !== 200) {
                throw new Error(`Failed to update user data. With status ${response.status}`);
            }
            setUserData(response.data);
            setSuccess("Profile updated successfully!");
            setEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fullDescription = "View and manage your profile information.";

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <h1>Loading...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <h1>Error</h1>
                    <p>There was an error loading your profile: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='profile-page'>
            <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            <HomeNavbar />
            
            {/* Header Section */}
            <div className='header-container'> 
                <div className='header-text'>
                    <h1>My Profile</h1>
                    <div className='header-text-details'>
                        <p className='user-tag'>{String(userData?.role || "").charAt(0).toUpperCase() + String(userData?.role || "").slice(1)}</p>
                        <p>Account Management</p>
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
            <div className='profile-container'>
                <div className='profile-card-wrapper'>
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
                    
                    {editing ? (
                        <div className="profile-form-wrapper">
                            <div className="profile-form-header">
                                <h2>Edit Profile</h2>
                                <button 
                                    className="cancel-button" 
                                    onClick={handleEdit}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className='profile-form'>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    <div className="form-help">Must end with @mail.utoronto.ca</div>
                                </div>

                                <div className="form-group">
                                    <label>Birthday</label>
                                    <input
                                        type="date"
                                        id="birthday"
                                        name="birthday"
                                        value={formData.birthday}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="save-button"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="profile-info-wrapper">
                            <div className="profile-info-header">
                                <h2>Profile Information</h2>
                                <button
                                    className="edit-button"
                                    onClick={handleEdit}
                                >
                                    Edit Profile
                                </button>
                            </div>
                            
                            <div className="profile-info-grid">
                                <div className="info-card">
                                    <div className="info-section">
                                        <h3>Account Details</h3>
                                        <div className="info-row">
                                            <span className="info-label">UTORid:</span>
                                            <span className="info-value">{userData?.utorid}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Name:</span>
                                            <span className="info-value">{userData?.name}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Email:</span>
                                            <span className="info-value">{userData?.email}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Birthday:</span>
                                            <span className="info-value">{userData?.birthday}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Role:</span>
                                            <span className="info-value">{userData?.role}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="info-card">
                                    <div className="info-section">
                                        <h3>Loyalty Information</h3>
                                        <div className="info-row">
                                            <span className="info-label">Points:</span>
                                            <span className="info-value points">{userData?.points}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Verified:</span>
                                            <span className="info-value">{userData?.verified ? "Yes" : "No"}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Created:</span>
                                            <span className="info-value">{new Date(userData?.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Last Login:</span>
                                            <span className="info-value">{userData?.lastLogin ? new Date(userData?.lastLogin).toLocaleDateString() : "Never"}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="info-card qr-card">
                                    <div className="info-section">
                                        <h3>My QR Code</h3>
                                        <div className="qr-container">
                                            <QRCodeSVG
                                                value={`${userData?.id}`}
                                                size={150}
                                                bgColor={"#ffffff"}
                                                fgColor={"#000000"}
                                                level={"L"}
                                            />
                                        </div>
                                        <div className="qr-info">
                                            <p>Show this QR code to earn or redeem points</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="info-card action-card">
                                    <div className="info-section">
                                        <h3>Account Actions</h3>
                                        <div className="action-buttons">
                                            <button 
                                                className="action-button"
                                                onClick={() => nav('/change-password')}
                                            >
                                                Change Password
                                            </button>
                                            
                                            {userData?.role === 'superuser' && (
                                                <button 
                                                    className="action-button"
                                                    onClick={() => nav('/home/manager')}
                                                >
                                                    Manager View
                                                </button>
                                            )}

                                            {(userData?.role === 'superuser' || userData?.role === "manager") && (
                                                <button 
                                                    className="action-button"
                                                    onClick={() => nav('/home/cashier')}
                                                >
                                                    Cashier View
                                                </button>
                                            )}

                                            {(userData?.role === 'superuser' || userData?.role === "manager" || userData?.role === "cashier") && (
                                                <button 
                                                    className="action-button"
                                                    onClick={() => nav('/home/regular')}
                                                >
                                                    Regular User View
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <div className='footer'>Footer</div>
        </div>
    );
};

export default Users;