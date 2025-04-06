import React, {useState, useEffect} from 'react';
import {useAuth} from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import {QRCodeSVG} from 'qrcode.react';
import './UserProfile.css';
import apiClient from '../api/client';
import ProfileSidebar from './ProfileSidebar';

const Users = () => {
    const {user} = useAuth();
    const nav = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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
            setEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
        <div className="page">
            <ProfileSidebar />
            <div className="profile-page">
                <div className="profile-card">
                    <div className="profile-header">
                        <h1>My Profile</h1>
                        <button
                            className={`btn-edit ${editing ? 'btn-cancel' : ''}`}
                            onClick={handleEdit}
                        >
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    {editing ? (
                        <form onSubmit={handleSubmit} className='edit-form'>
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
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
                                />
                            </div>

                            <div className="form-group">
                                <label>Birthday</label>
                                <input
                                    type="date"
                                    id="birthday"
                                    name="birthday"
                                    value={formData.birthday}
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-save"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    ) : (
                        <div className="profile-content">
                            <div className="profile-info">
                                <div className="info-row">
                                    <span className="label">UTORid:</span>
                                    <span className="value">{userData?.utorid}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Name:</span>
                                    <span className="value">{userData?.name}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Email:</span>
                                    <span className="value">{userData?.email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Birthday:</span>
                                    <span className="value">{userData?.birthday}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Role:</span>
                                    <span className="value">{userData?.role}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Points:</span>
                                    <span className="value">{userData?.points}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Created At:</span>
                                    <span className="value">{userData?.createdAt}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Last Login:</span>
                                    <span className="value">{userData?.lastLogin}</span>
                                </div>

                                <div className="qr-section">
                                    <h2>My QR Code</h2>
                                    <div className="qr-container">
                                        <QRCodeSVG
                                            value={`${userData?.id}`}
                                            size={200}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
    );
};

export default Users;