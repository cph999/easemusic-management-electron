import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home.tsx';
import Login from './components/Login.tsx';
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 假设这里是登录成功后的回调
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  const handleLogOut = () => {
    setIsAuthenticated(false);

  }
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/home/*"
          element={
            isAuthenticated ? (
              <Home handleLogOut={handleLogOut} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;