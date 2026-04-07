import { Link } from 'react-router-dom';
import Footer from './components/Footer';

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

      <Footer />
    </div>
  );
}

export default Home;