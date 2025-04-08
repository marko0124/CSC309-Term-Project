import React from 'react';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;
    onPageChange(newPage);
  };
  
  return (
    <div className="pagination">
      <button 
        type="button"
        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Previous
      </button>
      
      <span className="page-info">
        Page {currentPage} of {totalPages || 1}
      </span>
      
      <button 
        type="button"
        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;