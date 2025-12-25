import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  // Check for saved user on load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
        <Navbar user={user} setUser={setUser} />

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/login"
            element={
              !user ? <Auth setUser={setUser} /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
