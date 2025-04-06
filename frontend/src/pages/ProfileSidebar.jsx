import React from 'react';
import {NavLink} from 'react-router-dom';
import './ProfileSidebar.css';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarMenu,
    CDBSidebarFooter,
    CDBSidebarMenuItem,
  } from 'cdbreact';
import {useAuth} from '../context/authContext';

const ProfileSidebar = () => {
    const {logout, user} = useAuth();
    const cashier = user?.role === "cashier" || user?.role === "manager" || user?.role === "superuser";
    const manager = user?.role === "manager" || user?.role === "superuser";
    const superuser = user?.role === "superuser";

    const options = [];
    options.push(
      <NavLink exact="true" to="/home" className={({isActive}) => isActive ? "activeClicked" : ""} key="home">
        <CDBSidebarMenuItem>Home</CDBSidebarMenuItem>
      </NavLink>
    );
    options.push(
        <NavLink exact="true" to="/profile" className={({isActive}) => isActive ? "activeClicked" : ""} key="profile">
          <CDBSidebarMenuItem>Profile</CDBSidebarMenuItem>
        </NavLink>
      );
    options.push(
      <NavLink exact="true" to="/change-password" className={({isActive}) => isActive ? "activeClicked" : ""} key="change-password">
          <CDBSidebarMenuItem>Change Password</CDBSidebarMenuItem>
        </NavLink>
    );
    if (cashier) {
      options.push(
        <NavLink exact="true" to="/home/regular" className={({isActive}) => isActive ? "activeClicked" : ""} key="regular-user-view">
          <CDBSidebarMenuItem>Regular User View</CDBSidebarMenuItem>
        </NavLink>
      );
    }
    if (manager) {
      options.push(
        <NavLink exact="true" to="/home/cashier" className={({isActive}) => isActive ? "activeClicked" : ""} key="cashier-view">
          <CDBSidebarMenuItem>Cashier View</CDBSidebarMenuItem>
        </NavLink>
      );
    }
    if (superuser) {
      options.push(
        <NavLink exact="true" to="/home/manager" className={({isActive}) => isActive ? "activeClicked" : ""} key="manager-view">
          <CDBSidebarMenuItem>Manager View</CDBSidebarMenuItem>
        </NavLink>
      );
    }

    return (
        <div className="sidebar-container">
          <CDBSidebar textColor="#fff" backgroundColor="#428dc6" className="sidebar">
            <CDBSidebarContent className="sidebar-content">
              <CDBSidebarMenu style={{textAlign: 'center'}}>
                {options}
              </CDBSidebarMenu>
            </CDBSidebarContent>

            <CDBSidebarFooter style={{ textAlign: 'center' }}>
                <div
                    className="sidebar-btn-wrapper"
                    onClick={logout}
                >
                    <CDBSidebarMenuItem>Logout</CDBSidebarMenuItem>
                </div>
            </CDBSidebarFooter>
          </CDBSidebar>
        </div>
      );
};

export default ProfileSidebar;