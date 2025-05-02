import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import About from './components/About'
import Contact from './components/Contact'
import Settings from './components/Settings'
import './App.css'

function App() {
  const [isNavbarMinimized, setIsNavbarMinimized] = useState(false);

  const handleNavbarToggle = () => {
    setIsNavbarMinimized(!isNavbarMinimized);
  };

  return (
    <Router>
      <div className="app">
        <Navbar isMinimized={isNavbarMinimized} onToggle={handleNavbarToggle} />
        <main className={`main-content ${isNavbarMinimized ? 'navbar-minimized' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard isMinimized={isNavbarMinimized} />} />
            <Route path="/about" element={<About isMinimized={isNavbarMinimized} />} />
            <Route path="/contact" element={<Contact isMinimized={isNavbarMinimized} />} />
            <Route path="/settings" element={<Settings isMinimized={isNavbarMinimized} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
