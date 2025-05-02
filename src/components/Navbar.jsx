import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineHome, AiOutlineTeam, AiOutlineContacts, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaCog } from 'react-icons/fa';
import logo from '../assets/LogoBK.png';
import './Navbar.css';

const Navbar = ({ isMinimized, onToggle }) => {
  const location = useLocation();

  return (
    <nav className={`navbar ${isMinimized ? 'minimized' : ''}`}>
      <div className="navbar-brand">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="navbar-logo" />
          {!isMinimized && <h2>Smart Home</h2>}
        </div>
      </div>
      <div className="nav-links">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <AiOutlineHome className="nav-icon" />
          {!isMinimized && <span>Dashboard</span>}
        </Link>
        <Link to="/about" className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>
          <AiOutlineTeam className="nav-icon" />
          {!isMinimized && <span>About</span>}
        </Link>
        <Link to="/contact" className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}>
          <AiOutlineContacts className="nav-icon" />
          {!isMinimized && <span>Contact</span>}
        </Link>
        <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
          <FaCog className="nav-icon" />
          {!isMinimized && <span>Settings</span>}
        </Link>
      </div>
      <button className="toggle-btn" onClick={onToggle}>
        {isMinimized ? <AiOutlineMenu /> : <AiOutlineClose />}
      </button>
    </nav>
  );
};

export default Navbar; 