import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as promotionService from '../services/promotionService';

const usePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingPromotionId, setEditingPromotionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeButtons, setActiveButtons] = useState({
    oneTime: false,
    automatic: false,
    started: false,
    ended: false
  });
  const [filter, setFilter] = useState({
    name: '',
    type: null,
    page: 1,
    limit: itemsPerPage,
    started: false,
    ended: false,
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    promotionType: 'one-time', 
    startDate: '',
    endDate: '',
    minSpending: null,
    rate: null,
    points: null
  });

  const fetchPromotions = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const data = await promotionService.fetchPromotions(page, itemsPerPage, filter);
      setPromotions(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, itemsPerPage]);

  useEffect(() => {
    fetchPromotions(currentPage);
  }, [fetchPromotions, currentPage]);

  // Update the toggleFilterButton function
const toggleFilterButton = (buttonKey) => {
  // Just update the active buttons state, don't search yet
  setActiveButtons(prev => ({
    ...prev,
    [buttonKey]: !prev[buttonKey]
  }));
};

const applyFilters = useCallback(() => {
  // Your existing code to determine filterType and set filter state
  let filterType = null;
  if (activeButtons.oneTime && !activeButtons.automatic) {
    filterType = 'one-time';
  } else if (!activeButtons.oneTime && activeButtons.automatic) {
    filterType = 'automatic';
  } else if (activeButtons.oneTime && activeButtons.automatic) {
    filterType = 'both';
  }
  
  // Set filter state
  setFilter({
    ...filter,
    name: searchTerm,
    type: filterType,
    started: activeButtons.started,
    ended: activeButtons.ended,
    page: 1
  });
  
  // NEW: Update URL parameters
  const params = new URLSearchParams();
  if (searchTerm) params.set('search', searchTerm);
  if (filterType) params.set('type', filterType);
  if (activeButtons.started) params.set('started', 'true');
  if (activeButtons.ended) params.set('ended', 'true');
  params.set('page', '1');
  
  setSearchParams(params);
  setCurrentPage(1);
}, [activeButtons, filter, searchTerm, setSearchParams]);


  // Update the handleSearch function to use applyFilters
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    applyFilters(); // Apply all filters including search term and button filters
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    // Update page in URL without losing other parameters
    searchParams.set('page', page.toString());
    setSearchParams(searchParams);
  };

  const handlePromotionClick = async (promotion, e) => {
    e.preventDefault();
    setSelectedPromotion({...promotion, loading: true});
    
    try {
      const details = await promotionService.fetchPromotionDetails(promotion.id);
      setSelectedPromotion(details);
    } catch (error) {
      console.error('Error fetching promotion details:', error);
      setSelectedPromotion(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.startDate || 
        !formData.endDate || !formData.promotionType) {
      alert('Please fill in all required fields.');
      return;
    }
    
    const promotionData = {
      name: formData.title,
      description: formData.description,
      type: formData.promotionType,
      startTime: new Date(formData.startDate + 'T00:00:00').toISOString(),
      endTime: new Date(formData.endDate + 'T00:00:00').toISOString(),
      minSpending: formData.minSpending || null,
      rate: formData.rate || null,
      points: formData.points || null,
    };
    
    try {
      if (editMode) {
        await promotionService.updatePromotion(editingPromotionId, promotionData);
      } else {
        await promotionService.createPromotion(promotionData);
      }
      
      resetForm();
      fetchPromotions(currentPage);
    } catch (error) {
      console.error('Error submitting promotion:', error);
      alert(`Failed to ${editMode ? 'update' : 'create'} promotion: ${error.message}`);
    }
  };

  const handleEditClick = () => {
    setEditingPromotionId(selectedPromotion.id);
    
    setFormData({
      title: selectedPromotion.name,
      description: selectedPromotion.description,
      promotionType: selectedPromotion.type,
      startDate: new Date(selectedPromotion.startTime).toISOString().split('T')[0],
      endDate: new Date(selectedPromotion.endTime).toISOString().split('T')[0],
      minSpending: selectedPromotion.minSpending || '',
      rate: selectedPromotion.rate || '',
      points: selectedPromotion.points || ''
    });
    
    setEditMode(true);
    setSelectedPromotion(null);
    setButtonPopup(true);
  };

  const handleDeleteClick = async () => {
    if (!selectedPromotion) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this promotion?');
    if (confirmDelete) {
      try {
        await promotionService.deletePromotion(selectedPromotion.id);
        setSelectedPromotion(null);
        fetchPromotions(currentPage);
      } catch (error) {
        console.error('Error deleting promotion:', error);
        alert('Failed to delete promotion: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setButtonPopup(false);
    setEditMode(false);
    setEditingPromotionId(null);
    setFormData({
      title: '',
      description: '',
      promotionType: 'one-time',
      startDate: '',
      endDate: '',
      minSpending: '',
      rate: '',
      points: ''
    });
  };

  return {
    promotions,
    loading,
    currentPage,
    itemsPerPage,
    buttonPopup,
    selectedPromotion,
    searchTerm,
    activeButtons,
    filter,
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
  };
};

export default usePromotions;