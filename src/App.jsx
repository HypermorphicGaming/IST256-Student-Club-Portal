import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import ManageUsers from './ManageUsers';
import CatalogCart from './CatalogCart';
import Checkout from './Checkout';
import Navbar from './NavBar.jsx';
import Home from './Home';


import ManageEvents from './ManageEvents';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<CatalogCart />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-events" element={<ManageEvents />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App
