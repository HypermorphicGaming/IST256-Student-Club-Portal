import React from 'react';
import { Link } from 'react-router-dom'; // if using React Router

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Student Club Portal</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">  {/* ms-auto pushes links to the right if needed */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Register</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manage-users">Manage Users</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manage-events">Manage Events</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/checkout">Checkout</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/theme-finalization">Final Theme Options</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;