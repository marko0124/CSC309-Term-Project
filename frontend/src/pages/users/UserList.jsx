import React from 'react';
import Pagination from './Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';

const UserList = ({ 
  users, 
  currentPage, 
  itemsPerPage, 
  onPageChange, 
  onUserClick,
  bookmarked,
  toggleBookmark
}) => {
  if (!users.results || users.results.length === 0) {
    return <div className="no-results">No users :(</div>;
  }
  
  return (
    <>
      <div className='users'>
        {users.results.map((user, index) => (
          <ul className='user' key={user.id || index}>
            <div className='user-details'> 
              <div className='user-tag'>{user.role}</div> 
              <p>{user.verified ? "Verified" : "Unverified"}</p>
            </div>
            <div 
              className="user-clickable"
              onClick={(e) => onUserClick(user, e)}
            >
              <div className='user-title'>{user.name}
                <button 
                  className="bookmark-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(user);
                  }}
                >
                  <FontAwesomeIcon
                    icon={bookmarked.some(u => u.id === user.id) ? solidBookmark : regularBookmark}
                  />
                </button>
              </div>
              <p className='user-description'>
                UTORid: {user.utorid} | Email: {user.email} | Points: {user.points}
              </p>
            </div>
            <div className='divider'></div>
          </ul>
        ))}
      </div>
      
      <Pagination 
        totalItems={users.count || 0}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </>
  );
};

export default UserList;