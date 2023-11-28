// Navbar.tsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { SearchField } from './search_field/SearchField';
import { useAuth } from '../../common/auth';
import { toast } from 'react-toastify';


interface NavbarProps {
  // Add any additional props you may need
}

const Navbar: React.FC<NavbarProps> = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState<boolean>(user.userId !== null);
  
  useEffect(() => { setLoggedIn(user.userId !== null); }
  , [user]);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    toast(`Logged out`, { type: 'success' })
  };

  const handleLogin= () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

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
        {/* Add more navigation links as needed */}
        <div className='search-field-container'><SearchField/></div>
        {loggedIn ? (
          <>
            <li className="nav-item" onClick={handleLogout}>
              Logout
            </li>
          </>
        ) : (
          <>
            <li className="nav-item" onClick={handleLogin}>
              Log in
            </li>
            <li className="nav-item" onClick={handleRegister}>
              Register
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
