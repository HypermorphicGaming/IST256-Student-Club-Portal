import './App.css'

function App() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="container">
        <section className="hero">
          <h2>Welcome to the Student Club Portal</h2>
          <p>Discover clubs, connect with members, and manage events</p>
        </section>

        <section className="dashboard d-grid gap-3">
          <a href="catalogCart.html" className="btn btn-primary btn-lg">Register</a>
          <a href="manageUsers.html" className="btn btn-primary btn-lg">Manage Users</a>
          <a href="manageEvents.html" className="btn btn-primary btn-lg">Manage Events</a>
        </section>
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-auto d-flex align-items-center justify-content-center">
        <p className="mb-0">&copy; 2026 Student Club Portal | IST 256 Group 1</p>
      </footer>
    </div>
  )
}

export default App
