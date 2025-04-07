import { useState, useEffect, useCallback } from 'react';
import * as userService from './userService';
import {useAuth} from '../context/authContext';

const useUsers = () => {
  const {user} = useAuth();
  const {token} = user;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeButtons, setActiveButtons] = useState({
    regular: false,
    cashier: false,
    manager: false,
    verified: false,
    activated: false
  });
  const [filter, setFilter] = useState({
    name: '',
    role: "",
    page: 1,
    limit: itemsPerPage,
    verified: false,
    activated: false,
  });
  const [formData, setFormData] = useState({
    utorid: "",
    name: "",
    email: "",
    verified: true,
    suspicious: false,
    role: ""
  });
  

  const fetchUsers = useCallback(async (page = 1, token) => {
    setLoading(true);
    try {
      const data = await userService.fetchUsers(page, itemsPerPage, filter, token);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, itemsPerPage]);

  useEffect(() => {
    fetchUsers(currentPage, token);
  }, [fetchUsers, currentPage, token]);

  const toggleFilterButton = (buttonKey) => {
    const newActiveButtons = {
      ...activeButtons,
      [buttonKey]: !activeButtons[buttonKey]
    };
    
    setActiveButtons(newActiveButtons);
    
    let filterRole = [];
    if (newActiveButtons.regular) {
      filterRole.push('regular');
    }
    if (newActiveButtons.cashier) {
      filterRole.push('cashier');
    }
    if (newActiveButtons.manager) {
      filterRole.push('manager');
    }
    if (newActiveButtons.superuser) {
      filterRole.push('superuser');
    }
    if (filterRole.length === 0) {
      filterRole = null;
    }
    
    const newFilter = {
      ...filter,
      role: filterRole,
      verified: newActiveButtons.verified,
      activated: newActiveButtons.activated
    };
    
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearch = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    setFilter({
      ...filter,
      name: searchTerm,
      page: 1
    });
    
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUserClick = async (user, e) => {
    e.preventDefault();
    setSelectedUser({...user, loading: true});
    
    try {
      const details = await userService.fetchUserDetails(user.id, token);
      setSelectedUser(details);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setSelectedUser(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const userData = {}
    
    if (!editMode) {
      userData.utorid = formData.utorid;
      userData.name = formData.name;
      userData.email = formData.email;
    } else {
      userData.email = formData.email;
      userData.verified = formData.verified;
      userData.suspicious = formData.suspicious;
      userData.role = formData.role;
    }
    
    try {
      if (editMode) {
        await userService.updateUser(editingUserId, userData, token);
      } else {
        await userService.createUser(userData, token);
      }
      
      resetForm();
      fetchUsers(currentPage, token);
    } catch (error) {
      console.error('Error submitting user:', error);
      alert(`Failed to ${editMode ? 'update' : 'create'} promotion: ${error.message}`);
    }
  };

  const handleEditClick = () => {
    setEditingUserId(selectedUser.id);
    
    setFormData({
      email: selectedUser.email,
      verified: selectedUser.verified,
      suspicious: selectedUser.suspicious,
      role: selectedUser.role
    });
    
    setEditMode(true);
    setSelectedUser(null);
    setButtonPopup(true);
  };

  const resetForm = () => {
    setButtonPopup(false);
    setEditMode(false);
    setEditingUserId(null);
    setFormData({
      utorid: "",
      name: "",
      email: "",
      verified: false,
      suspicious: false,
      role: ""
    });
  };

  return {
    users,
    loading,
    currentPage,
    itemsPerPage,
    buttonPopup,
    selectedUser,
    searchTerm,
    activeButtons,
    filter,
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
  };
};

export default useUsers;