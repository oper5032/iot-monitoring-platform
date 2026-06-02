import React from 'react';
import {
  CSidebar,
  CSidebarHeader,
  CSidebarBrand,
  CSidebarNav,
  CNavItem,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer } from '@coreui/icons';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const AppSidebar = () => {
  const location = useLocation();

  return (
    <CSidebar visible className="border-end" style={{ minHeight: '100vh' }}>
      <CSidebarHeader className="border-bottom d-flex align-items-center px-3" style={{ height: '60px' }}>
        <NavLink to="/dashboard" className="d-flex align-items-center text-decoration-none">

          <img
            src={logo}
            alt="logo"
            style={{
              height: '32px',
              marginRight: '10px'
            }}
          />
        </NavLink>
      </CSidebarHeader>

      <CSidebarNav>
        <CNavItem
          component={NavLink}
          to="/dashboard"
          active={location.pathname === '/dashboard'}
        >
          <CIcon customClassName="nav-icon" icon={cilSpeedometer} />
          대시보드
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
};

export default AppSidebar;