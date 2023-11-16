// Navbar.tsx

import React from 'react';
import { Link } from 'react-router-dom'; // If using React Router for navigation
import './navbar.css';
import { SearchField } from './search_field/SearchField';


interface NavbarProps {
  // Add any additional props you may need
}

const Navbar: React.FC<NavbarProps> = () => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
      <header className="app-header">
      <Link to="/">BookWorld</Link>
      </header>
      <div className='spacer'/>
        <li className="nav-item">
          <Link to="/">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/ranking">Ranking</Link>
        </li>
        <li className="nav-item">
          <Link to="/contact">Contact</Link>
        </li>
        <li className="nav-item">
          <Link to="/login">Log in</Link>
        </li>
        <li className="nav-item">
          <Link to="/register">Register</Link>
        </li>
        {/* Add more navigation links as needed */}
        <div className='search-field-container'><SearchField/></div>
      </ul>
    </nav>
  );
};

export default Navbar;
