import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "sonner";
import { wakeUpServer } from "./services/api";
import Community from "./pages/Community";
import ServerWakingUp from "./components/ServerWakingUp"; 

function App() {
  const [user, setUser] = useState(null);
  const [serverReady, setServerReady] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const initializeServer = async () => {
      try {
        await wakeUpServer(); 
        setServerReady(true);
      } catch (err) {
        setServerReady(true);
        console.log(err)
      }
    };

    initializeServer();
  }, []);


  return (
    <BrowserRouter>
      <Toaster theme="dark" position="bottom-right" />

      <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-purple-500 selection:text-white">
        <Navbar user={user} setUser={setUser} />

        {/* Render the Status Widget here, passing the status */}
        <ServerWakingUp isReady={serverReady} />

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/login"
            element={!user ? <Auth setUser={setUser} /> : <Navigate to="/" />}
          />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} /> : <Navigate to="/login" />
            }
          />
          <Route path="/community" element={<Community />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;