import React from 'react';
import './Users.css';
import './PopUp.css';
import UserSearchFilters from './UserSearchFilters.jsx';
import UserList from './UserList.jsx';
import UserForm from './UserForm';
import UserDetails from './UserDetails';
import HomeNavbar from './HomeNavbar.jsx';
import useUsers from './useUsers.js';
import {useAuth} from '../context/authContext.js'

const Users = () => {
  const {
    users,
    loading,
    currentPage,
    itemsPerPage,
    buttonPopup,
    selectedUser,
    searchTerm,
    activeButtons,
    formData,
    editMode,
    setButtonPopup,
    setSearchTerm,
    setSelectedUser,
    handleSearch,
    handlePageChange,
    handleUserClick,
    handleInputChange,
    handleSubmit,
    handleEditClick,
    toggleFilterButton,
    resetForm
  } = useUsers();

  const {user} = useAuth();

  const fullDescription = "View all users and make changes to their information.";

  if (loading) return <div>Loading...</div>;

  return (
    <div className='user-page'>
      <main>
        <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
        <HomeNavbar />
        
        {/* Header Section */}
        <div className='header-container'> 
          <div className='header-text'>
            <h1>User Management Dashboard</h1>
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
        <div className='users-list-container'>
          <div className='users-list'> 
            <UserSearchFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeButtons={activeButtons}
              toggleFilterButton={toggleFilterButton}
              onSearch={handleSearch}
              onCreateClick={() => setButtonPopup(true)}
              userCount={users.count}
            />
            
            <UserList 
              users={users}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onUserClick={handleUserClick}
            />
          </div>
        </div>
        
        <div className='footer'>Footer</div>
      </main>

      {/* Popups */}
      {buttonPopup && (
        <UserForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          editMode={editMode}
          onCancel={resetForm}
        />
      )}

      {selectedUser && (
        <UserDetails 
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={handleEditClick}
        />
      )}
    </div>
  );
};

export default Users;