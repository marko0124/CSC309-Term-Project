import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';
import { useAuth } from '../context/authContext';
import {createUser} from './userService.js';
import './CreateUser.css';

const CreateUser = () => {
    const nav = useNavigate();
    const {user} = useAuth();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        utorid: "",
        name: "",
        email: ""
    });

    if (user.role !== "cashier" && user.role !== "manager" && user.role !== "superuser") {
        nav('/home');
        return;
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            await createUser(formData, user.token);
            setSuccess(true);
            setFormData({
                utorid: "",
                name: "",
                email: ""
            });
        } catch (err) {
            if (err.message.includes("409")) {
                setError("A user with this UTORid or email already exists.");
            } else {
                setError(`Failed to create user: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const fullDescription = "Create a new user by filling out the form below. All fields are required.";

    return (
        <div className='create-user-page'>
            <main>
                <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
                <HomeNavbar />
                
                {/* Header Section */}
                <div className='header-container'> 
                    <div className='header-text'>
                        <h1>Create New User</h1>
                        <div className='header-text-details'>
                        <p className='user-tag'>{String(user.role).charAt(0).toUpperCase() + String(user.role).slice(1)}</p>
                        <p> User Administration</p>
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
                <div className='create-user-container'>
                    <div className='create-user-form-wrapper'>
                        <div className='create-user-title'>Create a New User</div>
                        
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className="success-message">
                                User created successfully!
                            </div>
                        )}
                        
                        <form className="create-user-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="utorid">UTORid: <span className="required">*</span></label>
                                <input
                                id="utorid"
                                type="text"
                                name="utorid"
                                value={formData.utorid}
                                onChange={handleInputChange}
                                placeholder="e.g. smith123"
                                required
                                disabled={loading}
                                />
                                <div className="form-help">Must be 8 alphanumeric characters</div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="name">Full Name: <span className="required">*</span></label>
                                <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. John Smith"
                                required
                                disabled={loading}
                                />
                                <div className="form-help">Between 1 and 50 characters</div>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="email">Email: <span className="required">*</span></label>
                                <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="e.g. john.smith@mail.utoronto.ca"
                                required
                                disabled={loading}
                                />
                                <div className="form-help">Must end with @mail.utoronto.ca</div>
                            </div>
                            
                            <div className="form-actions">
                                <button 
                                type="button" 
                                className="cancel-button"
                                onClick={() => nav('/home')}
                                disabled={loading}
                                >
                                Cancel
                                </button>
                                <button 
                                type="submit" 
                                className="create-button"
                                disabled={loading}
                                >
                                {loading ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='footer'>Footer</div>
            </main>
        </div>
    );
};

export default CreateUser;