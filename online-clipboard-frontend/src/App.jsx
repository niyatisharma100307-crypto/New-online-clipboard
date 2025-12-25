import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner"; // Ensure Toaster is here for notifications

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <BrowserRouter>
      {/* 1. Add Toaster for the black notifications */}
      <Toaster theme="dark" position="bottom-right" />

      {/* 2. FIXED: Changed bg-gray-50 to bg-black and text-gray-900 to text-white */}
      <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-purple-500 selection:text-white">
        
        <Navbar user={user} setUser={setUser} />

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/login"
            element={
              !user ? <Auth setUser={setUser} /> : <Navigate to="/" />
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