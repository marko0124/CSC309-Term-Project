import React from 'react';
import {useAuth} from '../context/authContext';

const UserForm = ({ 
  formData, 
  handleInputChange, 
  handleSubmit, 
  editMode, 
  onCancel 
}) => {
  const {user} = useAuth();
  const form = [];
  if (!editMode) {
    form.push(
      <div className='form-group' key="utorid">
        <label>UTORid:</label>
        <input 
          id="utorid"
          type="text" 
          name="utorid"
          value={formData.utorid}
          onChange={handleInputChange}
          required
        />
      </div>
      
    );
    form.push(
      <div className='form-group' key="name">
        <label>Name:</label>
        <input 
          id='name'
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
    );
    form.push(
      <div className='form-group' key="email">
        <label>Email:</label>
        <input 
          id='email'
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
    );
  } else {
    form.push(
      <div className='form-group' key="email">
        <label>Email:</label>
        <input 
          id='email'
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>
    );
    form.push(
      <div className='form-group' key="checkbox" id="checkbox-group">
        <label>Verified:</label>
        <input 
          id='verified'
          type="checkbox"
          name="verified"
          checked
          value={formData.verified}
          onChange={handleInputChange}
        />
        <label>Suspicious:</label>
        <input 
          id='suspicious'
          type="checkbox"
          name="suspicious"
          value={formData.suspicious}
          onChange={handleInputChange}
        />
      </div>
    );
    form.push(
      <div className='form-group' key="role">
        <label>Role:</label>
        <select 
          id='role'
          name="role"
          value={formData.role}
          onChange={handleInputChange}
        >
          <option value="regular">Regular</option>
          <option value="cashier">Cashier</option>
          {
            user.role === "superuser" && (
              <option value="manager">Manager</option>
            )
          }
          {
            user.role === "superuser" && (
              <option value="superuser">Superuser</option>
            )
          }
        </select>
      </div>
    );
  }

  return (
    <>
      <div className="overlay" onClick={onCancel}></div>
      <div className="popup">
        <div className="popup-inner">
          <h2>{editMode ? 'Edit User' : 'Create New User'}</h2>              
          <form onSubmit={handleSubmit}>
            {form}
          </form>
          <div id="popup-buttons">
            <button className="popup-btn cancel-btn" onClick={onCancel}>Cancel</button>                
            <button className="popup-btn submit-btn" onClick={handleSubmit}>
              {editMode ? 'Edit User' : 'Create New User'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserForm;