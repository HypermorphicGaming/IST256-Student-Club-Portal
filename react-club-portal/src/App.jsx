import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import ManageUsers from './ManageUsers';

function Home() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="container">
        <section className="hero">
          <h2>Welcome to the Student Club Portal</h2>
          <p>Discover clubs, connect with members, and manage events</p>
        </section>

        <section className="dashboard d-grid gap-3">
          <Link to="/register" className="btn btn-primary btn-lg">Register</Link>
          <Link to="/manage-users" className="btn btn-primary btn-lg">Manage Users</Link>
          <Link to="/manage-events" className="btn btn-primary btn-lg">Manage Events</Link>
        </section>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-auto d-flex align-items-center justify-content-center">
        <p className="mb-0">&copy; 2026 Student Club Portal | IST 256 Group 1</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage-users" element={<ManageUsers />} />
      </Routes>
    </Router>
  );
}

export default App
