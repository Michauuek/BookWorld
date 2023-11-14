// Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router for navigation
import './navbar.css';

interface NavbarProps {
  // Add any additional props you may need
}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
      <header className="app-header">
        BookWorld
      </header>
      <div className='spacer'/>
        <li className="nav-item">
          <Link to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/about">About</Link>
        </li>
        <li className="nav-item">
          <Link to="/contact">Contact</Link>
        </li>
        {/* Add more navigation links as needed */}
      </ul>
    </nav>
  );
};

export default Navbar;
