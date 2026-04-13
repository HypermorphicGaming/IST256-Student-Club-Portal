import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          Student Club Portal
        </Link>
        <ul className="navbar-nav ms-auto flex-row flex-wrap gap-1 gap-lg-2">
          <li className="nav-item">
            <NavLink className="nav-link px-2 px-lg-3" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link px-2 px-lg-3" to="/register">
              Register
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link px-2 px-lg-3" to="/checkout">
              Checkout
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link px-2 px-lg-3" to="/orders">
              Order History
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link px-2 px-lg-3" to="/manage-users">
              Manage Users
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link px-2 px-lg-3" to="/manage-events">
              Manage Events
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link px-2 px-lg-3" to="/approval">
              Admin Dashboard
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
