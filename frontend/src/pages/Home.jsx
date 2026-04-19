import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

function Home() {
  return (
    <PageShell>
      <main className="container">
        <section className="hero">
          <h2>Welcome to the Student Club Portal</h2>
          <p>Discover clubs, connect with members, and manage events</p>
          <img
            src="/public/Old-Main-1024x682.jpg"
            alt="Old Main"
            className="hero"
            />
        </section>

        <section className="dashboard d-grid gap-3">
          <Link to="/register" className="btn btn-primary btn-lg">
            Register
          </Link>
          <Link to="/manage-users" className="btn btn-primary btn-lg">
            Manage Users
          </Link>
          <Link to="/manage-events" className="btn btn-primary btn-lg">
            Manage Events
          </Link>
        </section>
      </main>
    </PageShell>
  )
}

export default Home
