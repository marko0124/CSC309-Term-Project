import React from 'react';
import {useAuth} from '../../context/authContext';

const UserDetails = ({ 
  user, 
  onClose, 
  onEdit 
}) => {
  const {user: curr} = useAuth();
  const {role} = curr;
  const valid_roles = ["regular", "cashier", "manager", "superuser"];
  return (
    <>
      <div className="overlay" onClick={onClose}></div>
      <div className="detail-popup">
        <div className="detail-popup-inner">
          <div className="detail-popup-header">
            <div><h2>{user.name}</h2></div>
            <div>
              <div className="detail-popup-user-tag">{user.role}</div>
              <div className="user-utorid">
                UTORid: {user.utorid}
              </div>
            </div>
          </div>

          {user.loading ? (
            <div className="loading-spinner">Loading details...</div>
          ) : (
            <div className="user-details-popup">
              <p>Email: {user.email}</p>
              <p>Birthday: {user.birthday ? new Date(user.birthday).toLocaleDateString() : "N/A"}</p>
              <p>Points: {user.points}</p>
              <p>Created At: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p>Last Login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</p>                  
              <p>Verified: {user.verified ? "Verified" : "Unverified"}</p>
              <p>Suspicious: {user.suspicious ? "Suspicious" : "Not Suspicious"}</p>
            </div>
          )}
          
          <div id="detail-popup-buttons">
            <button className="popup-btn cancel-btn" onClick={onClose}>Close</button>
            {!user.loading && ((role === "manager" && valid_roles.indexOf(user.role) < valid_roles.indexOf(role)) || role === "superuser") && (
              <button className="popup-btn submit-btn" onClick={onEdit}>Edit User</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;