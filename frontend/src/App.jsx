import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import ApprovalPage from './ApprovalPage'
import CatalogCart from './CatalogCart'
import Checkout from './Checkout'
import Home from './Home'
import ManageEvents from './ManageEvents'
import ManageUsers from './ManageUsers'
import Navbar from './NavBar'
import OrderHistory from './OrderHistory'

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
