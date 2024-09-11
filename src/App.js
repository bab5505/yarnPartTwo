import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Inventory from './Inventory';
import ProgressTracker from './ProgressTracker';
import Projects from './Projects';
function App() {
  return (
    <Router>
      <div className="App">
        <h1>Yarn App</h1>
        <nav>
          <Link to="/"><button>Home</button></Link>
          <Link to="/inventory"><button>Inventory</button></Link>
          <Link to="/progress-tracker"><button>Progress Tracker</button></Link>
          <Link to="/projects"><button>Projects</button></Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/progress-tracker" element={<ProgressTracker />} />
          <Route path="/projects" element={<Projects />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
