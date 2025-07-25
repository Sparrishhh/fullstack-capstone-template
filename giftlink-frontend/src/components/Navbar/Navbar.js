import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">GiftLink</Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/app">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/app/search">Gifts</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/app/login">Login</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/app/register">Register</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
