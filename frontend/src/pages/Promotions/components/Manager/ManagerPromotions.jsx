import React, { useState } from 'react';
import '../Promotions.css';
import '../PopUp.css';
import usePromotions from '../../hooks/usePromotions';
import ManagerSearchFilters from './ManagerSearchFilters';
import PromotionList from '../PromotionList';
import PromotionForm from './PromotionForm';
import ManagerPromotionDetails from './ManagerPromotionDetails';
import supermarketImage from '../../assets/supermarket.avif';
import HomeNavbar from '../../../navbar/HomeNavbar.jsx';

const ManagerPromotions = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const {
    promotions,
    loading,
    currentPage,
    itemsPerPage,
    buttonPopup,
    selectedPromotion,
    searchTerm,
    activeButtons,
    formData,
    editMode,
    setButtonPopup,
    setSearchTerm,
    setSelectedPromotion,
    handleSearch,
    handlePageChange,
    handlePromotionClick,
    handleInputChange,
    handleSubmit,
    handleEditClick,
    handleDeleteClick,
    toggleFilterButton,
    resetForm
  } = usePromotions();

  const fullDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  const truncatedDescription = fullDescription.substring(0, 100) + "...";

  if (loading) return <div>Loading...</div>;

  return (
    <div className='promotion-page'>
      <main>
        <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
        <HomeNavbar />
        
        {/* Header Section */}
        <div className='header-container'> 
          <div className='header-text'>
            <h1>Your Promotions!</h1>
            <div className='header-text-details'>
              {/* <p className='promotion-tag'>some type</p> */}
              {/* <p> Some Date</p> */}
            </div>
            <div className='expandable-text'>
              <p className='header-text-description'>
                Look out for our promotions to make purchasing cheaper and easier! 
              </p>
              <button 
                className='show-more-button'
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
              </button>
            </div>
          </div>
          <div className='header-image'>
            <img className='himg' src={supermarketImage} alt="promotion" />
          </div>
        </div>
      
        <div className="custom-shape-divider-top-1743545933">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
        </div>
        
        {/* Main Content */}
        <div className='promotions-list-container'>
          <div className='promotions-list'> 
            <ManagerSearchFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeButtons={activeButtons}
              toggleFilterButton={toggleFilterButton}
              onSearch={handleSearch}
              onCreateClick={() => setButtonPopup(true)}
              promotionCount={promotions.count}
            />
            
            <PromotionList 
              promotions={promotions}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onPromotionClick={handlePromotionClick}
            />
          </div>
        </div>
        
        <div className='footer'>Footer</div>
      </main>

      {/* Popups */}
      {buttonPopup && (
        <PromotionForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          editMode={editMode}
          onCancel={resetForm}
        />
      )}

      {selectedPromotion && (
        <ManagerPromotionDetails 
          promotion={selectedPromotion}
          onClose={() => setSelectedPromotion(null)}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}
    </div>
  );
};

export default ManagerPromotions;