import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import ApprovalPage from './pages/ApprovalPage'
import CatalogCart from './pages/CatalogCart'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import ManageEvents from './pages/ManageEvents'
import ManageUsers from './pages/ManageUsers'
import Navbar from './NavBar'
import OrderHistory from './pages/OrderHistory'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/approval" element={<ApprovalPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<CatalogCart />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-events" element={<ManageEvents />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
    </Router>
  )
}

export default App
